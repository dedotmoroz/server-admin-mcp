# Server Admin MCP

**Dokumentation / Sprachen:** [English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [简体中文](README.zh.md)

**MCP-Server zur Fernverwaltung eines Linux-VPS über ChatGPT und andere MCP-Clients.**

## Installation

Node.js 20 oder neuer ist erforderlich.

```bash
sudo mkdir -p /opt/server-admin-mcp
cd /opt/server-admin-mcp
npm init -y
npm install @dedotmoroz/server-admin-mcp
npx server-admin-mcp
```

Alternativ direkt mit `/opt/server-admin-mcp/node_modules/.bin/server-admin-mcp` starten. Standardmäßig läuft der MCP-Endpunkt unter `http://127.0.0.1:3001/mcp`.

### Installation aus dem Quellcode

```bash
git clone https://github.com/dedotmoroz/server-admin-mcp.git
cd server-admin-mcp
npm install
npm start
```

## systemd

Für den Produktivbetrieb verwenden Sie in einem systemd-Dienst `WorkingDirectory=/opt/server-admin-mcp` und `ExecStart=/opt/server-admin-mcp/node_modules/.bin/server-admin-mcp`.

## HTTPS über Nginx

```nginx
location = /mcp {
    proxy_pass http://127.0.0.1:3001/mcp;
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 3600s;
}
```

Für externen Zugriff immer HTTPS verwenden.

## Sicherheit

**Achtung:** Dieser MCP kann beliebige Befehle ausführen und Dateien mit den Rechten des Node.js-Prozesses lesen. Verwenden Sie einen eigenen Benutzer mit minimalen Rechten, nicht root. Diese Minimalversion enthält keine Authentifizierung und kein OAuth; stellen Sie sie nicht ohne geeignete Zugriffskontrolle öffentlich bereit.

---

**Ein weiteres Projekt des Autors:** [KotCat](https://kotcat.com) — ein Dienst zum Lernen und Einprägen fremdsprachiger Vokabeln.
