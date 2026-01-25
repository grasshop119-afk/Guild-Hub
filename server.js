const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(__dirname));

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

app.get('/api/player/:allyCode', async (req, res) => {
    const allyCode = req.params.allyCode.replace(/-/g, '');
    try {
        // 1. Получаем данные игрока, чтобы узнать ID его гильдии
        const pRes = await axios.get(`https://swgoh.gg/api/player/${allyCode}/`, {
            headers: { 'User-Agent': UA }
        });

        if (!pRes.data || !pRes.data.data) {
            return res.status(404).json({ success: false, error: "Игрок не найден" });
        }

        const playerData = pRes.data.data;
        const guildId = playerData.guild_id;

        if (!guildId) {
            // Если игрок без гильдии, возвращаем только его имя
            return res.json({
                success: true,
                data: {
                    name: playerData.name,
                    guild_name: "Без гильдии",
                    image: "https://game-assets.swgoh.gg/tex.guild_avatar_mon_calamari_01.png"
                }
            });
        }

        // 2. Получаем данные гильдии по её ID (самый надежный способ)
        const gRes = await axios.get(`https://swgoh.gg/api/guild/${guildId}/`, {
            headers: { 'User-Agent': UA }
        });

        const guildData = gRes.data.data;
        
        res.json({
            success: true,
            data: {
                name: playerData.name,
                guild_name: guildData.name,
                // Берем иконку гильдии из базы или ставим стандарт
                image: "https://game-assets.swgoh.gg/tex.guild_avatar_mon_calamari_01.png" 
            }
        });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ success: false, error: "Ошибка синхронизации" });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => console.log(`Server on port ${port}`));
