# Server Admin MCP

**Servidor MCP autoalojado para administrar servidores Linux VPS desde ChatGPT y otros clientes MCP.**

Desarrollado con Node.js, TypeScript y Express; utiliza MCP sobre HTTP con transporte Streamable HTTP.

**Documentación:** [English](README.md) · [Русский](README.ru.md) · Español · [Deutsch](README.de.md) · [中文](README.zh.md)

## Herramientas

| Herramienta | Función |
| --- | --- |
| `exec` | Ejecutar comandos de shell, con directorio de trabajo y tiempo de espera opcionales |
| `read_file` | Leer archivos de texto del servidor |

## Instalación

Se necesita Node.js 20 o superior.

```bash
git clone https://github.com/dedotmoroz/server-admin-mcp.git
cd server-admin-mcp
npm install
export MCP_TOKEN="$(openssl rand -hex 32)"
npm start
```

El servicio escucha en `127.0.0.1:3001/mcp`. Cada solicitud debe incluir `Authorization: Bearer <MCP_TOKEN>`.

## Proxy HTTPS con Nginx

```nginx
location = /mcp {
    proxy_pass http://127.0.0.1:3001/mcp;
    proxy_http_version 1.1;
    proxy_set_header Authorization $http_authorization;
    proxy_buffering off;
    proxy_read_timeout 3600s;
}
```

## Seguridad

**Advertencia:** este servidor permite ejecutar comandos arbitrarios y leer archivos con los permisos del proceso. Utiliza un usuario dedicado con privilegios mínimos, nunca root. Restringe el acceso y no publiques secretos en Git.

La autenticación Bearer está activada en el **código publicado**, pero la instalación existente en el VPS no se actualiza automáticamente. Esta implementación no incluye OAuth; algunos clientes MCP remotos pueden necesitar una pasarela compatible con OAuth.

---

**Otro proyecto del autor:** [KotCat](https://kotcat.com) — una herramienta para aprender vocabulario de idiomas.
