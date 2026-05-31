import { SCORE_KEYS, calculateScores, createInitialScores, getScoreEntries } from "./score.js";
import { generateProfile } from "./profile.js";

export const DAY_EVALUATION_AI_ENDPOINT = "/api/day-evaluation";

const DIMENSION_LABELS = {
  health: "健康节奏",
  study: "学习投入",
  social: "社交协作",
  practice: "实践探索",
  pressure: "压力指数"
};

const MAJOR_EVALUATION_CONFIG = {
  computer: {
    majorName: "计算机类",
    courseMajorName: "计算机类",
    title: "你的计算机类专业体验卡",
    summaryByDominantKey: {
      health: "你在计算机类体验里没有只顾着刷题和写代码，也愿意照顾自己的节奏。对高中生来说，这是一个很好的信号：你在探索专业时，也在观察自己能不能长期适应这种生活。",
      study: "你对计算机课程本身很有投入感，愿意把时间花在算法、系统和基础知识上。如果你平时喜欢拆解问题、追问原理，这类专业可能会让你越学越有感觉。",
      social: "你没有把计算机想象成一个人闷头敲代码，而是进入了讨论、分享和团队协作的场景。真实的计算机专业也经常需要和同伴一起做项目、讲方案、改需求。",
      practice: "你很自然地走向了实验、项目和调试这些动手环节。计算机类专业的有趣之处，往往就在于把一个想法慢慢做成能运行的东西。",
      pressure: "你体验到了一点计算机专业的真实强度：课程、实验、报错和截止时间会同时出现。它不一定可怕，但确实需要耐心和拆问题的能力。"
    },
    dimensionText: {
      health: "计算机专业常常要长时间面对屏幕，这一项表示你是否会主动给身体和注意力留出休息空间。",
      study: "这一项对应算法、数学基础、系统原理等课程。它们一开始可能抽象，但会慢慢变成解决问题的工具。",
      social: "这一项对应小组开发、技术分享和社团交流。计算机并不只是独自写代码，也有很多需要沟通的时刻。",
      practice: "这一项对应上机实验、课程项目和 debug。你会在不断尝试中看到代码从报错到运行的过程。",
      pressure: "这一项对应难题、报错和任务截止时间。它提醒你提前了解专业强度，也学会把大问题拆小。"
    },
    courseKeywordsByDimension: {
      health: ["人工智能导论", "程序设计基础"],
      study: ["数据结构", "离散数学", "高等数学", "概率论"],
      social: ["人工智能", "网络安全", "数据挖掘"],
      practice: ["程序设计", "计算机网络", "操作系统", "计算机组成"],
      pressure: ["编译原理", "操作系统", "数据结构"]
    },
    closingMessages: {
      health: "如果你喜欢计算机，也请记得喜欢那个需要休息的自己。",
      study: "愿你保留这份对原理的好奇心，它会带你慢慢看懂技术背后的世界。",
      social: "把想法讲出来也是一种能力，未来的项目可能就从一次讨论开始。",
      practice: "如果你享受把东西做出来的瞬间，计算机世界会给你很多这样的机会。",
      pressure: "遇到报错不用慌。专业探索本来就是一边试错，一边发现自己能走多远。"
    }
  },
  medicine: {
    majorName: "医学类",
    courseMajorName: "医学类",
    title: "你的医学类专业体验卡",
    summaryByDominantKey: {
      health: "你在医学类体验里很注意自己的节奏。医学学习确实需要投入，但也很需要长期稳定的状态，这一点对高中生了解医学专业很重要。",
      study: "你对医学知识的学习投入比较高。医学类专业会遇到大量基础知识和记忆任务，如果你愿意耐心积累，这条路会慢慢展开。",
      social: "你在沟通、讨论和科普场景中表现得比较主动。医学不只是背书和考试，也需要理解人、回应人、把复杂信息讲清楚。",
      practice: "你对见习、实验和技能训练更感兴趣。医学的真实感，往往来自把课本知识放到观察、操作和判断里。",
      pressure: "你体验到了医学类专业比较真实的一面：知识量大、责任感强、节奏也不轻松。它需要热情，也需要确认自己是否愿意长期投入。"
    },
    dimensionText: {
      health: "医学学习会让人更理解健康的重要性，这一项表示你是否能照顾作息、饮食和恢复。",
      study: "这一项对应基础医学、临床知识和大量复盘。医学知识需要慢慢积累，很少一口气学完。",
      social: "这一项对应问诊沟通、病例讨论和健康科普。医学里的表达能力，和知识本身一样重要。",
      practice: "这一项对应实验、见习和技能训练。它帮助你从课本走向真实场景，感受专业的责任感。",
      pressure: "这一项对应记忆量、操作标准和临床情境带来的压力。提前感受它，有助于更认真地判断是否喜欢医学。"
    },
    courseKeywordsByDimension: {
      health: ["预防", "生理", "基础"],
      study: ["解剖", "生理", "病理", "药理"],
      social: ["伦理", "护理", "临床"],
      practice: ["临床", "实验", "诊断", "技能"],
      pressure: ["病理", "诊断", "临床"]
    },
    closingMessages: {
      health: "如果你向往医学，也请先学会认真照顾自己。",
      study: "今天觉得陌生的知识，未来也许会变成你理解生命的一小束光。",
      social: "愿你既有清楚的判断，也有温柔的表达。",
      practice: "慢慢来，医学里的每一次练习，都是在靠近更真实的世界。",
      pressure: "觉得有压力很正常。重要的是看见真实之后，你是否仍然愿意靠近它。"
    }
  },
  business: {
    majorName: "经管类",
    courseMajorName: "经管类",
    title: "你的经管类专业体验卡",
    summaryByDominantKey: {
      health: "你在经管类体验里没有被任务完全带着走，说明你会观察自己的节奏。大学里的小组作业和展示不少，能稳住状态会很有帮助。",
      study: "你愿意投入经济、金融、统计和管理这些基础内容。经管类并不只是“会聊天”，也需要用知识和数据来支持判断。",
      social: "你很容易进入讨论、展示和团队协作的状态。经管类专业里，很多课堂任务都会要求你把想法说出来、和别人一起推进。",
      practice: "你对调研、实习、商业计划书这类真实任务更感兴趣。经管类的魅力之一，就是把课堂概念放进真实问题里试一试。",
      pressure: "你体验到了一点经管类的多任务节奏：案例、数据、展示、小组沟通可能同时出现。它考验的不只是聪明，也包括时间安排和合作方式。"
    },
    dimensionText: {
      health: "经管学习常有讨论和展示，这一项表示你是否能在忙碌任务里保持生活节奏。",
      study: "这一项对应经济学、金融学、统计学等基础课程。它们会帮助你看懂市场、企业和选择背后的逻辑。",
      social: "这一项对应案例讨论、团队展示和社团交流。经管类很重视表达、协作和说服别人。",
      practice: "这一项对应行业报告、市场调研、实习和商业计划书。你会把理论放进更真实的问题里。",
      pressure: "这一项对应汇报、数据任务和小组协作带来的压力。它提醒你提前感受大学里的任务节奏。"
    },
    courseKeywordsByDimension: {
      health: ["管理学", "组织行为"],
      study: ["微观经济学", "宏观经济学", "统计学", "会计"],
      social: ["市场营销", "组织行为", "管理学"],
      practice: ["计量经济学", "大数据", "商业智能", "创新管理", "数字营销"],
      pressure: ["战略管理", "计量经济学", "会计"]
    },
    closingMessages: {
      health: "能管理时间和能量，也是一种很重要的经管能力。",
      study: "如果你愿意用知识解释现实，经管类会给你很多观察世界的工具。",
      social: "今天敢表达的你，已经在靠近经管课堂里很重要的一部分。",
      practice: "把想法放进真实问题里试一试，你会更清楚自己喜不喜欢这个方向。",
      pressure: "任务多的时候，先找关键问题。专业探索也是这样，一步一步看清楚。"
    }
  }
};

export function generateDayEvaluation({
  majorId,
  scores,
  selectedOptions = [],
  coreCourses = [],
  maxFeaturedCourses = 3
} = {}) {
  const finalScores = scores || calculateScores(selectedOptions);
  const profile = generateProfile(finalScores);
  const config = getMajorEvaluationConfig(majorId);
  const sortedEntries = getScoreEntries(finalScores).sort((a, b) => b.value - a.value);
  const dominantKey = profile.dominantKey || sortedEntries[0]?.key || "study";
  const featuredCourses = selectFeaturedCourses({
    coreCourses,
    config,
    scoreEntries: sortedEntries,
    maxFeaturedCourses
  });

  return {
    majorId,
    majorName: config.majorName,
    title: config.title,
    summary: config.summaryByDominantKey[dominantKey],
    profile,
    dimensionEvaluations: buildDimensionEvaluations(finalScores, config),
    featuredCourses,
    eventSummary: summarizeSelectedEvents(selectedOptions),
    closingMessage: config.closingMessages[dominantKey],
    aiEvaluationRequest: buildDayEvaluationAIPayload({
      majorId,
      majorName: config.majorName,
      scores: finalScores,
      selectedOptions,
      profile,
      featuredCourses
    })
  };
}

export function buildDayEvaluationAIPayload({
  majorId,
  majorName,
  scores = createInitialScores(),
  selectedOptions = [],
  profile,
  featuredCourses = []
} = {}) {
  return {
    endpoint: DAY_EVALUATION_AI_ENDPOINT,
    method: "POST",
    body: {
      majorId,
      majorName,
      scores,
      selectedEvents: selectedOptions.map((option) => ({
        id: option.id,
        label: option.label,
        event: option.event,
        locationId: option.locationId,
        score: option.score
      })),
      localProfile: profile
        ? {
            id: profile.id,
            title: profile.title,
            dominantKey: profile.dominantKey
          }
        : null,
      featuredCourses: featuredCourses.map((course) => ({
        courseName: course.courseName,
        courseGroup: course.courseGroup,
        briefIntro: course.briefIntro
      }))
    }
  };
}

export async function requestAIDayEvaluation(payload, fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== "function") {
    throw new Error("No fetch implementation is available for AI day evaluation.");
  }

  const response = await fetchImpl(DAY_EVALUATION_AI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`AI day evaluation request failed with status ${response.status}.`);
  }

  return response.json();
}

function getMajorEvaluationConfig(majorId) {
  return MAJOR_EVALUATION_CONFIG[majorId] || MAJOR_EVALUATION_CONFIG.computer;
}

function buildDimensionEvaluations(scores, config) {
  return SCORE_KEYS.map((key) => ({
    key,
    label: DIMENSION_LABELS[key],
    value: Number.isFinite(Number(scores[key])) ? Number(scores[key]) : 0,
    level: getScoreLevel(scores[key], key),
    text: config.dimensionText[key]
  }));
}

function getScoreLevel(value = 0, key) {
  const score = Number.isFinite(Number(value)) ? Number(value) : 0;

  if (key === "pressure") {
    if (score >= 7) return "偏高";
    if (score >= 4) return "适中";
    return "轻盈";
  }

  if (score >= 7) return "突出";
  if (score >= 4) return "稳定";
  if (score >= 1) return "有一点";
  return "较低";
}

function selectFeaturedCourses({ coreCourses, config, scoreEntries, maxFeaturedCourses }) {
  const majorCourses = coreCourses.filter((course) => course.major === config.courseMajorName);
  const selected = [];

  for (const entry of scoreEntries) {
    const keywords = config.courseKeywordsByDimension[entry.key] || [];
    for (const keyword of keywords) {
      const matched = majorCourses.find((course) => {
        if (selected.some((item) => item.courseName === course.courseName)) return false;
        return [course.courseName, course.courseGroup, course.usageHint]
          .filter(Boolean)
          .some((text) => text.includes(keyword));
      });

      if (matched) selected.push(matched);
      if (selected.length >= maxFeaturedCourses) return selected;
    }
  }

  for (const course of majorCourses) {
    if (!selected.some((item) => item.courseName === course.courseName)) {
      selected.push(course);
    }
    if (selected.length >= maxFeaturedCourses) break;
  }

  return selected;
}

function summarizeSelectedEvents(selectedOptions) {
  const counts = selectedOptions.reduce((result, option) => {
    const event = option.event || "其他";
    result[event] = (result[event] || 0) + 1;
    return result;
  }, {});

  return Object.entries(counts).map(([event, count]) => ({ event, count }));
}
