# URL Shortener API

## Описание
Это простое приложение для сокращения URL на Node.js с использованием Express и Redis.

## Установка и запуск
1. Клонируйте репозиторий.
2. Установите зависимости: `npm install`.
3. Запустите Redis-сервер.
4. Запустите приложение: `node index.js`.

## Примеры запросов
### Сокращение URL
POST /shorten
```json
{
    "url": "http://www.google.com"
}