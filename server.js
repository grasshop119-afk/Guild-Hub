const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(__dirname));

app.get('/api/player/:allyCode', async (req, res) => {
    const { allyCode } = req.params;
    const cleanCode = allyCode.replace(/-/g, '');

    try {
        console.log(`Searching for: ${cleanCode}`);
        
        // Добавляем заголовки, чтобы имитировать браузер
        const response = await axios.get(`https://swgoh.gg/api/player/${cleanCode}/`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 10000
        });

        if (response.data && response.data.data) {
            const p = response.data.data;
            res.json({
                success: true,
                data: {
                    name: p.name,
                    guild_name: p.guild_name || "Без гильдии"
                }
            });
        } else {
            res.status(404).json({ success: false, error: "Not found" });
        }
    } catch (error) {
        console.error("Fetch error:", error.message);
        res.status(500).json({ success: false, error: "API Error" });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
