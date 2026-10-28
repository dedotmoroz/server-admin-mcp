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


## OAuth 2.1 (experimental, single administrator)

Version 1.1.0 includes an opt-in Authorization Code + PKCE (S256) provider with
dynamic client registration and protected-resource metadata. **This is an
experimental implementation; review and test before public deployment.**

Generate a password hash on the machine (Node.js 20+):

```bash
node -e 'const c=require("node:crypto");const s=c.randomBytes(16);const p=process.argv[1];console.log(s.toString("hex")+":"+c.scryptSync(p,s,64).toString("hex"))' 'REPLACE_WITH_A_LONG_UNIQUE_PASSWORD'
```

Set environment variables in a root-owned, mode 0600 systemd EnvironmentFile:

```ini
MCP_AUTH_MODE=oauth
MCP_PUBLIC_URL=https://mcp.example.com
MCP_ADMIN_PASSWORD_HASH=<salt:hex>
```

The service **fails to start** if OAuth is enabled without a public HTTPS URL
and password hash. No-auth mode remains bound to localhost and **must not be
exposed publicly**.

Nginx must proxy all of these paths to the local service, not just `/mcp`:
`/mcp`, `/authorize`, `/token`, `/register`,
`/.well-known/oauth-authorization-server`,
`/.well-known/oauth-protected-resource`, and
`/.well-known/oauth-protected-resource/mcp`.

Example inside your TLS server block:

```nginx
location ~ ^/(mcp|authorize|token|register|\\.well-known/oauth-(authorization-server|protected-resource)(/mcp)?)$ {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_buffering off;
    proxy_read_timeout 3600s;
}
```

The OAuth login page explicitly warns that the client can execute shell commands.
Tokens, clients, and authorization codes are stored **in process memory**:
restarting the service invalidates them. There is no refresh-token support yet.
For multi-user or production environments, use an audited identity provider and
persistent token storage. Never run this service as root.

## Connecting to ChatGPT via Plugin

After configuring DNS, Nginx and TLS, connect ChatGPT to your public endpoint, for example `https://mcp.example.com/mcp`. In ChatGPT open **Settings → Plugins** and connect a custom MCP server.

For an initial test, ask:

> Check the server hostname, uptime, Linux kernel version, and disk usage.

## Security

**Warning:** this MCP can execute arbitrary commands and read files with the permissions of the Node.js process. Run it as a dedicated least-privilege user, not root.

OAuth is available as an experimental opt-in in version 1.1.0. Never expose the unauthenticated mode publicly.

---

**Another project by the author:** [KotCat](https://kotcat.com) — a service for learning and remembering foreign-language vocabulary.
