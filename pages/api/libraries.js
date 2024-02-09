// pages/api/libraries.js

export default async function handler(req, res) {
  const { latitude, longitude } = req.query;

  try {
    const response = await fetch(`https://api.calil.jp/library?appkey=${process.env.NEXT_PUBLIC_CALIL_API_KEY}&geocode=${latitude},${longitude}&limit=5`);
    const data = await response.json();
    res.status(200).json(data); // ここで正しいJSON形式でレスポンスを返す
  } catch (error) {
    console.error('Error fetching nearby libraries:', error);
    res.status(500).json({ error: 'Error fetching nearby libraries' });
  }
}
  