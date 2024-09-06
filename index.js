const express = require('express');
const validUrl = require('valid-url');
const { v4: uuidv4 } = require('uuid');
const redis = require('redis');

// Инициализация приложения Express
const app = express();
app.use(express.json());

// Инициализация клиента Redis
const client = redis.createClient();

// Обработчик POST /shorten для создания сокращенного URL
app.post('/shorten', async (req, res) => {
    const { url } = req.body;

    // Валидация URL
    if (!validUrl.isUri(url)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    // Генерация уникального кода
    const shortCode = uuidv4().slice(0, 8);

    // Сохранение в Redis
    client.set(shortCode, url, 'EX', 60 * 60 * 24); 

    // Возврат сокращенного URL
    return res.status(200).json({ shortCode, redirectUrl: `http://localhost:3000/${shortCode}` });
});

// Обработчик GET /:shortCode для редиректа на оригинальный URL
app.get('/:shortCode', (req, res) => {
    const { shortCode } = req.params;

    // Поиск оригинального URL по коду
    client.get(shortCode, (err, url) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (url) {
            return res.redirect(302, url);
        } else {
            return res.status(404).json({ error: 'URL Not Found' });
        }
    });
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
