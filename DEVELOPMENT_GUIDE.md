# 大学平行时空开发规范

本文档用于辅助后续开发，帮助团队在使用 AI coding 工具时保持统一的数据结构、代码风格和协作方式。

## 1. 开发目标

项目当前目标是完成一个一周内可展示的 Web MVP。

核心闭环：

```text
选择专业
→ 进入一日日程模拟
→ 用户在多个时间段做选择
→ 选择影响多维度分数
→ 选择绑定校园地点
→ 生成路线和最终画像
```

开发时优先保证流程完整，不优先追求复杂算法和华丽动效。

## 2. 技术规范

推荐技术栈：

```text
React
Vite
JavaScript
CSS
本地 JSON 数据
```

暂时不引入：

- 后端服务
- 数据库
- 登录系统
- 状态管理库
- 地图 API
- 复杂图表库

如需扩展，必须先保证 MVP 已经稳定跑通。

可选加分模块“课程问答助手”允许引入一个轻量后端。该后端只用于保护 API key 和调用 AI 服务，不承担主流程业务。

## 3. 目录规范

项目建议结构：

```text
web/
├─ src/
│  ├─ pages/          # 页面组件
│  ├─ components/     # 可复用组件
│  ├─ data/           # 本地 JSON 数据
│  ├─ utils/          # 工具函数
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ styles.css
```

如果接入课程问答 API key，增加：

```text
backend/
├─ app.py
├─ requirements.txt
├─ .env.example
├─ data/
│  └─ coreCourses.json
├─ routes/
│  └─ course_chat.py
└─ services/
   ├─ course_retriever.py
   └─ ai_client.py
```

注意：

- `.env` 不提交 Git
- `.env.example` 可以提交，只写变量名不写真实 key
- 前端不能直接调用 AI API
- 前端只能调用本项目后端接口

页面组件放在 `pages/`：

- `Home.jsx`：首页和专业选择
- `Experience.jsx`：一日模拟问卷
- `Result.jsx`：结果画像和路线展示

通用组件放在 `components/`：

- `MajorCard.jsx`
- `OptionCard.jsx`
- `CampusMap.jsx`
- `ScorePanel.jsx`

工具函数放在 `utils/`：

- `score.js`：分数计算
- `profile.js`：画像生成
- `route.js`：路线生成

## 4. 数据命名规范

统一使用英文小写加驼峰命名。

推荐：

```js
majorId
locationId
currentStep
selectedOptions
scoreDelta
```

避免：

```js
major_id
LocationID
当前步骤
```

专业、地点、时间段等固定 ID 使用英文小写。

示例：

```text
computer
medicine
business
library
dorm
teachingBuilding
```

## 5. 数据结构规范

### 5.1 专业数据 majors.json

每个专业必须包含：

```json
{
  "id": "computer",
  "name": "计算机类",
  "description": "偏重逻辑思维、项目实践和持续学习。",
  "tags": ["逻辑", "编程", "项目", "实践"]
}
```

字段说明：

- `id`：专业唯一标识，不能重复
- `name`：展示给用户看的专业名称
- `description`：专业简短介绍
- `tags`：专业关键词

### 5.2 地点数据 locations.json

每个地点必须包含：

```json
{
  "id": "library",
  "name": "图书馆",
  "x": 62,
  "y": 35
}
```

字段说明：

- `id`：地点唯一标识
- `name`：地点展示名
- `x`：地图横向位置，范围 0-100
- `y`：地图纵向位置，范围 0-100

注意：

- `x` 和 `y` 使用百分比坐标，不使用真实经纬度
- 所有事件中的 `locationId` 必须能在 `locations.json` 中找到

### 5.3 日程模板 experienceTemplates.json

每个专业对应一个数组。

每个时间段节点必须包含：

```json
{
  "id": "morning",
  "period": "早晨",
  "question": "新的一天开始了，你准备怎么进入状态？",
  "options": [
    {
      "id": "morning-study",
      "label": "提前到教学楼预习课程",
      "event": "课前预习",
      "locationId": "teachingBuilding",
      "score": {
        "health": 0,
        "study": 2,
        "social": 0,
        "practice": 0,
        "pressure": 1
      }
    }
  ]
}
```

字段说明：

- `id`：时间段节点 ID
- `period`：时间段名称
- `question`：当前问题
- `options`：用户可选择项

每个选项必须包含：

- `id`
- `label`
- `event`
- `locationId`
- `score`

## 6. 评分规范

项目统一使用 5 个评分维度：

```text
health    健康平衡
study     学习投入
social    社交丰富
practice  实践探索
pressure  压力指数
```

初始分数统一为：

```js
{
  health: 0,
  study: 0,
  social: 0,
  practice: 0,
  pressure: 0
}
```

每个选项的分数建议范围：

```text
-2 到 +3
```

大多数选项建议控制在：

```text
0 到 +2
```

不要让单个选项影响过大，避免结果失衡。

## 7. 画像生成规范

最终画像由总分决定。

建议规则：

- `study` 最高：高专注学习型
- `practice` 最高：实践探索型
- `social` 最高：社交活跃型
- `health` 最高且 `pressure` 较低：均衡生活型
- `pressure` 最高：压力拉满型

如果多个维度接近，可以使用综合画像：

```text
均衡探索型
学习实践型
社交学习型
```

画像生成逻辑统一写在：

```text
src/utils/profile.js
```

不要在页面组件中直接写复杂判断。

## 8. 路线生成规范

路线由用户选择过的地点组成。

基本规则：

```text
用户每选择一个选项
→ 读取该选项的 locationId
→ 查找 locations.json
→ 加入路线数组
```

建议默认起点和终点都加入宿舍：

```text
宿舍区 → 用户选择地点 1 → 用户选择地点 2 → ... → 宿舍区
```

路线去重规则：

- 如果连续两个地点相同，可以只保留一个
- 非连续重复地点可以保留，表示用户一天中再次回到该地点

路线生成逻辑统一写在：

```text
src/utils/route.js
```

## 9. 组件职责规范

### 9.1 MajorCard

负责展示专业卡片。

输入：

```js
major
onSelect
```

不负责：

- 修改全局状态
- 生成体验数据

### 9.2 OptionCard

负责展示一个选项。

输入：

```js
option
onChoose
```

不负责：

- 计算总分
- 跳转页面

### 9.3 CampusMap

负责展示简化校园地图。

输入：

```js
locations
route
```

职责：

- 渲染人工标注的校园底图
- 按相对坐标定位地点
- 根据 route 画出点位顺序和连接线
- 支持当前节点高亮

不负责：

- 根据选项生成 route
- 计算分数
- 接入真实地图导航

### 9.4 ScorePanel

负责展示最终分数。

输入：

```js
scores
```

不负责：

- 计算分数
- 判断画像类型

### 9.5 CourseChat

可选组件，负责课程问答展示。

输入：

```js
major
```

职责：

- 接收用户问题
- 调用后端 `/api/course-chat`
- 展示固定格式回答

不负责：

- 保存 API key
- 直接调用 AI 服务
- 自行编造课程资料

后端职责补充：

- `course_chat.py` 只负责收参与返回结果
- `course_retriever.py` 只负责按专业和关键词筛课程
- `ai_client.py` 只负责调用模型
- 课程问答模块不能依赖主流程状态才能运行

## 10. 页面状态规范

建议核心状态放在 `App.jsx` 中。

需要记录：

```js
selectedMajor
currentStep
selectedOptions
scores
```

如果项目较小，可以不用 React Router，直接用一个 `page` 状态控制当前页面：

```js
const [page, setPage] = useState("home");
```

页面值建议：

```text
home
experience
result
```

## 11. UI 规范

整体风格建议：

- 清晰
- 轻量
- 适合高中生
- 有一点探索感
- 不要过度严肃

本项目固定视觉方向：

- 等距校园插画风
- 路线发光连线
- 轻手账式信息卡片

落地要求：

- 地图区域优先使用等距或伪 3D 校园插画底图
- 路线使用高对比度发光连线或高亮描边
- 信息卡片要像“校园体验记录卡”，而不是普通后台卡片
- 页面整体保持亲和感，不做重科幻或重商务风

页面设计优先级：

```text
可读性 > 流程清晰 > 美观 > 动画
```

按钮文案要短，避免大段说明。

建议主色不超过 2-3 个，卡片样式保持统一。

## 12. AI Coding 使用规范

使用 AI coding 工具时，尽量按小任务生成。

推荐 prompt 格式：

```text
请基于以下数据结构，帮我生成 React 组件 OptionCard。
要求：
1. 接收 option 和 onChoose 两个 props
2. 点击卡片时调用 onChoose(option)
3. 不要在组件里写分数计算逻辑
4. 使用普通 CSS className
```

不要直接让 AI：

```text
帮我生成整个项目
```

更推荐：

```text
帮我生成 MajorCard 组件
帮我生成 score.js 评分函数
帮我生成 CampusMap 组件
帮我检查这个 JSON 是否字段一致
```

课程问答模块推荐 prompt：

```text
请帮我生成一个 FastAPI 路由 /api/course-chat。
要求：
1. 接收 major 和 question
2. 从 coreCourses.json 中筛选同专业课程
3. 将课程资料和用户问题交给 ai_client
4. 返回 answer 字段
5. 不要把 API key 写死在代码里
6. 如果 AI 调用失败，返回本地关键词匹配的兜底回答
```

## 13. 协作规范

每个人修改前先确认自己负责的范围。

建议分工：

- A：页面和交互
- B：数据结构和评分逻辑
- C：地图和展示材料

避免多人同时改同一个文件。

容易冲突的文件：

```text
App.jsx
styles.css
experienceTemplates.json
```

修改这些文件前，最好先在群里说明。

## 14. MVP 验收标准

项目完成最低标准：

- 可以打开 Web 页面
- 可以选择一个专业
- 可以完成所有时间段选择
- 可以根据选择累计分数
- 可以生成最终画像
- 可以展示用户经过的地点路线
- 可以重新开始体验
- 展示时流程不报错

如果以上全部完成，再考虑美化、扩展专业、增加动画或加入后端。

## 15. 课程问答加分模块规范

该模块只在核心 MVP 稳定后开发。

### 15.1 接口

```text
POST /api/course-chat
```

请求：

```json
{
  "major": "计算机类",
  "question": "计算机专业主要学什么？"
}
```

返回：

```json
{
  "answer": "【简短回答】...\\n\\n【相关课程】...\\n\\n【体验提示】..."
}
```

### 15.2 后端环境变量

`.env.example`：

```text
AI_API_KEY=
AI_BASE_URL=
AI_MODEL=
```

真实 `.env` 不提交。

### 15.3 回答格式

统一使用：

```text
【简短回答】
不超过 80 字。

【相关课程】
列出 2-4 门课程，每门一句解释。

【体验提示】
说明这些课程在一日模拟中可能对应什么活动。
```

### 15.4 兜底规则

AI 调用失败时，后端用本地课程数据返回固定模板：

```text
【简短回答】
这个问题可以从该专业核心课程中理解。

【相关课程】
列出同专业前 3 门课程及简介。

【体验提示】
这些课程可以用于生成“上课”“自习”“实验/实践”等事件选项。
```

## 16. 当前优先级

第一优先级：

```text
跑通完整流程
```

第二优先级：

```text
数据内容合理
```

第三优先级：

```text
页面美观
```

第四优先级：

```text
扩展功能
```

不要为了扩展功能影响核心 Demo 的稳定性。
