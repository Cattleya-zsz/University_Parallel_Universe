# Git 协作简要指引

本文用于组员第一次把项目同步到本地，以及日常修改后提交代码。

## 1. 第一次下载项目

先在电脑上选一个放项目的文件夹，然后执行：

```bash
git clone git@github.com:Cattleya-zsz/University_Parallel_Universe.git
cd University_Parallel_Universe
```

如果 SSH 还没有配置好，也可以临时用 HTTPS：

```bash
git clone https://github.com/Cattleya-zsz/University_Parallel_Universe.git
cd University_Parallel_Universe
```

## 2. 每次开始写代码前

先进入项目目录，再同步远程最新版本：

```bash
cd University_Parallel_Universe
git pull
```

建议每次开始工作前都先执行一次 `git pull`，减少和别人改到同一文件时的冲突。

## 3. 查看当前改了什么

```bash
git status
```

常见结果：

- `modified`：修改过的文件
- `untracked`：新建但还没加入 Git 的文件
- `nothing to commit`：当前没有需要提交的改动

## 4. 提交自己的修改

确认改动没问题后，先把文件加入暂存区：

```bash
git add .
```

然后提交：

```bash
git commit -m "简短说明这次改了什么"
```

示例：

```bash
git commit -m "Add frontend home page"
git commit -m "Update campus map locations"
```

提交信息不用很长，但要能看出这次做了什么。

## 5. 推送到 GitHub

```bash
git push
```

如果是第一次推送当前分支，可能需要：

```bash
git push -u origin main
```

## 6. 推荐的日常流程

```bash
git pull
git status
# 修改文件
git status
git add .
git commit -m "说明本次修改"
git push
```

## 7. 注意事项

- 不要提交本地 Excel 数据表、`.env`、`node_modules/`、`dist/` 等文件，它们已经写进 `.gitignore`。
- 修改前最好先在群里说一声自己负责哪个文件，尤其是 `App.jsx`、`styles.css`、`experienceTemplates.json` 这类容易冲突的文件。
- 如果 `git pull` 或 `git push` 时出现冲突、报错，不要乱删文件，先把报错截图发到群里。
- 每次提交尽量只包含自己负责的一类改动，不要把很多无关修改混在一起。

## 8. 分工提醒

- Part A：主要改前端页面、组件和交互流程。
- Part B：主要改数据、评分、画像和最终评价逻辑。
- Part C：主要改地图、路线展示和展示材料。

如果需要改别人负责的文件，先沟通再动手。

## 9. 给 AI Coding 工具的 Git 提示词

如果使用 Trae、Cursor、Codex 等 AI coding 工具，可以直接把下面的提示词发给 AI。

### 9.1 第一次同步项目

```text
请帮我把 GitHub 仓库同步到本地。
仓库地址是：
git@github.com:Cattleya-zsz/University_Parallel_Universe.git

要求：
1. 如果当前文件夹不是项目目录，请先提醒我选择一个合适的位置。
2. 执行 git clone。
3. clone 完成后进入项目目录。
4. 执行 git status，告诉我当前分支和工作区状态。
5. 不要修改任何项目文件。
```

如果 SSH 不能用，可以让 AI 改用 HTTPS：

```text
SSH clone 失败了，请临时改用 HTTPS 地址 clone：
https://github.com/Cattleya-zsz/University_Parallel_Universe.git

clone 后请执行 git status，并告诉我是否成功。
```

### 9.2 开始写代码前同步最新版本

```text
请帮我在当前项目中同步远程最新代码。

要求：
1. 先执行 git status，确认我本地有没有未提交修改。
2. 如果有未提交修改，先停下来提醒我，不要直接覆盖。
3. 如果工作区干净，执行 git pull。
4. pull 完成后再次执行 git status，并用简短中文总结结果。
```

### 9.3 提交我的修改

```text
请帮我提交这次修改。

要求：
1. 先执行 git status，列出本次会提交的文件。
2. 检查不要提交 .env、node_modules、dist、本地 Excel 数据表等不该入库的文件。
3. 如果提交范围看起来正常，执行 git add。
4. 创建一个简短清楚的英文 commit message。
5. 执行 git commit。
6. commit 后执行 git status，确认工作区是否干净。
7. 先不要 push，等我确认。
```

### 9.4 提交并推送到 GitHub

```text
请帮我把当前修改提交并推送到 GitHub。

要求：
1. 先执行 git status，告诉我有哪些文件会被提交。
2. 检查不要提交 .env、node_modules、dist、本地 Excel 数据表等不该入库的文件。
3. 如果提交范围正常，执行 git add 和 git commit。
4. commit message 用简短英文，说明本次修改内容。
5. commit 成功后执行 git pull，避免远程有更新。
6. 如果 pull 没有冲突，再执行 git push。
7. 如果出现冲突或报错，立刻停止，不要乱删文件，并把报错信息告诉我。
```

### 9.5 只推送已经提交的内容

```text
请帮我把当前本地 commit 推送到 GitHub。

要求：
1. 执行 git status，确认是否有未提交修改。
2. 如果有未提交修改，提醒我这些修改不会被 push，先不要处理它们。
3. 执行 git push。
4. push 后告诉我是否成功。
```

### 9.6 出现冲突时

```text
git pull 或 git push 出现冲突了。
请帮我查看冲突原因，但不要自动删除文件，也不要强制覆盖。

要求：
1. 执行 git status。
2. 列出发生冲突的文件。
3. 用中文解释每个冲突大概是什么意思。
4. 给出建议处理方案。
5. 在我确认前，不要执行 git reset、git checkout、git clean 或强制 push。
```

### 9.7 安全提醒

让 AI 执行 Git 操作时，尽量加上这些要求：

```text
不要执行 git reset --hard。
不要执行 git clean -fd。
不要强制 push。
不要删除我没有明确要求删除的文件。
如果发现未提交修改，先提醒我再继续。
```
