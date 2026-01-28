const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем твоему сайту делать запросы к этому серверу
app.use(cors());

app.get('/api/player/:code', async (req, res) => {
    try {
        const allyCode = req.params.code;
        const url = `https://swgoh.gg/api/player/${allyCode}/`;
        
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении данных' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
