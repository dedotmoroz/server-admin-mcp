# Server Admin MCP

**文档 / 语言：** [English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [简体中文](README.zh.md)

**用于通过 ChatGPT 和其他 MCP 客户端远程管理 Linux VPS 的 MCP 服务器。**

## 安装

需要 Node.js 20 或更高版本。

```bash
sudo mkdir -p /opt/server-admin-mcp
cd /opt/server-admin-mcp
npm init -y
npm install @dedotmoroz/server-admin-mcp
npx server-admin-mcp
```

也可以直接运行 `/opt/server-admin-mcp/node_modules/.bin/server-admin-mcp`。默认 MCP 地址为 `http://127.0.0.1:3001/mcp`。

### 从源码安装

```bash
git clone https://github.com/dedotmoroz/server-admin-mcp.git
cd server-admin-mcp
npm install
npm start
```

## systemd

生产环境建议创建 systemd 服务，并设置 `WorkingDirectory=/opt/server-admin-mcp` 和 `ExecStart=/opt/server-admin-mcp/node_modules/.bin/server-admin-mcp`。

## 通过 Nginx 使用 HTTPS

```nginx
location = /mcp {
    proxy_pass http://127.0.0.1:3001/mcp;
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 3600s;
}
```

外部访问请始终使用 HTTPS。

## 安全

**警告：** 此 MCP 可以使用 Node.js 进程权限执行任意命令并读取文件。请使用具有最小权限的专用用户运行，不要使用 root。此最小版本没有内置身份验证或 OAuth；没有适当访问控制时不要公开到互联网。

---

**作者的另一个项目：** [KotCat](https://kotcat.com) — 一个帮助学习和记忆外语词汇的服务。
