# Server Admin MCP

**一个可自行部署的 MCP 服务器，可通过 ChatGPT 和其他 MCP 客户端远程管理 Linux VPS。**

使用 Node.js、TypeScript 和 Express 构建，采用 MCP Streamable HTTP 传输方式。

**文档语言：** [English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Deutsch](README.de.md) · 简体中文

## 功能

| 工具 | 说明 |
| --- | --- |
| `exec` | 执行 Shell 命令，可选工作目录和超时时间 |
| `read_file` | 读取服务器上的文本文件 |

## 安装

需要 Node.js 20 或更高版本。

```bash
git clone https://github.com/dedotmoroz/server-admin-mcp.git
cd server-admin-mcp
npm install
export MCP_TOKEN="$(openssl rand -hex 32)"
npm start
```

服务默认监听 `127.0.0.1:3001/mcp`。每个请求都必须携带 `Authorization: Bearer <MCP_TOKEN>` 请求头。

## 使用 Nginx 配置 HTTPS 反向代理

```nginx
location = /mcp {
    proxy_pass http://127.0.0.1:3001/mcp;
    proxy_http_version 1.1;
    proxy_set_header Authorization $http_authorization;
    proxy_buffering off;
    proxy_read_timeout 3600s;
}
```

## 安全提示

**警告：**此服务器能够以运行进程的权限执行任意 Shell 命令并读取文件。请使用具有最小权限的专用用户运行，不要使用 root。务必限制访问权限，切勿将密钥提交到 Git。

**公开仓库中的源码**已启用 Bearer Token 验证，但现有 VPS 部署不会自动更新。此版本尚未实现 OAuth；部分远程 MCP 客户端可能需要支持 OAuth 的网关。

---

**作者的另一个项目：**[KotCat](https://kotcat.com) — 帮助记忆外语词汇的学习工具。
