export default async function handler(req, res) {
    // Разрешаем запросы с любого домена
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { url } = req.query;
    if (!url) return res.status(400).send('Missing URL');

    try {
        const response = await fetch(decodeURIComponent(url), {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json"
            }
        });

        if (!response.ok) throw new Error('SWGOH Error');
        const data = await response.json();
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
