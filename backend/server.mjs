import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

await loadLocalEnv(resolve(__dirname, ".env"));

const PORT = Number(process.env.AI_PROXY_PORT || 8787);
const ALLOWED_ORIGIN = process.env.AI_PROXY_ORIGIN || "http://127.0.0.1:5173";
const DEEPSEEK_BASE_URL = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "");
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
const DEEPSEEK_THINKING = process.env.DEEPSEEK_THINKING || "disabled";
const SCORE_KEYS = ["health", "study", "social", "practice", "pressure"];

const courseKnowledgeBase = await readJson(resolve(projectRoot, "web/src/data/courseKnowledgeBase.json"));
const experienceTemplates = await readJson(resolve(projectRoot, "web/src/data/experienceTemplates.json"));

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "OPTIONS") {
    sendJson(response, 204, null);
    return;
  }

  try {
    if (request.method === "GET" && requestUrl.pathname === "/api/health") {
      sendJson(response, 200, {
        ok: true,
        provider: "deepseek",
        model: DEEPSEEK_MODEL,
        hasApiKey: Boolean(process.env.DEEPSEEK_API_KEY)
      });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/course-chat") {
      const body = await readRequestBody(request);
      const result = await handleCourseChat(body);
      sendJson(response, 200, result);
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/day-evaluation") {
      const body = await readRequestBody(request);
      const result = await handleDayEvaluation(body);
      sendJson(response, 200, result);
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/counterfactual-analysis") {
      const body = await readRequestBody(request);
      const result = await handleCounterfactualAnalysis(body);
      sendJson(response, 200, result);
      return;
    }

    sendJson(response, 404, { error: "接口不存在。" });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, {
      error: "AI 代理处理失败。",
      detail: error instanceof Error ? error.message : String(error)
    });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`AI proxy is running at http://127.0.0.1:${PORT}`);
  console.log(`DeepSeek model: ${DEEPSEEK_MODEL}`);
});

async function handleCourseChat(body) {
  const question = normalizeText(body?.question).slice(0, 500);
  const majorId = normalizeText(body?.majorId) || "computer";
  const majorName = normalizeText(body?.majorName);
  const dayContext = normalizeDayContext(body?.dayContext);
  const majorCourses = courseKnowledgeBase.filter((course) => course.majorId === majorId);
  const relatedCourses = selectRelatedCourses(majorCourses, question, 5);

  if (!question) {
    return {
      source: "local-fallback",
      answer: "可以先输入一个你想问的问题，比如“这个专业最难的课是什么？”或“高中生适合先了解哪门课？”",
      relatedCourses
    };
  }

  const localFallback = buildLocalCourseAnswer(question, relatedCourses, majorCourses, dayContext);

  if (!process.env.DEEPSEEK_API_KEY) {
    return {
      source: "local-fallback",
      answer: localFallback,
      relatedCourses,
      notice: "未配置 DEEPSEEK_API_KEY，当前使用本地课程知识库回答。"
    };
  }

  try {
    const answer = await callDeepSeek([
      {
        role: "system",
        content:
          "Use dayContext.profile, dayContext.scores and dayContext.selectedEvents as personalization context for the course consultation. Treat them as references, not as a final psychological or career assessment."
      },
      {
        role: "system",
        content: [
          "你是“大学平行时空”的课程咨询助手。",
          "用户是高中生，正在体验不同大学专业的一天。",
          "回答要亲和、简明、有画面感，避免堆术语。",
          "必须主要依据提供的课程知识库，不确定时要直接说明。",
          "使用以下结构：",
          "【简短回答】两到四句话",
          "【相关课程】列出 1-3 门课程和原因",
          "【体验提示】给高中生一个可执行的小建议"
        ].join("\n")
      },
      {
        role: "user",
        content: JSON.stringify(
          {
            question,
            majorId,
            majorName,
            dayContext,
            courseContext: relatedCourses.map(toCourseContext)
          },
          null,
          2
        )
      }
    ]);

    return {
      source: "deepseek",
      model: DEEPSEEK_MODEL,
      answer,
      relatedCourses
    };
  } catch (error) {
    console.error("DeepSeek course chat failed:", error);
    return {
      source: "local-fallback",
      answer: localFallback,
      relatedCourses,
      notice: "DeepSeek 暂时没有返回结果，已切换到本地课程知识库。"
    };
  }
}

async function handleDayEvaluation(body) {
  const payload = {
    majorName: normalizeText(body?.majorName) || "当前专业",
    scores: body?.scores || {},
    localProfile: body?.localProfile || null,
    selectedEvents: Array.isArray(body?.selectedEvents) ? body.selectedEvents.slice(0, 8) : [],
    featuredCourses: Array.isArray(body?.featuredCourses) ? body.featuredCourses.slice(0, 5) : []
  };
  const localFallback = buildLocalDayEvaluation(payload);

  if (!process.env.DEEPSEEK_API_KEY) {
    return {
      source: "local-fallback",
      answer: localFallback,
      notice: "未配置 DEEPSEEK_API_KEY，当前使用本地评价模板。"
    };
  }

  try {
    const answer = await callDeepSeek([
      {
        role: "system",
        content: [
          "你是面向高中生的专业体验反馈助手。",
          "请根据一天选择、五维评分和特色课程，生成温和但有洞察的体验评价。",
          "不要像职业测评下结论，也不要劝退；重点帮助学生理解专业生活。",
          "输出三段：1. 今天的体验画像；2. 课程与专业特征；3. 一句寄语。"
        ].join("\n")
      },
      {
        role: "user",
        content: JSON.stringify(payload, null, 2)
      }
    ]);

    return {
      source: "deepseek",
      model: DEEPSEEK_MODEL,
      answer
    };
  } catch (error) {
    console.error("DeepSeek day evaluation failed:", error);
    return {
      source: "local-fallback",
      answer: localFallback,
      notice: "DeepSeek 暂时没有返回结果，已切换到本地评价模板。"
    };
  }
}

async function handleCounterfactualAnalysis(body) {
  const goalId = normalizeText(body?.goalId) || "reducePressure";
  const majorId = normalizeText(body?.majorId) || "computer";
  const majorName = normalizeText(body?.majorName) || "当前专业";
  const selectedEvents = Array.isArray(body?.selectedEvents) ? body.selectedEvents.slice(0, 8) : [];
  const scores = SCORE_KEYS.reduce((result, key) => {
    const score = Number(body?.scores?.[key]);
    result[key] = Number.isFinite(score) ? score : 0;
    return result;
  }, {});
  const profile = body?.profile && typeof body.profile === "object"
    ? {
        title: normalizeText(body.profile.title),
        dominantKey: normalizeText(body.profile.dominantKey)
      }
    : null;
  const payload = {
    goalId,
    goalLabel: getCounterfactualGoal(goalId).label,
    majorId,
    majorName,
    scores,
    profile,
    selectedEvents,
    alternatives: selectCounterfactualAlternatives({
      majorId,
      selectedEvents,
      goalId,
      limit: 1
    })
  };
  const localFallback = buildLocalCounterfactualAnalysis(payload);

  if (!process.env.DEEPSEEK_API_KEY) {
    return {
      source: "local-fallback",
      answer: localFallback,
      alternatives: payload.alternatives,
      notice: "未配置 DEEPSEEK_API_KEY，当前使用本地反事实分析模板。"
    };
  }

  try {
    const answer = await callDeepSeek([
      {
        role: "system",
        content: [
          "你是面向高中生的专业体验反事实分析助手。",
          "你的任务不是重新推荐专业，而是解释：如果用户在同一专业体验里换一种选择，五维体验可能会怎样变化。",
          "请保持温和、具体、可执行，不做心理诊断或升学结论。",
          "回答不超过 45 个汉字，只用一句话：说替换哪类选择，以及主要改变哪个体验维度。",
          "必须基于提供的 scores、selectedEvents 和 alternatives，不要编造不存在的课程或地点。"
        ].join("\n")
      },
      {
        role: "user",
        content: JSON.stringify(payload, null, 2)
      }
    ]);

    return {
      source: "deepseek",
      model: DEEPSEEK_MODEL,
      answer,
      alternatives: payload.alternatives
    };
  } catch (error) {
    console.error("DeepSeek counterfactual analysis failed:", error);
    return {
      source: "local-fallback",
      answer: localFallback,
      alternatives: payload.alternatives,
      notice: "DeepSeek 暂时没有返回结果，已切换到本地反事实分析。"
    };
  }
}

async function callDeepSeek(messages) {
  const requestBody = {
    model: DEEPSEEK_MODEL,
    messages,
    temperature: 0.45,
    stream: false
  };

  if (DEEPSEEK_THINKING === "enabled" || DEEPSEEK_THINKING === "disabled") {
    requestBody.thinking = { type: DEEPSEEK_THINKING };
  }

  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`DeepSeek API ${response.status}: ${errorBody.slice(0, 500)}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || "AI 暂时没有生成内容。";
}

function buildLocalCourseAnswer(question, relatedCourses, majorCourses, dayContext = {}) {
  const courses = relatedCourses.length > 0 ? relatedCourses : majorCourses.slice(0, 3);
  if (courses.length === 0) {
    return "本地课程库里暂时没有找到这个专业的课程信息。可以先换一个专业或问一个更宽泛的问题。";
  }

  const courseLines = courses.slice(0, 3).map((course, index) => {
    const intro = course.highSchoolFriendlyIntro || course.learningContent?.[0] || "这门课能帮助你靠近专业里的真实问题。";
    return `${index + 1}. ${course.courseName}：${intro}`;
  });

  return [
    "【简短回答】",
    `你问的是“${question}”。从现有课程库看，可以先从几门代表性课程理解这个方向：它们会告诉你这个专业每天到底在训练什么能力。`,
    "",
    "【相关课程】",
    courseLines.join("\n"),
    "",
    "【体验提示】",
    "如果你是高中生，可以先抓住“这门课解决什么问题”和“它会不会让我愿意继续追问”两个角度，不急着一下子看懂所有术语。"
  ].join("\n");
}

function buildLocalDayEvaluation(payload) {
  const courseNames = payload.featuredCourses.map((course) => course.courseName).filter(Boolean);
  const profileTitle = payload.localProfile?.title || "今天的体验者";

  return [
    `今天的你更像一位“${profileTitle}”：你已经初步感受了${payload.majorName}的学习节奏、任务密度和校园场景。`,
    courseNames.length > 0
      ? `从课程线索看，${courseNames.slice(0, 3).join("、")}会是后续理解这个专业的入口。`
      : "从课程线索看，你可以继续关注这个专业的基础课和实践课分别在训练什么能力。",
    "愿你把这次体验当作一次靠近真实大学生活的小预演：喜欢的地方值得继续探索，觉得有压力的地方也值得认真观察。"
  ].join("\n\n");
}

const COUNTERFACTUAL_GOALS = {
  reducePressure: {
    label: "降低压力",
    intro: "如果把这一天切到更舒缓的平行路线，最值得调整的是高压力时段。",
    advice: "下一次可以优先选择休息、运动或轻量复盘类活动，先观察自己是否更能长期适应。"
  },
  increasePractice: {
    label: "加强实践",
    intro: "如果你想让体验更接近真实专业训练，可以把一部分课堂或自习时间换成项目、实验或调研任务。",
    advice: "下一次可以专门选择带有实验、项目、实习或调研属性的选项，看自己是否享受动手解决问题。"
  },
  balanceDay: {
    label: "更均衡的一天",
    intro: "如果希望这一天更均衡，关键不是把所有维度拉满，而是减少单一维度过度占用。",
    advice: "下一次可以让学习、社交、实践和休息各出现一次，比较哪种节奏更接近你真实能坚持的状态。"
  },
  increaseSocial: {
    label: "增加协作",
    intro: "如果把路线调向协作型体验，你会更早遇到讨论、表达和团队推进这些真实大学场景。",
    advice: "下一次可以选择小组讨论、社团活动或分享交流类选项，观察自己是否喜欢在协作中理解专业。"
  }
};

function getCounterfactualGoal(goalId) {
  return COUNTERFACTUAL_GOALS[goalId] || COUNTERFACTUAL_GOALS.reducePressure;
}

function buildLocalCounterfactualAnalysis(payload) {
  const goal = getCounterfactualGoal(payload.goalId);
  const topAlternative = payload.alternatives[0];

  const alternativeLine = topAlternative
    ? `试试把「${topAlternative.period}」换成「${topAlternative.label}」，主要观察压力 ${formatScoreDelta(topAlternative.score.pressure)}。`
    : "可替代选项较少，先观察五维评分变化。";

  return alternativeLine;
}

function selectCounterfactualAlternatives({ majorId, selectedEvents, goalId, limit = 3 }) {
  const selectedIds = new Set(selectedEvents.map((event) => normalizeText(event?.id)).filter(Boolean));
  const steps = Array.isArray(experienceTemplates[majorId]) ? experienceTemplates[majorId] : [];

  return steps
    .flatMap((step) => (step.options || []).map((option) => ({
      id: option.id,
      period: step.period,
      label: option.label,
      event: option.event,
      locationId: option.locationId,
      score: normalizeScoreObject(option.score),
      rank: rankCounterfactualOption(option, goalId)
    })))
    .filter((option) => option.id && !selectedIds.has(option.id))
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit)
    .map(({ rank, ...option }) => option);
}

function rankCounterfactualOption(option, goalId) {
  const score = normalizeScoreObject(option.score);

  if (goalId === "increasePractice") {
    return score.practice * 4 + score.study + score.social - Math.max(score.pressure, 0);
  }

  if (goalId === "balanceDay") {
    return score.health * 2 + score.social + score.practice + score.study - Math.abs(score.pressure) - Math.max(score.pressure, 0);
  }

  if (goalId === "increaseSocial") {
    return score.social * 4 + score.practice + score.health - Math.max(score.pressure, 0);
  }

  return score.health * 3 - score.pressure * 4 + score.social + Math.min(score.study, 1);
}

function normalizeScoreObject(score = {}) {
  return SCORE_KEYS.reduce((result, key) => {
    const value = Number(score[key]);
    result[key] = Number.isFinite(value) ? value : 0;
    return result;
  }, {});
}

function formatScoreDelta(value) {
  const number = Number(value) || 0;
  if (number > 0) return `+${number}`;
  return String(number);
}

function selectRelatedCourses(courses, question, limit) {
  const tokens = tokenize(question);
  const ranked = courses
    .map((course) => ({
      course,
      score: scoreCourse(course, tokens, question)
    }))
    .sort((a, b) => b.score - a.score);

  const matched = ranked.filter((item) => item.score > 0).map((item) => item.course);
  return (matched.length > 0 ? matched : courses).slice(0, limit);
}

function scoreCourse(course, tokens, question) {
  const haystack = [
    course.courseName,
    course.courseGroup,
    course.courseCategory,
    course.highSchoolFriendlyIntro,
    ...(course.learningContent || []),
    ...(course.applicationAreas || []),
    ...(course.aiConsultationHints || [])
  ]
    .filter(Boolean)
    .join(" ");

  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) score += token.length >= 2 ? 2 : 1;
  }
  if (question && course.courseName?.includes(question)) score += 8;
  return score;
}

function tokenize(text) {
  return normalizeText(text)
    .split(/[\s,，。？！?！、;；:：()（）[\]【】"']+/)
    .flatMap((part) => {
      if (!part) return [];
      if (part.length <= 2) return [part];
      return [part, ...part.match(/[\u4e00-\u9fa5]{2,}/g) || []];
    })
    .filter(Boolean);
}

function toCourseContext(course) {
  return {
    courseName: course.courseName,
    courseCategory: course.courseCategory,
    courseGroup: course.courseGroup,
    learningContent: course.learningContent,
    learningDifficulty: course.learningDifficulty,
    applicationAreas: course.applicationAreas,
    highSchoolFriendlyIntro: course.highSchoolFriendlyIntro,
    aiConsultationHints: course.aiConsultationHints
  };
}

function normalizeDayContext(value = {}) {
  const profile = value?.profile && typeof value.profile === "object"
    ? {
        id: normalizeText(value.profile.id),
        title: normalizeText(value.profile.title),
        dominantKey: normalizeText(value.profile.dominantKey),
        description: normalizeText(value.profile.description).slice(0, 240),
        advice: normalizeText(value.profile.advice).slice(0, 240)
      }
    : null;

  const scores = SCORE_KEYS.reduce((result, key) => {
    const score = Number(value?.scores?.[key]);
    result[key] = Number.isFinite(score) ? score : 0;
    return result;
  }, {});

  const selectedEvents = Array.isArray(value?.selectedEvents)
    ? value.selectedEvents.slice(0, 8).map((option) => ({
        id: normalizeText(option?.id),
        label: normalizeText(option?.label).slice(0, 160),
        event: normalizeText(option?.event).slice(0, 120),
        locationId: normalizeText(option?.locationId),
        score: SCORE_KEYS.reduce((result, key) => {
          const score = Number(option?.score?.[key]);
          result[key] = Number.isFinite(score) ? score : 0;
          return result;
        }, {})
      }))
    : [];

  return {
    profile,
    scores,
    selectedEvents
  };
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function readRequestBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function loadLocalEnv(envPath) {
  try {
    const raw = await readFile(envPath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const equalsIndex = trimmed.indexOf("=");
      if (equalsIndex === -1) continue;
      const key = trimmed.slice(0, equalsIndex).trim();
      const value = trimmed.slice(equalsIndex + 1).trim().replace(/^["']|["']$/g, "");
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Content-Type": "application/json; charset=utf-8"
  });

  if (statusCode === 204) {
    response.end();
    return;
  }

  response.end(JSON.stringify(payload));
}
