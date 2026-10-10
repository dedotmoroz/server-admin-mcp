# Server Admin MCP

**Documentation / Languages:** [English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [简体中文](README.zh.md)

**MCP server for remote Linux VPS administration through ChatGPT and other MCP clients.**

Built with Node.js, TypeScript, and Express. Uses the MCP protocol with Streamable HTTP.

[Русская документация](README.ru.md)

## Features

| Tool | Purpose |
| --- | --- |
| `exec` | Execute Linux shell commands |
| `read_file` | Read text files on the server |

For `exec`, you can specify a working directory and execution timeout.

## Installation

Requires Node.js 20 or newer.

```bash
git clone https://github.com/dedotmoroz/server-admin-mcp.git
cd server-admin-mcp
npm install
npm start
```

By default, MCP is available locally at `http://127.0.0.1:3001/mcp`.

## HTTPS via Nginx

```nginx
location = /mcp {
    proxy_pass http://127.0.0.1:3001/mcp;
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_read_timeout 3600s;
}
```

Always use HTTPS for external access.

## Connecting to ChatGPT via Plugin

After installing MCP on a VPS, it must be publicly accessible over HTTPS. For example:

```text
https://example.com/mcp
```

In ChatGPT, open **Settings → Plugins** and create or connect an MCP plugin using your server's public HTTPS address. The endpoint for this project is `/mcp`.

Once connected, the `exec` and `read_file` tools become available to ChatGPT. You can then administer the server using normal chat messages.

For an initial test, ask:

> Check the server hostname, uptime, Linux kernel version, and disk usage.

If the connection works, ChatGPT will call MCP and return real VPS data. You can also ask:

> What processes are currently running on the server?

> Show free disk space and memory usage.

> Read /etc/os-release and tell me which Linux version is installed.

> Check the nginx status.

**Important:** ChatGPT's interface and menu names may change. Look for **Plugins** in ChatGPT settings and the option to connect a custom MCP server.

## Security

**Warning:** this MCP can execute arbitrary commands and read files with the permissions of the Node.js process. Run it as a dedicated least-privilege user, not root.

OAuth is not implemented in this minimal version. Some clients, including certain ChatGPT connection methods, may require an OAuth gateway.

## Documentation localization

The primary documentation is [README.md](README.md) (English). Other translations are available through the language links at the top.

---

**Another project by the author:** [KotCat](https://kotcat.com) — a service for learning and remembering foreign-language vocabulary.
