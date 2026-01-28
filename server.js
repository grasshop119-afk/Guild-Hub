const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// МАКСИМАЛЬНЫЙ ДОСТУП ДЛЯ МОБИЛОК
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/player/:code', async (req, res) => {
    try {
        const allyCode = req.params.code;
        const url = `https://swgoh.gg/api/player/${allyCode}/`;
        
        const response = await axios.get(url, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
                'Accept': 'application/json'
            },
            timeout: 20000 
        });
        
        res.json(response.data);
    } catch (error) {
        console.error("Ошибка API:", error.message);
        const status = error.response ? error.response.status : 500;
        res.status(status).json({ error: 'Игрок не найден или ошибка SWGOH' });
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
