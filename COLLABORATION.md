# 协作接口说明

> ⚠️ **重要**: 角色 A（前端主流程）创建了测试数据用于演示网站功能和流程，这些数据**仅用于开发阶段**，不适用于最终项目部署。

---

## 角色 A 职责范围

### 负责的部分

**核心状态与页面**：
- `page` - 页面状态
- `selectedMajor` - 选中的专业
- `currentStep` - 当前阶段
- `selectedOptions` - 选择记录
- `scores` - 分数对象

**组件**：
- `Home.jsx` - 首页
- `Experience.jsx` - 模拟页面
- `Result.jsx` - 结果页面
- `MajorCard.jsx` - 专业卡片
- `OptionCard.jsx` - 选项卡片
- `ScorePanel.jsx` - 分数面板

**样式**：
- `styles.css` - 统一的样式文件

### 不负责的部分

- ❌ 设计评分逻辑
- ❌ 设计课程问答后端
- ❌ 实现地图路线逻辑
- ❌ 提供正式的专业数据、日程模板等

---

## 角色 B 需要提供

### 1. majors 数据格式

```javascript
// src/data/majors.json
[
  {
    id: 'computer',
    name: '计算机类',
    icon: '💻',
    color: '#6366f1',
    description: '探索代码的世界'
  }
]
```

### 2. experienceTemplates 数据格式

```javascript
// src/data/experienceTemplates.json
{
  computer: [
    {
      id: 'morning',
      period: '出发阶段',
      question: '新的一天开始了，你准备怎么进入状态？',
      options: [
        {
          label: '提前到教学楼预习课程',
          event: '课前预习',
          locationId: 'teaching_building',
          score: { health: -1, study: 2, social: 0, practice: 0, pressure: 1 }
        }
      ]
    }
  ]
}
```

### 3. updateScores 函数接口

```javascript
// src/utils/score.js
export function updateScores(currentScores, scoreChange) {
  // 更新分数逻辑
  return {
    health: currentScores.health + scoreChange.health,
    study: currentScores.study + scoreChange.study,
    social: currentScores.social + scoreChange.social,
    practice: currentScores.practice + scoreChange.practice,
    pressure: currentScores.pressure + scoreChange.pressure
  }
}
```

### 4. getProfile 函数接口

```javascript
// src/utils/profile.js
export function getProfile(scores) {
  // 根据分数生成画像
  return {
    icon: '🎓',
    name: '校园探索者',
    description: '即将开启你的大学之旅'
  }
}
```

---

## 角色 C 需要提供

### 1. locations 数据格式

```javascript
// src/data/locations.json
[
  {
    id: 'teaching_building',
    name: '教学楼',
    icon: '🏫',
    x: 100,
    y: 100
  }
]
```

### 2. CampusMap 组件接口

```jsx
// src/components/CampusMap.jsx
function CampusMap({ locations, route }) {
  // locations: 所有地点数据
  // route: 访问过的地点数组（包含 id, name, icon, x, y）
  return <div>校园地图</div>
}

export default CampusMap
```

### 3. CourseChat 组件接口

```jsx
// src/components/CourseChat.jsx
function CourseChat({ selectedMajor }) {
  // selectedMajor: 选中的专业对象
  return <div>课程问答</div>
}

export default CourseChat
```

---

## 测试数据说明

角色 A 创建的测试数据位于 `src/data/test/` 目录：

| 文件 | 用途 | 备注 |
|------|------|------|
| `majors.json` | 专业数据 | 仅用于演示 |
| `experienceTemplates.json` | 日程模板 | 仅用于演示 |
| `locations.json` | 地点数据 | 仅用于演示 |
| `score.js` | 评分函数 | 仅用于演示 |
| `profile.js` | 画像函数 | 仅用于演示 |

**请勿将测试数据用于最终项目**，等待角色 B 和角色 C 提供正式数据。

---

## 替换测试数据的步骤

当角色 B 和角色 C 提供正式数据后：

1. **角色 B 提供数据**：
   - 创建 `src/data/majors.json`
   - 创建 `src/data/experienceTemplates.json`
   - 创建 `src/utils/score.js`
   - 创建 `src/utils/profile.js`

2. **角色 C 提供数据**：
   - 创建 `src/data/locations.json`
   - 实现 `src/components/CampusMap.jsx`
   - 实现 `src/components/CourseChat.jsx`

3. **更新页面组件**：
   - 修改 `Home.jsx` 导入正式 majors 数据
   - 修改 `Experience.jsx` 导入正式 experienceTemplates 数据
   - 修改 `Result.jsx` 导入正式 locations 数据和函数
   - 修改 `App.jsx` 导入正式的 updateScores 和 getProfile 函数
