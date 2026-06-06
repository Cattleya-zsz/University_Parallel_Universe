# 大学平行时空 University Parallel Universe

面向高中生的 Web 专业一日模拟体验项目。用户先选择一个想体验的专业方向，再通过一天中的多个时间段做生活与学习选择，系统根据选择生成五维评分、校园路线、专业画像和课程问答内容，帮助用户更直观地理解不同大学专业的学习节奏与生活场景。

当前版本已经完成可演示闭环，并在原 MVP 基础上加入了美术地图、结果画像、路线寻路、课程知识库和本地 AI 代理能力。

## 当前完成度

- 专业体验流程：已完成专业选择、一日模拟、选项记录、五维评分和结果页展示。
- 专业范围：已覆盖计算机类、医学类、经管类。
- 体验数据：共 15 个时间段步骤、60 个选项、12 个校园地点。
- 地图模块：已接入美术版校园地图、道路网络、地点锚点、Dijkstra 路线生成和路线高亮。
- 结果画像：已接入 3 个专业 × 5 类画像类型的结果图资源。
- 课程问答：已接入本地课程知识库，并预留 DeepSeek API 代理。
- 数据校验：`npm run validate:data` 可校验专业、地点、路径、体验模板和课程知识库。

## 核心流程

```text
选择专业
-> 进入一日模拟
-> 在多个时间段做选择
-> 选择影响健康、学习、社交、实践、压力五个维度
-> 选择绑定校园地点
-> 生成校园路线
-> 输出专业体验画像、五维评分、今日选择和课程问答
```

## 技术栈

```text
React 18
Vite
JavaScript
CSS
本地 JSON 数据
Node.js 本地 AI 代理
```

项目结构：

```text
web/       前端体验流程、地图、画像和本地数据
backend/   DeepSeek / AI 代理服务
tools/     数据整理与校验脚本
docs/      分工说明和模块文档
```

## 快速运行

安装前端依赖：

```powershell
cd D:\Uni_Parallel\web
npm install
```

启动前端：

```powershell
cd D:\Uni_Parallel\web
npm run dev
```

启动 AI 代理：

```powershell
cd D:\Uni_Parallel\web
npm run dev:ai
```

前端默认由 Vite 启动，`/api/*` 请求会代理到：

```text
http://127.0.0.1:8787
```

## AI 配置

后端实际读取的是：

```text
backend/.env
```

首次配置时可以复制示例文件：

```powershell
Copy-Item backend\.env.example backend\.env
```

然后在 `backend/.env` 中填写：

```text
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_THINKING=disabled
AI_PROXY_PORT=8787
AI_PROXY_ORIGIN=http://127.0.0.1:5173
```

注意：`.env` 已被 `.gitignore` 忽略，不应提交真实 API key。若未配置 key，系统会使用本地课程知识库和本地评价模板兜底，保证演示不中断。

可用接口：

```text
GET  /api/health
POST /api/course-chat
POST /api/day-evaluation
```

## 数据与资源

主要数据文件：

| 文件 | 说明 |
| --- | --- |
| `web/src/data/majors.json` | 专业列表 |
| `web/src/data/experienceTemplates.json` | 一日模拟问题和选项 |
| `web/src/data/locations.json` | 校园地点、坐标和类型 |
| `web/src/data/paths.json` | 道路网络、地点锚点和默认路线 |
| `web/public/data/paths.json` | 前端运行时读取的道路网络副本 |
| `web/src/data/coreCourses.json` | 核心课程数据 |
| `web/src/data/courseKnowledgeBase.json` | 课程问答知识库 |
| `web/src/data/resultArtAssets.js` | 结果画像资源映射 |

主要美术资源：

```text
web/public/campus-map.png
web/public/campus-map-redline.png
web/public/art/result/{majorId}/{typeKey}.png
```

当前支持的画像类型：

```text
study
practice
social
health
pressure
```

当前支持的地点类型：

```text
life
study
practice
sport
social
medical
```

## 校验与构建

数据校验：

```powershell
cd D:\Uni_Parallel\web
npm run validate:data
```

生产构建：

```powershell
cd D:\Uni_Parallel\web
npm run build
```

预览构建产物：

```powershell
cd D:\Uni_Parallel\web
npm run preview
```

## 当前展示重点

- 体验页：事件选择为主，地图作为实时路线预览辅助展示。
- 结果页：地图作为视觉亮点，占据更大的展示区域；右侧展示专业画像、五维评分和今日选择。
- 地图路线：根据用户选择的地点序列，通过道路网络生成路线并高亮展示。
- 课程问答：在详情页提供围绕专业课程、难度和学习体验的问答入口。

## 开发注意事项

- 不接入真实地图 API，地图使用项目内美术底图和本地道路网络。
- 本地 Excel 数据表默认不纳入 Git 管理。
- 真实 API key 只放在 `backend/.env`，不要写入前端代码或提交到仓库。
- 修改体验模板、地点或路径后，应运行 `npm run validate:data`。
- 修改前端布局或组件后，应运行 `npm run build`。
