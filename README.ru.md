# Server Admin MCP

**Documentation / Языки:** [English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [简体中文](README.zh.md)

**MCP-сервер для удалённого управления Linux VPS через ChatGPT и другие MCP-клиенты.**

Реализован на Node.js, TypeScript и Express. Использует протокол MCP (Streamable HTTP).

[English documentation](README.md)

## Возможности

| Инструмент | Назначение |
| --- | --- |
| `exec` | Выполнение команд оболочки Linux |
| `read_file` | Чтение текстовых файлов на сервере |

Для `exec` можно указать рабочую директорию и тайм-аут выполнения команды.

## Установка

Требуется Node.js 20 или новее.

```bash
git clone https://github.com/dedotmoroz/server-admin-mcp.git
cd server-admin-mcp
npm install
npm start
```

По умолчанию MCP доступен локально по адресу `http://127.0.0.1:3001/mcp`.
## HTTPS через Nginx

```nginx
location = /mcp {
    proxy_pass http://127.0.0.1:3001/mcp;
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_read_timeout 3600s;
}
```

Для внешнего доступа обязательно используйте HTTPS.

## Безопасность

**Внимание:** этот MCP позволяет выполнять произвольные команды и читать файлы с правами процесса Node.js. Запускайте сервис от отдельного пользователя с минимальными правами, не от root. 

OAuth в этой минимальной реализации отсутствует. Для некоторых клиентов, в том числе отдельных способов подключения ChatGPT, может потребоваться OAuth-шлюз.

## Локализация документации

Основная документация — [README.md](README.md) (English). Русская версия — этот файл. Можно добавлять и другие языки, например `README.de.md`, `README.fr.md` и `README.es.md`.

---

**Другой проект автора**: [KotCat](https://kotcat.com) — сервис для изучения и запоминания иностранных слов.
