const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // Чтобы Mini App мог достучаться до сервера

app.get('/get_guild/:allyCode', async (req, res) => {
    try {
        // 1. Узнаем ID гильдии игрока
        const player = await axios.get(`https://swgoh.gg/api/player/${req.params.allyCode}/`);
        const guildId = player.data.data.guild_id;

        // 2. Берем данные всей гильдии
        const guild = await axios.get(`https://swgoh.gg/api/guild-profile/${guildId}/`);
        
        // Отдаем только нужное: название и список участников
        res.json({
            name: guild.data.data.name,
            members: guild.data.data.members
        });
    } catch (e) {
        res.status(500).json({ error: "Не нашли игрока или гильдию" });
    }
});

app.listen(3000, () => console.log('Сервер запущен на http://localhost:3000'));
