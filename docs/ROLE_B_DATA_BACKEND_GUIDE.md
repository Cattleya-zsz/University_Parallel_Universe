# 角色 B 开发指导

你负责本项目的数据结构、评分逻辑，以及可选的 AI 问答后端预留。

项目名称：`University Parallel Universe`

项目目标不是做复杂算法，而是让前端稳定拿到：

- 专业数据
- 五阶段事件模板
- 分数累计逻辑
- 最终画像生成逻辑
- 可选课程问答能力

## 1. 你的目标

你要把项目的“脑子”部分搭好。

你负责的核心是：

- 数据结构一致
- 事件模板可用
- 评分逻辑明确
- 画像生成稳定
- 课程数据可用于后续 AI 问答

## 2. 你的主要任务

- 设计 `majors.json`
- 设计 `experienceTemplates.json`
- 编写 `score.js`
- 编写 `profile.js`
- 整理并维护 `coreCourses.json`
- 可选：搭建轻量 `backend/`
- 可选：实现 `POST /api/course-chat`

## 3. 你负责的文件范围

优先开发：

```text
web/
├─ src/
│  ├─ data/
│  │  ├─ majors.json
│  │  ├─ experienceTemplates.json
│  │  ├─ locations.json
│  │  └─ coreCourses.json
│  └─ utils/
│     ├─ score.js
│     ├─ profile.js
│     └─ route.js
```

可选加分：

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

## 4. 数据结构要求

### 4.1 majors.json

每个专业必须有：

```json
{
  "id": "computer",
  "name": "计算机类",
  "description": "偏重逻辑思维、项目实践和持续学习。",
  "tags": ["逻辑", "编程", "项目", "实践"]
}
```

### 4.2 experienceTemplates.json

每个专业必须对应五个阶段。

阶段建议固定为：

```text
morning
forenoon
noon
afternoon
night
```

每个阶段需要：

- `id`
- `period`
- `question`
- `options`

每个选项需要：

- `id`
- `label`
- `event`
- `locationId`
- `score`

### 4.3 coreCourses.json

来源于当前 Excel 表的 `核心课程` sheet。

建议结构：

```json
[
  {
    "major": "计算机类",
    "courseCategory": "专业基础课",
    "courseGroup": "数学基础",
    "courseName": "概率论与数理统计",
    "briefIntro": "学习随机现象、概率分布和统计推断...",
    "usageHint": "适合生成概率统计课、数据分析准备等事件。",
    "source": "...",
    "sourceUrl": "..."
  }
]
```

## 5. 评分逻辑要求

统一使用五个维度：

```text
health
study
social
practice
pressure
```

初始值：

```js
{
  health: 0,
  study: 0,
  social: 0,
  practice: 0,
  pressure: 0
}
```

建议范围：

```text
-2 到 +3
```

原则：

- 单个选项不要影响过大
- 同一专业每个阶段最好有学习型、生活型、社交/实践型选项
- 不要让所有选项都只加 `study`

## 6. 画像逻辑要求

画像由总分决定。

至少支持：

- 高专注学习型
- 实践探索型
- 社交活跃型
- 均衡生活型
- 压力拉满型

逻辑统一写在：

```text
src/utils/profile.js
```

不要把画像判断散落在页面组件里。

## 7. 数据来源与使用原则

你要基于现有样本数据和课程数据生成模板。

目前需要注意：

- 活动样本还不够均衡
- 三个专业样本都偏早晨和上午
- 课程数据质量高于活动样本

因此建议：

- “上课事件”更多参考 `核心课程` sheet
- “自习/实验/项目/社交/放松事件”参考活动样本
- 不要要求 AI 完全从活动样本里自动推出完整五阶段
- 可以人工补齐阶段模板

## 8. 可选 AI 问答后端要求

只有在主流程稳定后再做。

后端目标不是做复杂系统，而是做一个最小代理：

```text
前端
→ POST /api/course-chat
→ 后端读取 coreCourses.json
→ 后端携带 API key 调用模型
→ 返回固定格式回答
```

回答格式固定为：

```text
【简短回答】
...

【相关课程】
1. ...
2. ...

【体验提示】
...
```

必须满足：

- API key 只写在 `.env`
- 前端不出现真实密钥
- AI 调用失败时有本地兜底回答

## 9. 与其他成员的协作边界

你服务成员 A：

- 提供 `majors.json`
- 提供 `experienceTemplates.json`
- 提供 `score.js`
- 提供 `profile.js`

你协作成员 C：

- 对齐 `locationId`
- 对齐活动类型和地点类型命名
- 对齐课程名称与“上课事件”的映射

你不负责：

- 主前端页面排版
- 地图视觉设计
- PPT 最终制作

## 10. 你交付后的验收标准

你完成后，应该满足：

- 三个专业的数据结构统一
- 每个专业都有五阶段模板
- 每个阶段至少有 2-3 个选项
- 前端可以直接调用评分函数
- 前端可以直接调用画像函数
- 核心课程数据可导出成 JSON
- 如果做 AI 后端，接口可以返回固定格式回答

## 11. 建议给 AI coding 工具的任务拆分

推荐顺序：

1. 生成 `majors.json`
2. 生成 `experienceTemplates.json`
3. 生成 `score.js`
4. 生成 `profile.js`
5. 清洗并导出 `coreCourses.json`
6. 可选：生成 `backend/app.py`
7. 可选：生成 `/api/course-chat`

## 12. 可直接给 AI coding 工具的提示词

```text
你现在是这个项目的数据与逻辑开发者。
请为一个“大学专业一日模拟”Web App 设计数据结构和逻辑模块。

要求：
1. 专业包括计算机类、医学类、经管类
2. 每个专业有五个阶段的事件模板
3. 每个阶段有 2-3 个选项
4. 每个选项包含 event、locationId、score
5. score 使用 health、study、social、practice、pressure 五个维度
6. 生成 score.js 和 profile.js
7. 后续要支持基于核心课程数据的课程问答，因此请额外设计 coreCourses.json 结构
8. 如果生成后端，只做一个 /api/course-chat 的轻量代理，不要扩展成复杂系统
```
