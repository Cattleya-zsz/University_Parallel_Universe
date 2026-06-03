# AI 代理服务

本目录用于本地接入 DeepSeek。前端只访问 `/api/*`，API key 只放在后端 `.env` 中。

## 本地运行

1. 复制 `backend/.env.example` 为 `backend/.env`
2. 在 `backend/.env` 中填写 `DEEPSEEK_API_KEY`
3. 启动 AI 代理：

```powershell
cd D:\Uni_Parallel\web
npm run dev:ai
```

4. 另开一个终端启动前端：

```powershell
cd D:\Uni_Parallel\web
npm run dev
```

默认代理地址为 `http://127.0.0.1:8787`，Vite 会把 `/api` 请求转发到这个地址。

默认模型为 `deepseek-v4-flash`，并关闭 thinking 输出，适合当前这种简明课程问答。之后如果要做更长的反思式评价，可以在 `.env` 中把 `DEEPSEEK_THINKING` 改为 `enabled`。

## 当前接口

- `GET /api/health`：查看代理状态、模型名和 API key 是否已配置
- `POST /api/course-chat`：课程问答，输入 `majorId` 与 `question`
- `POST /api/day-evaluation`：最终体验评价接口预留，输入一天选择、五维评分和特色课程

如果没有配置 API key，或者 DeepSeek 暂时不可用，接口会返回本地课程库/模板生成的兜底内容，方便课堂展示不中断。
