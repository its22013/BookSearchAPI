import { useState, useEffect } from 'react';
import axios from 'axios';

const RankingPage = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;

        // sort パラメータに sales を指定して売れている順にランキングを取得
        const response = await axios.get(
          `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&sort=sales&applicationId=${apiKey}&hits=20`
        );

        setRankings(response.data.Items || []);
      } catch (error) {
        console.error('Error fetching rankings: ', error);
      }
    };

    fetchRankings();
  }, []);

  return (
    <div>
      <h1>ランキングページ</h1>
      {rankings.length > 0 ? (
        <ul>
          {rankings.map((book, index) => (
            <li key={book.Item.itemCode}>
              {index + 1}. {book.Item.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>ランキング情報がありません。</p>
      )}
    </div>
  );
};

export default RankingPage;
