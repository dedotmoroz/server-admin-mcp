# Server Admin MCP

**Documentation / Языки:** [English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [简体中文](README.zh.md)

**Self-hosted MCP server for remote Linux VPS administration through ChatGPT and other MCP clients.**

Built with Node.js, TypeScript, Express, and MCP Streamable HTTP.

**Documentation:** English · [Русский](README.ru.md)

## Tools

| Tool | Description |
| --- | --- |
| `exec` | Execute shell commands, optionally with working directory and timeout |
| `read_file` | Read a text file from the server |

## Installation

Requires Node.js 20+.

```bash
git clone https://github.com/dedotmoroz/server-admin-mcp.git
cd server-admin-mcp
npm install
export MCP_TOKEN="$(openssl rand -hex 32)"
npm start
```

The server listens at `127.0.0.1:3001/mcp`. Requests require `Authorization: Bearer <MCP_TOKEN>`.

## Nginx HTTPS proxy

```nginx
location = /mcp {
    proxy_pass http://127.0.0.1:3001/mcp;
    proxy_http_version 1.1;
    proxy_set_header Authorization $http_authorization;
    proxy_buffering off;
    proxy_read_timeout 3600s;
}
```

## Security

**Warning:** This MCP can execute arbitrary shell commands and read files with the privileges of its process. Run as a dedicated least-privileged user, not root. Restrict access and never commit secrets.

Bearer authentication is enabled in the **published source**, but the existing VPS deployment has not been updated automatically. The server does not implement OAuth, which some remote MCP clients may require.

## Documentation languages

- [English](README.md)
- [Русский](README.ru.md)

Additional translations can be added as `README.de.md`, `README.fr.md`, etc.

---

**Another project by the author**: [KotCat](https://kotcat.com) — a tool for learning and remembering foreign-language vocabulary.
