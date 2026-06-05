export const RESULT_ART_TYPES = [
  {
    key: 'study',
    label: '学习专注型',
    description: '偏课堂、预习、复盘和知识吸收的专业形象'
  },
  {
    key: 'practice',
    label: '实践探索型',
    description: '偏实验、项目、动手和真实任务的专业形象'
  },
  {
    key: 'social',
    label: '社交协作型',
    description: '偏讨论、社团、团队协作和表达交流的专业形象'
  },
  {
    key: 'health',
    label: '均衡生活型',
    description: '偏运动、休息、饮食和节奏平衡的专业形象'
  },
  {
    key: 'pressure',
    label: '高压挑战型',
    description: '偏 deadline、强度、坚持和适应挑战的专业形象'
  }
]

const RESULT_ART_BY_TYPE = {
  study: {
    computer: createArtAsset('computer', 'study', '计算机类学习专注型美术形象'),
    medicine: createArtAsset('medicine', 'study', '医学类学习专注型美术形象'),
    business: createArtAsset('business', 'study', '经管类学习专注型美术形象')
  },
  practice: {
    computer: createArtAsset('computer', 'practice', '计算机类实践探索型美术形象'),
    medicine: createArtAsset('medicine', 'practice', '医学类实践探索型美术形象'),
    business: createArtAsset('business', 'practice', '经管类实践探索型美术形象')
  },
  social: {
    computer: createArtAsset('computer', 'social', '计算机类社交协作型美术形象'),
    medicine: createArtAsset('medicine', 'social', '医学类社交协作型美术形象'),
    business: createArtAsset('business', 'social', '经管类社交协作型美术形象')
  },
  health: {
    computer: createArtAsset('computer', 'health', '计算机类均衡生活型美术形象'),
    medicine: createArtAsset('medicine', 'health', '医学类均衡生活型美术形象'),
    business: createArtAsset('business', 'health', '经管类均衡生活型美术形象')
  },
  pressure: {
    computer: createArtAsset('computer', 'pressure', '计算机类高压挑战型美术形象'),
    medicine: createArtAsset('medicine', 'pressure', '医学类高压挑战型美术形象'),
    business: createArtAsset('business', 'pressure', '经管类高压挑战型美术形象')
  }
}

export function getResultArtAsset(majorId, typeKey) {
  const resolvedType = RESULT_ART_BY_TYPE[typeKey] ? typeKey : 'study'
  const asset = RESULT_ART_BY_TYPE[resolvedType]?.[majorId]

  return asset || createArtAsset(majorId || 'unknown', resolvedType, '专业画像美术形象')
}

function createArtAsset(majorId, typeKey, alt) {
  return {
    majorId,
    typeKey,
    alt,
    src: `/art/result/${majorId}/${typeKey}.png`
  }
}
