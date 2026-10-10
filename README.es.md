# Server Admin MCP

**Documentación / Idiomas:** [English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [简体中文](README.zh.md)

**Servidor MCP para administrar remotamente un VPS Linux mediante ChatGPT y otros clientes MCP.**

Desarrollado con Node.js, TypeScript y Express. Utiliza el protocolo MCP con Streamable HTTP.

[Documentación en inglés](README.md)

## Funciones

| Herramienta | Función |
| --- | --- |
| `exec` | Ejecutar comandos del shell de Linux |
| `read_file` | Leer archivos de texto del servidor |

En `exec` se puede indicar el directorio de trabajo y el tiempo máximo de ejecución.

## Instalación

Requiere Node.js 20 o posterior.

```bash
git clone https://github.com/dedotmoroz/server-admin-mcp.git
cd server-admin-mcp
npm install
npm start
```

Por defecto, MCP está disponible localmente en `http://127.0.0.1:3001/mcp`.

## HTTPS mediante Nginx

```nginx
location = /mcp {
    proxy_pass http://127.0.0.1:3001/mcp;
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_read_timeout 3600s;
}
```

Para el acceso externo, utilice siempre HTTPS.

## Conexión con ChatGPT mediante Plugin

Después de instalar MCP en el VPS, debe estar disponible públicamente mediante HTTPS. Por ejemplo:

```text
https://example.com/mcp
```

En ChatGPT, abra **Settings → Plugins** y cree o conecte un plugin MCP indicando la dirección HTTPS pública de su servidor. El endpoint de este proyecto es `/mcp`.

Después de conectarlo, las herramientas `exec` y `read_file` estarán disponibles para ChatGPT. A partir de ese momento podrá administrar el servidor mediante mensajes normales en el chat.

Para una primera prueba, pregunte:

> Comprueba el nombre del servidor, el uptime, la versión del kernel de Linux y el espacio utilizado en disco.

Si la conexión funciona, ChatGPT llamará al MCP y devolverá datos reales del VPS. También puede preguntar:

> ¿Qué procesos se están ejecutando actualmente en el servidor?

> Muestra el espacio libre en disco y el uso de memoria.

> Lee /etc/os-release y dime qué versión de Linux está instalada.

> Comprueba el estado de nginx.

**Importante:** la interfaz y los nombres de las opciones de ChatGPT pueden cambiar. Busque **Plugins** en la configuración de ChatGPT y la opción para conectar un servidor MCP personalizado.

## Seguridad

**Atención:** este MCP permite ejecutar comandos arbitrarios y leer archivos con los permisos del proceso Node.js. Ejecute el servicio con un usuario dedicado y con privilegios mínimos, no como root.

OAuth no está implementado en esta versión mínima. Algunos clientes, incluidos ciertos métodos de conexión de ChatGPT, pueden requerir una pasarela OAuth.

## Localización de la documentación

La documentación principal es [README.md](README.md) (inglés). Las demás traducciones están disponibles mediante los enlaces de idiomas de la parte superior.

---

**Otro proyecto del autor:** [KotCat](https://kotcat.com) — un servicio para aprender y memorizar vocabulario de idiomas.
