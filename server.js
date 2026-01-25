const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Разрешаем серверу отдавать статические файлы (html, картинки, css) из текущей папки
app.use(express.static(__dirname));

// API Точка входа: ищем игрока по коду
app.get('/api/player/:allyCode', async (req, res) => {
    try {
        const { allyCode } = req.params;
        
        // Стучимся в публичный API swgoh.gg
        const response = await axios.get(`https://swgoh.gg/api/player/${allyCode}/`);
        
        // Если игрок найден, swgoh.gg возвращает JSON с полем data
        if (response.data && response.data.data) {
            res.json({
                data: {
                    name: response.data.data.name,
                    guild_name: response.data.data.guild_name || "Без гильдии",
                    // Можно добавить другие поля, если нужно (например, GP)
                }
            });
        } else {
            res.status(404).json({ error: "Игрок не найден" });
        }
    } catch (error) {
        console.error("Ошибка при запросе к swgoh.gg:", error.message);
        res.status(500).json({ error: "Ошибка сервера или неверный код" });
    }
});

// На любой другой запрос отдаем главную страницу
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
