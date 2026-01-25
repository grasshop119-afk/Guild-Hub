const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '.')));

// Эндпоинт для поиска гильдии
app.get('/api/guild/:code', async (req, res) => {
    try {
        const { code } = req.params;
        // 1. Получаем ID гильдии
        const pRes = await axios.get(`https://swgoh.gg/api/player/${code}/`);
        const gId = pRes.data.data.guild_id;

        if (!gId) return res.status(404).json({ error: "Гильдия не найдена" });

        // 2. Получаем профиль гильдии
        const gRes = await axios.get(`https://swgoh.gg/api/guild-profile/${gId}/`);
        res.json(gRes.data.data);
    } catch (e) {
        res.status(500).json({ error: "Ошибка API" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
