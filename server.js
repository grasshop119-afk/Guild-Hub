const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '/')));

// Настройки заголовков, чтобы swgoh.gg нас не блокировал
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Accept': 'application/json'
};

// Маршрут для игрока
app.get('/api/player/:allyCode', async (req, res) => {
    try {
        const allyCode = req.params.allyCode;
        console.log(`Запрос данных для кода: ${allyCode}`);

        const response = await fetch(`https://swgoh.gg/api/player/${allyCode}/`, { headers: HEADERS });
        
        if (!response.ok) {
            console.log(`Ошибка API swgoh.gg: ${response.status}`);
            return res.status(response.status).json({ error: 'Игрок не найден' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Критическая ошибка сервера:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Маршрут для гильдии
app.get('/api/guild/:guildId', async (req, res) => {
    try {
        const guildId = req.params.guildId;
        const response = await fetch(`https://swgoh.gg/api/guild-profile/${guildId}/`, { headers: HEADERS });
        
        if (!response.ok) throw new Error('Guild not found');
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при загрузке гильдии' });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
