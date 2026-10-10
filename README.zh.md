# Server Admin MCP

**文档 / 语言：** [English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [简体中文](README.zh.md)

**用于通过 ChatGPT 和其他 MCP 客户端远程管理 Linux VPS 的 MCP 服务器。**

使用 Node.js、TypeScript 和 Express 开发，并通过 Streamable HTTP 使用 MCP 协议。

[英文文档](README.md)

## 功能

| 工具 | 用途 |
| --- | --- |
| `exec` | 执行 Linux Shell 命令 |
| `read_file` | 读取服务器上的文本文件 |

使用 `exec` 时可以指定工作目录和执行超时时间。

## 安装

需要 Node.js 20 或更高版本。

```bash
git clone https://github.com/dedotmoroz/server-admin-mcp.git
cd server-admin-mcp
npm install
npm start
```

默认情况下，MCP 在本机地址 `http://127.0.0.1:3001/mcp` 提供服务。

## 通过 Nginx 使用 HTTPS

```nginx
location = /mcp {
    proxy_pass http://127.0.0.1:3001/mcp;
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_read_timeout 3600s;
}
```

对外提供访问时请务必使用 HTTPS。

## 通过 Plugin 连接 ChatGPT

在 VPS 上安装 MCP 后，需要通过 HTTPS 从互联网公开访问。例如：

```text
https://example.com/mcp
```

在 ChatGPT 中打开 **Settings → Plugins**，创建或连接一个 MCP Plugin，并填写服务器的公开 HTTPS 地址。本项目使用的 endpoint 为 `/mcp`。

连接成功后，ChatGPT 即可使用 `exec` 和 `read_file` 工具。之后可以直接通过普通聊天消息管理服务器。

首次测试时，可以询问：

> 查看服务器主机名、运行时间、Linux 内核版本以及磁盘使用情况。

如果连接正常，ChatGPT 会调用 MCP 并返回 VPS 的真实数据。还可以询问：

> 服务器当前运行了哪些进程？

> 显示可用磁盘空间和内存使用情况。

> 读取 /etc/os-release，并告诉我安装的是哪个 Linux 版本。

> 检查 nginx 的状态。

**注意：** ChatGPT 的界面和菜单名称可能会发生变化。请在 ChatGPT 设置中查找 **Plugins**，以及连接自定义 MCP 服务器的选项。

## 安全

**警告：** 此 MCP 可以使用 Node.js 进程的权限执行任意命令并读取文件。请使用具有最小权限的专用用户运行服务，不要使用 root。

此最小实现没有提供 OAuth。某些客户端（包括部分 ChatGPT 连接方式）可能需要 OAuth 网关。

## 文档本地化

主文档为 [README.md](README.md)（英文）。其他语言版本可通过页面顶部的语言链接访问。

---

**作者的另一个项目：** [KotCat](https://kotcat.com) — 一个帮助学习和记忆外语词汇的服务。
