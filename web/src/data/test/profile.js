export function getProfile(scores) {
  const total = scores.health + scores.study + scores.social + scores.practice - scores.pressure
  
  if (total >= 10) {
    return {
      icon: '🌟',
      name: '全能学霸',
      description: '德智体美劳全面发展，是同学们羡慕的对象！'
    }
  } else if (total >= 5) {
    return {
      icon: '🎯',
      name: '专注达人',
      description: '目标明确，知道如何平衡学业与生活。'
    }
  } else if (total >= 0) {
    return {
      icon: '🌱',
      name: '校园探索者',
      description: '在探索中成长，每天都有新收获！'
    }
  } else if (total >= -5) {
    return {
      icon: '💤',
      name: '佛系青年',
      description: '随遇而安，享受大学的每一天。'
    }
  } else {
    return {
      icon: '🔥',
      name: '高压战士',
      description: '压力就是动力，在挑战中突破自我！'
    }
  }
}