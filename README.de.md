# Server Admin MCP

**Dokumentation / Sprachen:** [English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [简体中文](README.zh.md)

**MCP-Server zur Fernverwaltung eines Linux-VPS über ChatGPT und andere MCP-Clients.**

Entwickelt mit Node.js, TypeScript und Express. Verwendet das MCP-Protokoll mit Streamable HTTP.

[Englische Dokumentation](README.md)

## Funktionen

| Werkzeug | Zweck |
| --- | --- |
| `exec` | Linux-Shell-Befehle ausführen |
| `read_file` | Textdateien auf dem Server lesen |

Für `exec` können Arbeitsverzeichnis und Ausführungs-Timeout angegeben werden.

## Installation

Node.js 20 oder neuer ist erforderlich.

```bash
git clone https://github.com/dedotmoroz/server-admin-mcp.git
cd server-admin-mcp
npm install
npm start
```

Standardmäßig ist MCP lokal unter `http://127.0.0.1:3001/mcp` erreichbar.

## HTTPS über Nginx

```nginx
location = /mcp {
    proxy_pass http://127.0.0.1:3001/mcp;
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_read_timeout 3600s;
}
```

Für externen Zugriff sollte immer HTTPS verwendet werden.

## Verbindung mit ChatGPT über Plugin

Nach der Installation auf dem VPS muss MCP öffentlich über HTTPS erreichbar sein. Zum Beispiel:

```text
https://example.com/mcp
```

Öffnen Sie in ChatGPT **Settings → Plugins** und erstellen oder verbinden Sie ein MCP-Plugin mit der öffentlichen HTTPS-Adresse Ihres Servers. Der Endpoint dieses Projekts ist `/mcp`.

Nach der Verbindung stehen ChatGPT die Werkzeuge `exec` und `read_file` zur Verfügung. Der Server kann anschließend mit normalen Chat-Nachrichten verwaltet werden.

Fragen Sie zum ersten Test beispielsweise:

> Prüfe den Hostnamen des Servers, die Uptime, die Linux-Kernel-Version und die Festplattenbelegung.

Wenn die Verbindung funktioniert, ruft ChatGPT den MCP-Server auf und liefert reale VPS-Daten zurück. Weitere Beispiele:

> Welche Prozesse laufen derzeit auf dem Server?

> Zeige den freien Speicherplatz und die Speichernutzung.

> Lies /etc/os-release und sage mir, welche Linux-Version installiert ist.

> Prüfe den Status von nginx.

**Wichtig:** Die Benutzeroberfläche und Menübezeichnungen von ChatGPT können sich ändern. Suchen Sie in den ChatGPT-Einstellungen nach **Plugins** und nach der Möglichkeit, einen eigenen MCP-Server zu verbinden.

## Sicherheit

**Achtung:** Dieser MCP kann beliebige Befehle ausführen und Dateien mit den Rechten des Node.js-Prozesses lesen. Führen Sie den Dienst mit einem eigenen Benutzer mit minimalen Rechten aus, nicht als root.

OAuth ist in dieser Minimalversion nicht implementiert. Einige Clients, einschließlich bestimmter ChatGPT-Verbindungsarten, können ein OAuth-Gateway benötigen.

## Lokalisierung der Dokumentation

Die Hauptdokumentation ist [README.md](README.md) (Englisch). Weitere Übersetzungen sind über die Sprachlinks oben verfügbar.

---

**Ein weiteres Projekt des Autors:** [KotCat](https://kotcat.com) — ein Dienst zum Lernen und Einprägen fremdsprachiger Vokabeln.
