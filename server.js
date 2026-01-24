const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(__dirname));

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// Главный роут для проверки данных
app.get('/api/check/:code', async (req, res) => {
    try {
        // Вычищаем код от тире и пробелов прямо здесь
        const cleanCode = req.params.code.replace(/\D/g, '');
        console.log(`Запрос для кода: ${cleanCode}`);

        const pResp = await fetch(`https://swgoh.gg/api/player/${cleanCode}/`, { headers: HEADERS });
        
        if (!pResp.ok) {
            return res.status(404).json({ error: 'Игрок не найден' });
        }

        const pData = await pResp.json();
        
        // Формируем ответ: берем имя игрока и данные гильдии
        const result = {
            playerName: pData.data.name,
            guildName: pData.data.guild_name || "Без гильдии",
            // Стандартная иконка гильдии (т.к. API swgoh.gg не всегда дает прямую ссылку на герб)
            guildBanner: "https://game-assets.swgoh.gg/tex.guild_avatar_mon_calamari_01.png"
        };

        res.json(result);
    } catch (e) {
        console.error('Ошибка сервера:', e);
        res.status(500).json({ error: 'Ошибка на стороне сервера' });
    }
});

// Отдаем index.html при любом заходе на сайт
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
