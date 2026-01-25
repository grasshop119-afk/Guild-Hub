const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());

// --- ВЕСЬ ИНТЕРФЕЙС (HTML/CSS/JS) ---
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Guild Hub - Elite Interface</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-dark: #050b14;
            --accent-blue: #4facfe;
            --swgoh-green-bright: #26b31e;
            --swgoh-green-dark: #0f400b;
            --text-white: #ffffff;
            --border-default: rgba(30, 58, 95, 0.8);
            --input-bg: rgba(5, 13, 22, 0.8);
        }

        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }

        body, html {
            margin: 0; padding: 0; width: 100%; height: 100%;
            font-family: 'Montserrat', sans-serif;
            background-color: var(--bg-dark);
            background-image:
                linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
                radial-gradient(circle at center, #0d1b2a 0%, #050b14 100%);
            background-size: 100% 3px, cover;
            background-attachment: fixed;
            display: flex; justify-content: center; align-items: center;
            color: var(--text-white); overflow: hidden; position: fixed;
        }

        .main-content { text-align: center; width: 90%; max-width: 360px; padding: 20px; }
        .logo { width: 70%; max-width: 240px; margin: 0 auto 25px; display: block; }
        h1 { font-size: clamp(1.2rem, 5vw, 1.4rem); font-weight: 700; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 1.5px; }
        .description { font-size: clamp(0.8rem, 3.5vw, 0.9rem); margin-bottom: 25px; padding: 0 10px; opacity: 0.8; }

        .input-wrapper { position: relative; width: 100%; margin-bottom: 15px; }
        .swgoh-input {
            width: 100%; background-color: var(--input-bg); border: 1px solid var(--border-default);
            border-radius: 8px; padding: 18px 50px 18px 18px; color: #ffffff;
            font-family: 'Montserrat', sans-serif; font-size: clamp(1.1rem, 4vw, 1.2rem);
            outline: none; text-align: center; letter-spacing: 3px;
        }

        .paste-icon {
            position: absolute; right: 15px; top: 50%; transform: translateY(-50%);
            cursor: pointer; fill: rgba(255, 255, 255, 0.4); display: flex; align-items: center; padding: 8px;
        }

        /* Плашка гильдии по стилю ввода */
        .guild-preview {
            display: none; background-color: var(--input-bg); border: 1px solid var(--border-default);
            border-radius: 8px; margin-bottom: 15px; padding: 15px; align-items: center; text-align: left;
            animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

        .guild-icon-box {
            width: 45px; height: 45px; background: rgba(0, 0, 0, 0.3); border-radius: 6px;
            margin-right: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
            border: 1px solid rgba(255,255,255,0.1); background-size: cover;
        }
        .guild-icon-img { width: 100%; height: 100%; object-fit: contain; border-radius: 6px; }
        
        .guild-info-wrapper { display: flex; justify-content: space-between; align-items: center; width: 100%; overflow: hidden; }
        .guild-name-display { 
            font-weight: 700; font-size: 0.95rem; color: var(--accent-blue); 
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 170px; 
        }
        .guild-members-count { font-size: 0.8rem; color: rgba(255,255,255,0.5); font-weight: 400; }

        .submit-btn {
            position: relative; width: 100%; padding: 20px; font-family: 'Montserrat', sans-serif;
            font-weight: 700; text-transform: uppercase; color: rgba(255, 255, 255, 0.3);
            cursor: not-allowed; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05); transition: all 0.3s ease; letter-spacing: 2px;
        }

        .submit-btn.active {
            background: linear-gradient(to top, var(--swgoh-green-bright) 0%, var(--swgoh-green-dark) 100%);
            border: 1px solid #45f53d; color: #ffffff; cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        }

        .glow-line {
            position: absolute; bottom: -1.5px; left: 50%; width: 70%; height: 3px;
            background: radial-gradient(circle, #ffffff 0%, #ffffff 20%, transparent 80%);
            transform: translateX(-50%); opacity: 0; filter: blur(0.5px);
        }
        .submit-btn.active:hover .glow-line { opacity: 1; }

        .tg-login { font-size: 0.85rem; margin-top: 25px; opacity: 0.7; }
        .tg-login a { color: var(--accent-blue); text-decoration: none; font-weight: 700; }
    </style>
</head>
<body>

<div class="main-content">
    <img src="https://i.ibb.co/v4x1hC8n/image.png" alt="Logo" class="logo">
    <h1>Добро пожаловать!</h1>
    <p class="description">Введи свой <b>код союзника</b> для авторизации.</p>

    <div class="input-wrapper">
        <input type="text" id="allyCode" class="swgoh-input" placeholder="000-000-000" maxlength="11" inputmode="numeric">
        <div class="paste-icon" id="pasteBtn">
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/></svg>
        </div>
    </div>

    <div id="guildPreview" class="guild-preview">
        <div id="guildIconBox" class="guild-icon-box">⏳</div>
        <div class="guild-info-wrapper">
            <span id="guildNameDisplay" class="guild-name-display">Поиск...</span>
            <span id="guildMembersCount" class="guild-members-count"></span>
        </div>
    </div>

    <button id="submitBtn" class="submit-btn">Продолжить
        <div class="glow-line"></div>
    </button>

    <div class="tg-login">Есть аккаунт? <a href="#">Войти с Telegram</a></div>
</div>

<script>
    const input = document.getElementById('allyCode');
    const btn = document.getElementById('submitBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const preview = document.getElementById('guildPreview');
    const gName = document.getElementById('guildNameDisplay');
    const gCount = document.getElementById('guildMembersCount');
    const gIcon = document.getElementById('guildIconBox');

    function formatValue(val) {
        let digits = val.replace(/\\D/g, '').substring(0, 9);
        let formatted = "";
        for (let i = 0; i < digits.length; i++) {
            if (i > 0 && i % 3 === 0) formatted += "-";
            formatted += digits[i];
        }
        return formatted;
    }

    async function findGuild(code) {
        preview.style.display = 'flex';
        gName.innerText = 'Поиск...';
        gCount.innerText = '';
        gIcon.innerText = '⏳';
        gIcon.style.backgroundImage = 'none';
        btn.classList.remove('active');

        try {
            const r = await fetch('/api/check/' + code);
            const d = await r.json();
            if (d.error) throw new Error();

            gName.innerText = d.guildName;
            gCount.innerText = d.members + '/50';
            gIcon.innerText = '';
            gIcon.style.backgroundImage = "url('" + d.guildBanner + "')";
            btn.classList.add('active');
        } catch (err) {
            gName.innerText = 'Гильдия не найдена';
            gIcon.innerText = '🤔';
            btn.classList.remove('active');
        }
    }

    input.addEventListener('input', () => {
        input.value = formatValue(input.value);
        let pureDigits = input.value.replace(/\\D/g, '');
        if (pureDigits.length === 9) findGuild(pureDigits);
        else { preview.style.display = 'none'; btn.classList.remove('active'); }
    });

    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            input.value = text;
            input.dispatchEvent(new Event('input'));
        } catch (err) {}
    });
</script>
</body>
</html>
    `);
});

// --- API ЛОГИКА ---
app.get('/api/check/:code', async (req, res) => {
    try {
        const cleanCode = req.params.code.replace(/\D/g, '');
        const response = await fetch(\`https://swgoh.gg/api/player/\${cleanCode}/\`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        if (!response.ok) return res.status(404).json({ error: '404' });
        
        const pData = await response.json();
        const gId = pData.data.guild_id;

        if (!gId) return res.json({ playerName: pData.data.name, guildName: "Без гильдии", members: 0, guildBanner: "" });

        const gResp = await fetch(\`https://swgoh.gg/api/guild-profile/\${gId}/\`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const gData = await gResp.json();

        res.json({
            playerName: pData.data.name,
            guildName: gData.data.name,
            members: gData.data.members.length,
            guildBanner: "https://game-assets.swgoh.gg/tex.guild_avatar_mon_calamari_01.png"
        });
    } catch (e) {
        res.status(500).json({ error: '500' });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Live on ' + PORT));
