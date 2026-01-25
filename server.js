const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(__dirname));

// API для получения данных игрока и его гильдии
app.get('/api/player/:allyCode', async (req, res) => {
    const allyCode = req.params.allyCode.replace(/-/g, '');
    try {
        // Получаем данные игрока
        const playerRes = await axios.get(`https://swgoh.gg/api/player/${allyCode}/`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        if (playerRes.data && playerRes.data.data) {
            const p = playerRes.data.data;
            res.json({
                success: true,
                data: {
                    name: p.name,
                    guild_name: p.guild_name || "Без гильдии",
                    guild_id: p.guild_id
                }
            });
        } else {
            res.status(404).json({ success: false, error: "Игрок не найден" });
        }
    } catch (error) {
        console.error("Ошибка сервера:", error.message);
        res.status(500).json({ success: false, error: "Ошибка API или неверный код" });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Сервер: http://localhost:${port}`);
});
