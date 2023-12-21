import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Ranking.module.css';
import Header from '../components/HeaderSigup';

const RankingPage = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const apiKey = process.env.APP_ID;

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
      <Header />
      <main>
        <div className={styles.container}>
          <h1>月間売上ランキング</h1>
          {rankings.length > 0 ? (
            <ul>
              {rankings.map((book, index) => (
                <li key={book.Item.itemCode} className={styles.listItem}>
                  <div className={styles.rank}>{index + 1} 位</div>
                  <div className={styles.content}>
                    <span className={styles.title}>{book.Item.title}</span>
                    <img
                      src={book.Item.mediumImageUrl}
                      alt={book.Item.title}
                    />
                  </div>
                  <p className={styles.p}>
                    <Link legacyBehavior href={book.Item.itemUrl}>
                      <a target="_blank" rel="noopener noreferrer">詳細・購入</a>
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>ランキング情報がありません。</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default RankingPage;
