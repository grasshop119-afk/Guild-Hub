const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors()); // Разрешаем доступ всем (ПК и мобилам)

app.get('/player', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: 'No code' });

    try {
        const response = await fetch(`https://swgoh.gg/api/player/${code}/`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
            }
        });

        if (!response.ok) throw new Error('SWGOH error');
        
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
