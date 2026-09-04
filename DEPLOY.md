# 华容道 部署指南

## 1. 部署 Cloudflare Worker (排行榜 API)

```bash
cd worker
npm init -y
npm install -g wrangler
wrangler login
wrangler kv namespace create KV
```

将输出的 KV namespace ID 填入 `wrangler.toml` 的 `id` 字段。

```bash
wrangler deploy
```

记下部署后的 URL (如 `https://hrd-api.xxx.workers.dev`)。

## 2. 配置前端

打开 `script.js`，找到:
```javascript
const API_BASE = localStorage.getItem('hrd_api') || '';
```

改为:
```javascript
const API_BASE = 'https://hrd-api.xxx.workers.dev';
```

或者在浏览器控制台执行:
```javascript
localStorage.setItem('hrd_api', 'https://hrd-api.xxx.workers.dev');
```

## 3. 部署前端到 GitHub Pages

```bash
cd huarongdao
git init
git add .
git commit -m "华容道"
git remote add origin https://github.com/用户名/仓库名.git
git push -u origin main
```

在 GitHub 仓库 Settings > Pages > Source 选择 `main` 分支。

## 4. 可选: 用 Cloudflare Pages 部署

```bash
wrangler pages project create huarongdao
wrangler pages deploy . --project-name=hrd
```

## 文件结构

```
huarongdao/
├── index.html
├── style.css
├── script.js
├── levels.md
├── 1.mp3          # 背景音乐
├── xy.png         # 背景图片
└── worker/
    ├── index.js   # Cloudflare Worker
    └── wrangler.toml
```
