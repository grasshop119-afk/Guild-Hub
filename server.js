const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

// 1. Разрешаем CORS
app.use(cors());

// 2. Указываем серверу, где лежат твои файлы (HTML, CSS, картинки)
app.use(express.static(__dirname));

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
};

// 3. Главная страница (чтобы по ссылке открывался index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. API для поиска игрока и гильдии
app.get('/api/player/:allyCode', async (req, res) => {
    const code = req.params.allyCode;
    try {
        const response = await fetch(`https://swgoh.gg/api/player/${code}/`, { headers: HEADERS });
        
        if (!response.ok) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Ошибка API:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// 5. API для списка гильдии
app.get('/api/guild/:guildId', async (req, res) => {
    try {
        const response = await fetch(`https://swgoh.gg/api/guild-profile/${req.params.guildId}/`, { headers: HEADERS });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Guild Error' });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
