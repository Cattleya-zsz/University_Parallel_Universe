# 📊 测试数据文件夹

> ⚠️ **注意**: 此文件夹中的数据仅用于开发演示和测试目的，**不用于最终项目部署**。

## 文件夹说明

本文件夹包含以下测试数据文件：

### 数据文件
| 文件 | 说明 | 替代来源 |
|------|------|----------|
| `majors.json` | 专业列表数据 | 成员B提供 |
| `experienceTemplates.json` | 五阶段日程模板 | 成员B提供 |
| `locations.json` | 校园地点数据 | 成员C提供 |

### 工具函数
| 文件 | 说明 | 替代来源 |
|------|------|----------|
| `score.js` | 评分计算函数 | 成员B提供 |
| `profile.js` | 画像生成函数 | 成员B提供 |

## 使用方式

当前项目为了演示，直接导入此文件夹中的测试数据：

```javascript
import majors from '../data/test/majors.json'
import experienceTemplates from '../data/test/experienceTemplates.json'
import locations from '../data/test/locations.json'
import { updateScores } from '../data/test/score'
import { getProfile } from '../data/test/profile'
```

## 替换时机

当其他成员提供正式数据后，需要：

1. 删除或保留此文件夹（作为备份）
2. 修改 `src/pages/Home.jsx`、`src/pages/Experience.jsx`、`src/pages/Result.jsx` 和 `src/App.jsx` 中的导入路径
3. 修改为使用正式数据文件

## 目录结构

```
src/data/test/
├── README.md              ← 本说明文件
├── majors.json            ← 专业数据（测试）
├── experienceTemplates.json ← 日程模板（测试）
├── locations.json         ← 地点数据（测试）
├── score.js               ← 评分函数（测试）
└── profile.js             ← 画像函数（测试）
```
