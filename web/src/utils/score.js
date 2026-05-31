export const SCORE_KEYS = ["health", "study", "social", "practice", "pressure"];

export function createInitialScores() {
  return SCORE_KEYS.reduce((scores, key) => {
    scores[key] = 0;
    return scores;
  }, {});
}

export function normalizeScoreDelta(score = {}) {
  return SCORE_KEYS.reduce((delta, key) => {
    const value = Number(score[key]);
    delta[key] = Number.isFinite(value) ? value : 0;
    return delta;
  }, {});
}

export function applyOptionScore(currentScores = createInitialScores(), option = {}) {
  const delta = normalizeScoreDelta(option.score);

  return SCORE_KEYS.reduce((nextScores, key) => {
    const current = Number(currentScores[key]);
    nextScores[key] = (Number.isFinite(current) ? current : 0) + delta[key];
    return nextScores;
  }, {});
}

export function calculateScores(selectedOptions = []) {
  return selectedOptions.reduce(
    (scores, option) => applyOptionScore(scores, option),
    createInitialScores()
  );
}

export function getScoreEntries(scores = createInitialScores()) {
  return SCORE_KEYS.map((key) => ({
    key,
    value: Number.isFinite(Number(scores[key])) ? Number(scores[key]) : 0
  }));
}

export function getTopScoreKeys(scores = createInitialScores()) {
  const entries = getScoreEntries(scores);
  const maxValue = Math.max(...entries.map((entry) => entry.value));

  return entries
    .filter((entry) => entry.value === maxValue)
    .map((entry) => entry.key);
}
