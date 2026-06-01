export function updateScores(currentScores, scoreChange) {
  return {
    health: currentScores.health + (scoreChange.health || 0),
    study: currentScores.study + (scoreChange.study || 0),
    social: currentScores.social + (scoreChange.social || 0),
    practice: currentScores.practice + (scoreChange.practice || 0),
    pressure: currentScores.pressure + (scoreChange.pressure || 0)
  }
}