import { SCORE_KEYS, createInitialScores, getScoreEntries } from "./score.js";

const PROFILE_META = {
  study: {
    id: "focusedLearner",
    title: "高专注学习型",
    description: "你在体验里很愿意认真听课、预习和复盘，说明你对专业知识本身有好奇心。",
    advice: "如果以后选择这类专业，可以继续保持这份专注，也记得给自己留一点放松时间。"
  },
  practice: {
    id: "practiceExplorer",
    title: "实践探索型",
    description: "你更喜欢通过实验、项目和真实场景理解专业，动手尝试会让你更快进入状态。",
    advice: "如果你享受把想法做出来的过程，这类专业里的实践环节可能会很吸引你。"
  },
  social: {
    id: "socialConnector",
    title: "社交活跃型",
    description: "你在讨论、社团和团队任务中更容易获得参与感，大学专业生活对你来说不只是上课。",
    advice: "未来选专业时，可以多关注课堂之外的项目、社团和交流机会。"
  },
  health: {
    id: "balancedLife",
    title: "均衡生活型",
    description: "你比较在意学习和生活的平衡，不会只盯着任务，也会照顾自己的状态。",
    advice: "这种节奏很适合探索大学生活。选专业不是只看强度，也要看自己能不能长期喜欢。"
  },
  pressure: {
    id: "pressureMax",
    title: "压力拉满型",
    description: "你体验到的节奏比较紧，这说明这个专业可能有不少需要坚持和适应的部分。",
    advice: "感到压力并不代表不适合，它只是提醒你：了解专业时，也要了解它真实的一面。"
  }
};

export function generateProfile(scores = createInitialScores()) {
  const normalizedScores = SCORE_KEYS.reduce((result, key) => {
    const value = Number(scores[key]);
    result[key] = Number.isFinite(value) ? value : 0;
    return result;
  }, {});

  const entries = getScoreEntries(normalizedScores).sort((a, b) => b.value - a.value);
  const [first, second] = entries;

  if (
    normalizedScores.pressure >= 7 &&
    normalizedScores.pressure >= normalizedScores.health + 3
  ) {
    return buildProfile("pressure", normalizedScores, entries);
  }

  if (
    first.value - second.value <= 1 &&
    normalizedScores.health >= 2 &&
    normalizedScores.pressure <= 5
  ) {
    return {
      ...PROFILE_META.health,
      dominantKey: "health",
      scores: normalizedScores,
      topDimensions: entries.slice(0, 2)
    };
  }

  return buildProfile(first.key, normalizedScores, entries);
}

function buildProfile(key, scores, entries) {
  const fallbackKey = PROFILE_META[key] ? key : "study";

  return {
    ...PROFILE_META[fallbackKey],
    dominantKey: fallbackKey,
    scores,
    topDimensions: entries.slice(0, 2)
  };
}
