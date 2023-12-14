// pages/api/calil/[isbn].js

import axios from 'axios';

export default async function handler(req, res) {
  const { isbn, systemid } = req.query;

  try {
    if (!systemid) {
      // systemid が指定されていない場合はエラーを返す
      return res.status(400).json({ error: 'systemid パラメーターが必要です。' });
    }

    const calilResponse = await axios.get('https://api.calil.jp/check', {
      params: {
        appkey: process.env.NEXT_PUBLIC_CALIL_API_KEY,
        isbn,
        systemid,
        format: 'json',
      },
    });

    const bookData = calilResponse.data[isbn];

    if (bookData) {
      const libraryData = bookData.map((library) => {
        const systemid = library.systemid;
        const status = library.status;
        const reserveUrl = library.reserveurl;
        const libkey = library.libkey;
        return { systemid, status, reserveUrl, libkey };
      });

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).json({ libraryData });
    } else {
      console.error('図書館データが見つかりませんでした。');
      res.status(404).json({ error: '図書館データが見つかりませんでした。' });
    }
  } catch (error) {
    console.error('図書館データの取得エラー:', error);
    res.status(500).json({ error: 'サーバーエラー' });
  }
}
