const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/player/:code', async (req, res) => {
    try {
        const allyCode = req.params.code;
        const url = `https://swgoh.gg/api/player/${allyCode}/`;
        
        const response = await axios.get(url, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://swgoh.gg/'
            },
            timeout: 15000 
        });
        
        res.json(response.data);
    } catch (error) {
        console.error(`Ошибка кода ${req.params.code}:`, error.message);
        res.status(error.response?.status || 500).json({ error: 'Игрок не найден' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
