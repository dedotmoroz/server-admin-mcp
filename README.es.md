# Server Admin MCP

**Documentación / Idiomas:** [English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [简体中文](README.zh.md)

**Servidor MCP para administrar remotamente un VPS Linux mediante ChatGPT y otros clientes MCP.**

## Instalación

Requiere Node.js 20 o posterior.

```bash
sudo mkdir -p /opt/server-admin-mcp
cd /opt/server-admin-mcp
npm init -y
npm install @dedotmoroz/server-admin-mcp
npx server-admin-mcp
```

También puede iniciarse directamente con `/opt/server-admin-mcp/node_modules/.bin/server-admin-mcp`. Por defecto escucha en `http://127.0.0.1:3001/mcp`.

### Instalación desde el código fuente

```bash
git clone https://github.com/dedotmoroz/server-admin-mcp.git
cd server-admin-mcp
npm install
npm start
```

## systemd

Para producción, use `WorkingDirectory=/opt/server-admin-mcp` y `ExecStart=/opt/server-admin-mcp/node_modules/.bin/server-admin-mcp` en un servicio systemd.

## HTTPS mediante Nginx

```nginx
location = /mcp {
    proxy_pass http://127.0.0.1:3001/mcp;
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 3600s;
}
```

Utilice HTTPS para acceso externo.

## Seguridad

**Atención:** este MCP puede ejecutar comandos arbitrarios y leer archivos con los permisos del proceso Node.js. Ejecútelo con un usuario dedicado y privilegios mínimos, no como root. Esta versión mínima no incluye autenticación ni OAuth; no la exponga públicamente sin una capa de control de acceso adecuada.

---

**Otro proyecto del autor:** [KotCat](https://kotcat.com) — un servicio para aprender y memorizar vocabulario de idiomas.
