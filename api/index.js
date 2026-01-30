// api/index.js
export default async function handler(req, res) {
    const { allyCode } = req.query;

    if (!allyCode) {
        return res.status(400).json({ error: 'Ally code is required' });
    }

    try {
        const response = await fetch(`https://swgoh.gg/api/player/${allyCode}/`);
        
        if (!response.ok) {
            return res.status(404).json({ error: 'Игрок не найден или API недоступно' });
        }

        const data = await response.json();
        
        // Возвращаем только нужную часть данных
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Ошибка сервера при запросе к SWGOH.gg' });
    }
}
