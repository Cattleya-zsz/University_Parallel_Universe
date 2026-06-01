# 角色 A 开发指导

你负责本项目的主前端与交互流程开发。

项目名称：`University Parallel Universe`

项目类型：面向高中生的 Web 专业一日模拟项目。

核心流程：

```text
选择专业
→ 进入一日日程模拟
→ 在五个阶段做选择
→ 累计多维度分数
→ 查看结果画像
→ 查看校园路线
```

## 1. 你的目标

你要完成一个稳定、清晰、可演示的前端主流程。

你负责的重点不是复杂算法，而是：

- 页面结构清楚
- 交互顺畅
- 状态推进正确
- 结果页能承接地图和后续问答模块

## 2. 你的主要任务

- 搭建 `React + Vite` 前端项目
- 完成首页 / 专业选择页
- 完成一日模拟页
- 完成结果页基础布局
- 实现页面跳转和状态管理
- 负责整体 UI 风格统一
- 预留地图组件挂载位置
- 预留课程问答组件挂载位置

## 3. 你负责的文件范围

建议重点开发：

```text
web/
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  ├─ styles.css
│  ├─ pages/
│  │  ├─ Home.jsx
│  │  ├─ Experience.jsx
│  │  └─ Result.jsx
│  └─ components/
│     ├─ MajorCard.jsx
│     ├─ OptionCard.jsx
│     └─ ScorePanel.jsx
```

你可以调用但不主导修改：

- `src/data/majors.json`
- `src/data/experienceTemplates.json`
- `src/utils/score.js`
- `src/utils/profile.js`
- `src/components/CampusMap.jsx`
- `src/components/CourseChat.jsx`

## 4. 页面要求

### 4.1 Home 页面

功能：

- 展示项目名称
- 简短说明玩法
- 展示专业卡片
- 点击专业后进入模拟

输入数据：

- `majors.json`

输出状态：

- `selectedMajor`
- `page = "experience"`

### 4.2 Experience 页面

功能：

- 展示当前阶段问题
- 展示选项卡片
- 点击选项后进入下一阶段
- 记录用户选择
- 更新分数

当前项目采用五阶段：

```text
出发阶段
上午学习
午间调整
下午安排
夜间选择
```

输入数据：

- `selectedMajor`
- `experienceTemplates.json`

输出状态：

- `selectedOptions`
- `scores`
- `currentStep`

### 4.3 Result 页面

功能：

- 展示用户选择的专业
- 展示最终画像
- 展示五个维度分数
- 展示选择摘要
- 挂载地图组件
- 预留课程问答区域
- 提供重新开始按钮

## 5. 状态管理规范

核心状态统一放在 `App.jsx`。

建议至少包含：

```js
page
selectedMajor
currentStep
selectedOptions
scores
```

建议使用：

```js
useState
```

当前阶段不要引入：

- Redux
- Zustand
- React Router

除非主流程已经稳定并且确实需要。

## 6. UI 要求

风格方向：

- 面向高中生
- 有探索感
- 清晰轻快
- 不要模板化得太普通
- 整体采用等距校园插画风氛围
- 信息卡片采用轻手账式风格
- 结果页视觉重点服务于发光路线和校园地图

设计原则：

- 可读性优先
- 交互路径明确
- 卡片风格统一
- 颜色不宜过多
- 结果页要给地图留下视觉重心

不要做：

- 复杂动画堆叠
- 花哨但影响阅读的排版
- 过深的组件嵌套

## 7. 与其他成员的协作边界

你依赖成员 B：

- 提供 `experienceTemplates.json`
- 提供 `score.js`
- 提供 `profile.js`

你依赖成员 C：

- 提供 `CampusMap.jsx`
- 提供 `locations.json`

你不负责：

- 设计评分逻辑
- 设计课程问答后端
- 实现地图路线逻辑

## 8. 你交付后的验收标准

你完成后，应该满足：

- 能进入首页并选择专业
- 能进入五阶段模拟
- 每次点击选项都能进入下一步
- 模拟结束后能进入结果页
- 结果页能正确读取分数和画像
- 地图组件可以被挂载
- 课程问答区域可以被挂载

## 9. 建议给 AI coding 工具的任务拆分

不要让工具一次生成整个项目。

推荐顺序：

1. 生成 `App.jsx` 的基础状态与页面切换逻辑
2. 生成 `Home.jsx` 和 `MajorCard.jsx`
3. 生成 `Experience.jsx` 和 `OptionCard.jsx`
4. 生成 `Result.jsx` 和 `ScorePanel.jsx`
5. 统一 `styles.css`
6. 接入地图组件占位
7. 接入课程问答组件占位

## 10. 可直接给 AI coding 工具的提示词

```text
你现在是这个项目的前端开发者。
请基于 React + Vite + JavaScript 实现一个三页式 Web App。

项目流程：
1. 首页选择专业
2. 一日模拟页按五个阶段逐步做选择
3. 结果页展示画像、分数、路线组件占位和课程问答组件占位

要求：
1. 使用 useState 管理 page、selectedMajor、currentStep、selectedOptions、scores
2. 不要引入 Redux、Router、TypeScript
3. 不要在页面里硬编码评分逻辑，评分逻辑通过外部函数调用
4. 组件拆分为 Home、Experience、Result、MajorCard、OptionCard、ScorePanel
5. 结果页预留 CampusMap 和 CourseChat 的挂载区域
6. 样式统一、清晰、适合高中生交互体验
```
