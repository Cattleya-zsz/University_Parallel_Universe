# 项目目录结构说明

> **最后更新**: 2026-06-01

---

## 📁 目录树

```
项目根目录/
├── docs/                          # 📚 文档存放区
│   ├── GIT_COLLABORATION_GUIDE.md    # Git 协作指引
│   ├── PROJECT_PLAN.md               # 项目计划
│   └── ROLE_A_FRONTEND_GUIDE.md      # 角色 A 前端开发指引
│
├── public/                        # 🖼️ 静态资源
│   └── vite.svg                       # Vite 图标
│
├── src/                           # 💻 源代码（核心）
│   │
│   ├── components/                  # 🧩 可复用组件
│   │   ├── CampusMap.jsx              # ⚠️ 地图占位组件（待角色C实现）
│   │   ├── CourseChat.jsx             # ⚠️ 问答占位组件（待角色C实现）
│   │   ├── MajorCard.jsx              # 专业卡片组件
│   │   ├── OptionCard.jsx             # 选项卡片组件
│   │   └── ScorePanel.jsx             # 分数面板组件
│   │
│   ├── pages/                       # 📄 页面组件
│   │   ├── Home.jsx                  # 首页（专业选择）
│   │   ├── Experience.jsx            # 体验模拟页（五阶段选择）
│   │   └── Result.jsx                # 结果页（画像、路线、评分）
│   │
│   ├── data/                        # 📊 数据文件
│   │   └── test/                     # ⚠️ 测试数据（仅用于演示，不用于生产）
│   │       ├── README.md                 # 测试数据说明
│   │       ├── majors.json               # 专业数据（待角色B替换）
│   │       ├── experienceTemplates.json  # 日程模板（待角色B替换）
│   │       ├── locations.json           # 地点数据（待角色C替换）
│   │       ├── score.js                # 评分函数（待角色B替换）
│   │       └── profile.js              # 画像生成函数（待角色B替换）
│   │
│   ├── App.jsx                      # 🏠 主应用组件（状态管理）
│   ├── main.jsx                     # 🚀 应用入口
│   └── styles.css                   # 🎨 全局样式
│
├── .gitignore                      # Git 忽略文件
├── package.json                    # 项目依赖配置
├── package-lock.json               # 依赖锁文件
├── vite.config.js                  # Vite 配置
├── index.html                      # HTML 入口
│
├── README.md                       # 📖 项目说明（必读）
├── COLLABORATION.md                # 🤝 协作接口说明
└── DIRECTORY_STRUCTURE.md          # ➡️ 本文档
```

---

## 📋 目录说明

### docs/ - 文档文件夹
存放所有项目文档、计划、指南等。

**文件说明**：
| 文件 | 用途 |
|------|------|
| `GIT_COLLABORATION_GUIDE.md` | Git 协作操作指南 |
| `PROJECT_PLAN.md` | 项目计划与需求说明 |
| `ROLE_A_FRONTEND_GUIDE.md` | 角色 A 开发说明 |

---

### src/ - 源代码（核心）

#### src/components/ - 可复用组件
存放通用的 React 组件，可被多个页面使用。

| 组件 | 状态 | 负责人 | 说明 |
|------|------|--------|------|
| `MajorCard.jsx` | ✅ 已完成 | 角色 A | 专业选择卡片 |
| `OptionCard.jsx` | ✅ 已完成 | 角色 A | 选项卡片 |
| `ScorePanel.jsx` | ✅ 已完成 | 角色 A | 分数显示面板 |
| `CampusMap.jsx` | ⚠️ 占位 | 角色 C | 校园地图组件（待实现） |
| `CourseChat.jsx` | ⚠️ 占位 | 角色 C | 课程问答组件（待实现） |

#### src/pages/ - 页面组件
存放三个主页面。

| 页面 | 状态 | 负责人 | 说明 |
|------|------|--------|------|
| `Home.jsx` | ✅ 已完成 | 角色 A | 首页，专业选择 |
| `Experience.jsx` | ✅ 已完成 | 角色 A | 五阶段体验模拟页 |
| `Result.jsx` | ✅ 已完成 | 角色 A | 结果展示页 |

#### src/data/ - 数据文件

| 文件夹 | 状态 | 说明 |
|--------|------|------|
| `test/` | ⚠️ 仅用于演示 | 测试数据，待正式数据替换 |

**待替换为正式数据**：
- 角色 B 提供：`majors.json`, `experienceTemplates.json`, `score.js`, `profile.js`
- 角色 C 提供：`locations.json`

#### src/App.jsx - 主应用
**状态管理核心**：
| 状态 | 说明 |
|------|------|
| `page` | 当前页面：`'home'` / `'experience'` / `'result'` |
| `selectedMajor` | 选中的专业对象 |
| `currentStep` | 当前阶段（0-4） |
| `selectedOptions` | 用户选择记录数组 |
| `scores` | 分数对象：`{ health, study, social, practice, pressure }` |

---

## 🎯 分工边界

### 角色 A（前端主流程）
- ✅ `src/components/` 除占位组件外的所有组件
- ✅ `src/pages/` 所有页面
- ✅ `src/App.jsx` 和 `src/main.jsx`
- ✅ `src/styles.css`
- ⚠️ `src/data/test/` 仅提供测试数据

### 角色 B（数据与逻辑）
- ❗ `src/data/majors.json` - 正式专业数据
- ❗ `src/data/experienceTemplates.json` - 正式日程模板
- ❗ `src/utils/score.js` - 正式评分计算
- ❗ `src/utils/profile.js` - 正式画像生成

### 角色 C（可视化组件）
- ❗ `src/data/locations.json` - 地点数据
- ❗ `src/components/CampusMap.jsx` - 地图实现
- ❗ `src/components/CourseChat.jsx` - 问答实现

---

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 访问 http://localhost:5173
```

---

## ⚠️ 注意事项

1. **请勿直接修改 `src/data/test/` 中的文件**
   - 这些是测试数据，仅用于演示
   - 正式数据应该放到 `src/data/` 根目录（角色B和C提供）

2. **修改前请确认分工**
   - 多人协作时，避免修改别人负责的文件
   - 修改前先在群里打招呼

3. **Git 提交说明**
   - 每次提交仅包含一类改动
   - 使用清晰的 commit message
