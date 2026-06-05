# University Parallel Universe

大学平行时空是一个面向高中生的 Web 专业一日模拟项目。

项目希望通过"选择专业 → 模拟一天 → 做出选择 → 生成路线和画像"的方式，让高中生更直观地理解不同专业在大学中的学习节奏、活动场景和生活方式差异。

## 项目目标

本项目当前阶段以一周内可展示的 MVP 为目标，优先完成一个稳定、清晰、可演示的前端交互闭环。

核心流程：

```text
选择专业
→ 进入一日日程模拟
→ 在多个时间段做选择
→ 每个选择影响多维度分数
→ 每个事件绑定校园地点
→ 生成校园路线
→ 输出最终专业体验画像
```

## 核心功能

- 专业选择：用户选择想体验的专业方向
- 一日模拟：将一天拆分为有限个时间段
- 分支选择：每个时间段提供若干事件选项
- 多维评分：根据选择更新学习、健康、社交、实践、压力等维度
- 路线可视化：根据事件地点生成校园路径
- 结果画像：总结用户一天的选择和体验类型

## 技术方向

MVP 阶段采用纯前端方案：

```text
React
Vite
JavaScript
CSS
本地 JSON 数据
```

暂时不依赖后端、数据库、真实地图 API 或机器学习模型。

## 当前文档

- `PROJECT_PLAN.md`：项目规划与一周开发安排
- `DEVELOPMENT_GUIDE.md`：开发规范、数据结构、评分和协作规则
- `tools/`：辅助脚本

## 数据说明

前期数据计划通过人工整理公开社交媒体和短视频平台中的大学生日常 vlog 获得。

数据只记录与日程相关的标准化信息，例如：

- 专业分类
- 活动时间段
- 活动类型
- 活动描述
- 地点类型

不记录博主昵称、头像、真实姓名、具体学校、宿舍楼号、视频链接、评论区个人信息或可识别截图。

本地 Excel 数据统计表默认不纳入 Git 管理。

## 开发原则

优先级如下：

```text
完整流程 > 数据结构清晰 > 展示稳定 > 页面美观 > 扩展功能
```

开发时先保证核心 Demo 能跑通，再考虑扩展专业数量、地图美化、动画效果或后端能力。

---

## 地图模块说明

### 底图尺寸

校园地图使用 SVG 绘制，默认尺寸为：
- 宽度：600px
- 高度：450px

地图采用等距视角风格，包含天空、草地、道路、树木、河流等装饰元素。

### 坐标规则

所有地点坐标使用 **百分比坐标**（0-100）：

| 坐标 | 说明 |
|------|------|
| x: 0 | 地图最左侧 |
| x: 100 | 地图最右侧 |
| y: 0 | 地图最顶部 |
| y: 100 | 地图最底部 |

坐标转换公式：
- `svgX = x * 6`（600px / 100 = 6）
- `svgY = y * 4.5`（450px / 100 = 4.5）

### 地点数据结构

地点数据存储在 `web/src/data/locations.json`：

```json
{
  "id": "library",
  "name": "图书馆",
  "icon": "📚",
  "x": 60,
  "y": 48,
  "type": "study",
  "labelOffsetX": 12,
  "labelOffsetY": 0
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识，用于路线引用 |
| name | string | 地点中文名称 |
| icon | string | Emoji 图标 |
| x | number | X 坐标（百分比） |
| y | number | Y 坐标（百分比） |
| type | string | 地点类型 |
| labelOffsetX | number | 标签水平偏移（像素，避免遮挡） |
| labelOffsetY | number | 标签垂直偏移（像素，避免遮挡） |

### 地点标注说明

根据校园地图图片，各地点位置如下：

| 地图标注 | 地点名称 | ID | 类型 | 位置说明 |
|----------|----------|----|------|----------|
| C2 | 食堂 | cafeteria | life | 左上角区域 |
| R02 | 宿舍 | dorm | life | 食堂右侧 |
| 20 | 教学楼 | teachingBuilding | study | 顶部中央偏右 |
| 18 | 实验楼 | labBuilding | practice | 教学楼下方 |
| 11右下方 | 图书馆/自习室 | library/studyRoom | study | 中部偏右区域 |
| 跑道 | 操场 | sportsField | health | 中部区域 |
| 16 | 社团活动中心 | clubCenter | social | 实验楼左侧 |
| 14 | 校医院 | hospital | practice | 右上方区域 |
| - | 门诊 | clinic | practice | 校医院同位置 |
| R10上方道路 | 校外 | offCampus | practice | 左侧出入口 |
| C1右下方 | 体育馆 | gym | health | 右侧区域 |

### 地点类型

| 类型 | 说明 | 图标示例 |
|------|------|----------|
| entrance | 出入口 | 🚪 |
| life | 生活区域 | 🏠🍽️ |
| study | 学习区域 | 📚✏️🏫 |
| practice | 实践区域 | 🔬🏥🏛️ |
| health | 运动健康 | 🏃⚽🏸 |
| social | 社交区域 | 🎤 |

### 道路数据结构

道路数据存储在 `web/src/data/paths.json`，采用 **nodes + edges + locationAnchors** 结构：

```json
{
  "meta": {
    "version": "1.0",
    "mapWidth": 600,
    "mapHeight": 450
  },
  "nodes": [
    { "id": "n1", "x": 6, "y": 18 }
  ],
  "edges": [
    { "from": "n1", "to": "n2", "type": "main" }
  ],
  "locationAnchors": [
    { "locationId": "offCampus", "nodeId": "n1" }
  ],
  "defaultRoutes": [
    {
      "id": "gateToLibrary",
      "name": "南门到图书馆",
      "locationIds": ["gateSouth", "sportsField", "library"]
    }
  ]
}
```

#### Nodes（节点）

道路网络的交点或端点，使用百分比坐标。地图中共有 32 个道路节点，覆盖主要通行路线。

#### Edges（边）

连接两个节点的道路段：

| 字段 | 说明 |
|------|------|
| from | 起点节点 ID |
| to | 终点节点 ID |
| type | 道路类型（`main` 主干道 / `branch` 支路） |

#### LocationAnchors（地点锚点）

将地点 ID 映射到最近的道路节点，用于路线规划时确定起点和终点。

#### DefaultRoutes（预设路线）

预定义的常用路线，包含地点 ID 序列。

### 标注逻辑

1. **底图标注**：地图底图通过 SVG 直接绘制，包含道路网络、建筑轮廓、自然景观（河流、树木、操场）
2. **地点标注**：根据 locations.json 中的坐标在地图上绘制图标和标签，支持 labelOffsetX/Y 调整标签位置避免遮挡
3. **路线标注**：根据路径算法计算最优路径，使用 SVG polyline 绘制连接线，支持高亮当前路线
4. **道路渲染**：主干道和支路使用不同样式区分（宽度、颜色）

### 文件清单

| 文件 | 路径 | 说明 |
|------|------|------|
| locations.json | `web/src/data/locations.json` | 地点坐标数据（22个地点） |
| paths.json | `web/src/data/paths.json` | 道路网络数据（32节点+41边） |
| CampusMap.jsx | `web/src/components/CampusMap.jsx` | 地图组件 |
| route.js | `web/src/utils/route.js` | 路线工具函数 |