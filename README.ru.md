# Server Admin MCP

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
export MCP_TOKEN="$(openssl rand -hex 32)"
npm start
```

По умолчанию MCP доступен локально по адресу `http://127.0.0.1:3001/mcp`. Каждый запрос должен содержать заголовок `Authorization: Bearer <MCP_TOKEN>`.

## HTTPS через Nginx

```nginx
location = /mcp {
    proxy_pass http://127.0.0.1:3001/mcp;
    proxy_http_version 1.1;
    proxy_set_header Authorization $http_authorization;
    proxy_buffering off;
    proxy_read_timeout 3600s;
}
```

Для внешнего доступа обязательно используйте HTTPS.

## Безопасность

**Внимание:** этот MCP позволяет выполнять произвольные команды и читать файлы с правами процесса Node.js. Запускайте сервис от отдельного пользователя с минимальными правами, не от root. Ограничивайте доступ к серверу и храните токены вне Git.

В опубликованном коде проверка Bearer-токена включена. Это **не означает**, что авторизация уже включена на работающем VPS: развёрнутый экземпляр нужно обновить отдельно.

OAuth в этой минимальной реализации отсутствует. Для некоторых клиентов, в том числе отдельных способов подключения ChatGPT, может потребоваться OAuth-шлюз.

## Локализация документации

Основная документация — [README.md](README.md) (English). Русская версия — этот файл. Можно добавлять и другие языки, например `README.de.md`, `README.fr.md` и `README.es.md`.
