# Server Admin MCP

Self-hosted Model Context Protocol (MCP) server for Linux VPS administration using Node.js, TypeScript, Express, and Streamable HTTP.

**Security warning:** This server allows arbitrary shell execution and file reading. Do not expose it without strong authentication and network restrictions. Run it as a dedicated least-privilege user, not root.

## Tools

- `exec`: execute a shell command, optionally setting working directory and timeout.
- `read_file`: read a text file by path.

## Setup

Install Node.js 20+, clone this repository, and run:

```bash
npm install
export MCP_TOKEN="$(openssl rand -hex 32)"
npm start
```

The server listens at `127.0.0.1:3001/mcp` and requires `Authorization: Bearer <MCP_TOKEN>`.

### Nginx HTTPS reverse proxy

```nginx
location = /mcp {
    proxy_pass http://127.0.0.1:3001/mcp;
    proxy_http_version 1.1;
    proxy_set_header Authorization $http_authorization;
    proxy_buffering off;
    proxy_read_timeout 3600s;
}
```

## Security and deployment status

The published source is based on the working VPS server, **with Bearer authentication enabled**. The deployed version previously had the authentication check commented out. Publishing this repository does not update the VPS deployment.

The server does not implement OAuth, which some MCP clients require. Never commit tokens or other credentials. Consider limiting accessible commands and file paths before exposing this server to untrusted clients.
