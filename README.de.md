# Server Admin MCP

**Selbst gehosteter MCP-Server zur Verwaltung von Linux-VPS über ChatGPT und andere MCP-Clients.**

Entwickelt mit Node.js, TypeScript und Express; verwendet MCP über Streamable HTTP.

**Dokumentation:** [English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · Deutsch · [中文](README.zh.md)

## Werkzeuge

| Werkzeug | Funktion |
| --- | --- |
| `exec` | Shell-Befehle ausführen, optional mit Arbeitsverzeichnis und Zeitlimit |
| `read_file` | Textdateien auf dem Server lesen |

## Installation

Node.js 20 oder neuer wird benötigt.

```bash
git clone https://github.com/dedotmoroz/server-admin-mcp.git
cd server-admin-mcp
npm install
export MCP_TOKEN="$(openssl rand -hex 32)"
npm start
```

Der Server lauscht auf `127.0.0.1:3001/mcp`. Jede Anfrage benötigt `Authorization: Bearer <MCP_TOKEN>`.

## HTTPS-Reverse-Proxy mit Nginx

```nginx
location = /mcp {
    proxy_pass http://127.0.0.1:3001/mcp;
    proxy_http_version 1.1;
    proxy_set_header Authorization $http_authorization;
    proxy_buffering off;
    proxy_read_timeout 3600s;
}
```

## Sicherheit

**Warnung:** Dieser Server kann beliebige Shell-Befehle ausführen und Dateien mit den Rechten des Serverprozesses lesen. Verwende einen eigenen Benutzer mit minimalen Rechten, nicht root. Beschränke den Zugriff und veröffentliche keine Zugangsdaten in Git.

Die Bearer-Authentifizierung ist im **veröffentlichten Quellcode** aktiviert. Die bereits laufende VPS-Installation wird dadurch nicht automatisch aktualisiert. OAuth wird nicht unterstützt; manche entfernten MCP-Clients benötigen daher ein OAuth-fähiges Gateway.

---

**Weiteres Projekt des Autors:** [KotCat](https://kotcat.com) — ein Tool zum Lernen von Fremdsprachenvokabeln.
