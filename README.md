# 岁月的个人图床

基于 Cloudflare Workers / Pages 的现代化个人图床（cloudflare-imgbed）。

- 仓库：[agentai2026/sueiyue-Image-hosting](https://github.com/agentai2026/sueiyue-Image-hosting)
- 项目主页（GitHub Pages）：https://agentai2026.github.io/sueiyue-Image-hosting/

## 功能概览

- 图片 / 文件上传与管理
- Cloudflare KV / D1 / R2 存储支持
- Docker 与 Workers 双部署方式

## 本地运行

```bash
npm install
npm start
```

本地开发服务默认：http://localhost:8080

## Cloudflare Workers 部署

1. 配置 `deploy/worker/wrangler.toml` 中的 D1 / R2 / KV 等 binding
2. 执行：

```bash
npm run deploy:worker
```

## Docker 部署

```bash
docker compose up -d
```

## GitHub Pages 说明

GitHub Pages 托管的是项目介绍站。完整图床能力（上传、存储、鉴权）需要部署到 Cloudflare Workers / Pages 或 Docker 环境。
