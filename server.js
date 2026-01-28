const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем CORS для всех доменов
app.use(cors());

// Статика из папки public (если она есть)
app.use(express.static(path.join(__dirname, 'public')));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API запрос к swgoh.gg
app.get('/api/player/:code', async (req, res) => {
    try {
        const allyCode = req.params.code;
        const url = `https://swgoh.gg/api/player/${allyCode}/`;
        
        const response = await axios.get(url, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            },
            timeout: 10000 // 10 секунд на ответ
        });
        
        res.json(response.data);
    } catch (error) {
        console.error(`Ошибка для кода ${req.params.code}:`, error.message);
        
        if (error.response) {
            // Ошибка от самого swgoh.gg (например, 404)
            res.status(error.response.status).json({ error: 'Игрок не найден в базе swgoh.gg' });
        } else {
            // Ошибка сети или таймаут
            res.status(500).json({ error: 'Сервер swgoh.gg не отвечает' });
        }
    }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
