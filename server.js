const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

// Разрешаем запросы со всех адресов (чтобы твой сайт мог достучаться до сервера)
app.use(cors());

// Раздаем статические файлы (чтобы Render мог показать твой index.html)
app.use(express.static(path.join(__dirname, '/')));

// API Маршрут: Получение данных игрока и его гильдии через сервер
app.get('/api/player/:allyCode', async (req, res) => {
    try {
        const allyCode = req.params.allyCode;
        
        // 1. Запрос данных игрока
        const playerResponse = await fetch(`https://swgoh.gg/api/player/${allyCode}/`);
        if (!playerResponse.ok) throw new Error('Player not found');
        const playerData = await playerResponse.json();
        
        // Отправляем данные обратно на фронтенд
        res.json(playerData);
    } catch (error) {
        console.error('Ошибка на сервере:', error);
        res.status(500).json({ error: 'Не удалось получить данные с swgoh.gg' });
    }
});

// Запуск сервера на порту, который выделит Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
