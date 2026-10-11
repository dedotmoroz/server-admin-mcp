# Server Admin MCP

**Documentation / Languages:** [English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [简体中文](README.zh.md)

**MCP server for remote Linux VPS administration through ChatGPT and other MCP clients.**

Built with Node.js, TypeScript, and Express. Uses MCP over Streamable HTTP.

## Features

| Tool | Purpose |
| --- | --- |
| `exec` | Execute Linux shell commands |
| `read_file` | Read text files on the server |

## Installation

Requires Node.js 20 or newer. For a server installation, keep the package in its own directory:

```bash
sudo mkdir -p /opt/server-admin-mcp
cd /opt/server-admin-mcp
npm init -y
npm install @dedotmoroz/server-admin-mcp
```

Start it with the locally installed executable:

```bash
npx server-admin-mcp
```

or directly:

```bash
/opt/server-admin-mcp/node_modules/.bin/server-admin-mcp
```

By default the MCP endpoint is `http://127.0.0.1:3001/mcp`.

### Install from source

```bash
git clone https://github.com/dedotmoroz/server-admin-mcp.git
cd server-admin-mcp
npm install
npm start
```

## Run with systemd

For production, run it as a service instead of keeping an SSH session open:

```ini
[Unit]
Description=Server Admin MCP
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/server-admin-mcp
ExecStart=/opt/server-admin-mcp/node_modules/.bin/server-admin-mcp
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Save this as `/etc/systemd/system/server-admin-mcp.service`, then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now server-admin-mcp
sudo systemctl status server-admin-mcp
```

## HTTPS via Nginx

Expose the local MCP endpoint through an HTTPS reverse proxy:

```nginx
location = /mcp {
    proxy_pass http://127.0.0.1:3001/mcp;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 3600s;
}
```

Always use HTTPS for external access.

## Connecting to ChatGPT via Plugin

After configuring DNS, Nginx and TLS, connect ChatGPT to your public endpoint, for example `https://mcp.example.com/mcp`. In ChatGPT open **Settings → Plugins** and connect a custom MCP server.

For an initial test, ask:

> Check the server hostname, uptime, Linux kernel version, and disk usage.

## Security

**Warning:** this MCP can execute arbitrary commands and read files with the permissions of the Node.js process. Run it as a dedicated least-privilege user, not root.

This minimal version does not implement authentication or OAuth. Do not expose it publicly without an appropriate access-control layer. Some clients, including certain ChatGPT connection methods, may require an OAuth gateway.

---

**Another project by the author:** [KotCat](https://kotcat.com) — a service for learning and remembering foreign-language vocabulary.
