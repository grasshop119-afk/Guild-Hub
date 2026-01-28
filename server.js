const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Это заставит сервер отдавать файлы (картинки, лого) из папки, если ты их туда положишь
app.use(express.static(path.join(__dirname, 'public')));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API запрос
app.get('/api/player/:code', async (req, res) => {
    try {
        const allyCode = req.params.code;
        const url = `https://swgoh.gg/api/player/${allyCode}/`;
        const response = await axios.get(url, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: 'Игрок не найден' });
        } else {
            res.status(500).json({ error: 'Ошибка сети' });
        }
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
