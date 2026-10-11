# Server Admin MCP

**Документация / Языки:** [English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [简体中文](README.zh.md)

**MCP-сервер для удалённого управления Linux VPS через ChatGPT и другие MCP-клиенты.**

Реализован на Node.js, TypeScript и Express. Использует MCP через Streamable HTTP.

## Возможности

| Инструмент | Назначение |
| --- | --- |
| `exec` | Выполнение команд оболочки Linux |
| `read_file` | Чтение текстовых файлов на сервере |

## Установка

Требуется Node.js 20 или новее. Для серверной установки пакет удобно держать в отдельной директории:

```bash
sudo mkdir -p /opt/server-admin-mcp
cd /opt/server-admin-mcp
npm init -y
npm install @dedotmoroz/server-admin-mcp
```

Запуск локально установленного пакета:

```bash
npx server-admin-mcp
```

или напрямую:

```bash
/opt/server-admin-mcp/node_modules/.bin/server-admin-mcp
```

По умолчанию MCP доступен по адресу `http://127.0.0.1:3001/mcp`.

### Установка из исходников

```bash
git clone https://github.com/dedotmoroz/server-admin-mcp.git
cd server-admin-mcp
npm install
npm start
```

## Запуск через systemd

Для постоянной работы лучше использовать systemd, а не держать открытой SSH-сессию:

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

Сохраните конфигурацию в `/etc/systemd/system/server-admin-mcp.service`, затем:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now server-admin-mcp
sudo systemctl status server-admin-mcp
```

## HTTPS через Nginx

Для внешнего доступа проксируйте локальный MCP endpoint через HTTPS:

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

Для внешнего доступа обязательно используйте HTTPS.

## Подключение к ChatGPT через Plugin

После настройки DNS, Nginx и TLS подключите ChatGPT к публичному адресу, например `https://mcp.example.com/mcp`. В ChatGPT откройте **Settings → Plugins** и подключите собственный MCP-сервер.

Для первой проверки можно спросить:

> Посмотри имя сервера, uptime, версию ядра Linux и сколько места занято на диске.

## Безопасность

**Внимание:** MCP позволяет выполнять произвольные команды и читать файлы с правами процесса Node.js. Запускайте сервис от отдельного пользователя с минимальными правами, не от root.

В этой минимальной версии нет встроенной аутентификации и OAuth. Не выставляйте сервер в публичный интернет без подходящего слоя контроля доступа. Для некоторых клиентов, включая отдельные способы подключения ChatGPT, может потребоваться OAuth-шлюз.

---

**Другой проект автора:** [KotCat](https://kotcat.com) — сервис для изучения и запоминания иностранных слов.
