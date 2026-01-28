const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем CORS, чтобы мобильный Telegram не блокировал запросы
app.use(cors());

// Раздаем статические файлы (твой index.html)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Основной API-маршрут
app.get('/api/player/:code', async (req, res) => {
    const allyCode = req.params.code;
    console.log(`[SERVER] Получен запрос для кода: ${allyCode}`);
    
    try {
        const url = `https://swgoh.gg/api/player/${allyCode}/`;
        const response = await axios.get(url, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            },
            timeout: 15000 
        });
        
        console.log(`[SERVER] Данные для ${allyCode} успешно получены`);
        res.json(response.data);
    } catch (error) {
        console.error(`[SERVER] Ошибка для ${allyCode}:`, error.message);
        
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: 'Игрок не найден' });
        } else {
            res.status(500).json({ error: 'Ошибка сервера SWGOH' });
        }
    }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
