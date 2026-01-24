const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.static(__dirname));

const HEADERS = { 'User-Agent': 'Mozilla/5.0' };

app.get('/api/check/:code', async (req, res) => {
    try {
        const code = req.params.code.replace(/\D/g, '');
        const pResp = await fetch(`https://swgoh.gg/api/player/${code}/`, { headers: HEADERS });
        if (!pResp.ok) return res.status(404).json({ error: 'Player not found' });
        const pData = await pResp.json();
        
        // Отдаем только то, что нужно: имя, гильдию и ID аватара
        res.json({
            name: pData.data.name,
            guildName: pData.data.guild_name || "Без гильдии",
            portraitId: pData.data.portrait_id || 1
        });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Server is running'));
