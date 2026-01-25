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
        const cleanCode = req.params.code.replace(/\D/g, '');
        const pResp = await fetch(`https://swgoh.gg/api/player/${cleanCode}/`, { headers: HEADERS });
        
        if (!pResp.ok) return res.status(404).json({ error: 'Player not found' });
        
        const pData = await pResp.json();
        const gId = pData.data.guild_id;

        if (!gId) {
            return res.json({ playerName: pData.data.name, guildName: "Без гильдии", members: 0 });
        }

        const gResp = await fetch(`https://swgoh.gg/api/guild-profile/${gId}/`, { headers: HEADERS });
        const gData = await gResp.json();

        res.json({
            playerName: pData.data.name,
            guildName: gData.data.name,
            members: gData.data.members.length
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Server is running'));
