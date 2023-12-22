// RankingPage.js

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Ranking.module.css';
import Header from '../components/HeaderSigup';
import Footer from '../components/Footer';

const RankingPage = () => {
  const [rankings, setRankings] = useState([]);
  const [sortOption, setSortOption] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const apiKey = process.env.APP_ID;
        let apiUrl = `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&applicationId=${apiKey}&hits=20`;

        // ソートが指定されている場合は追加
        if (sortOption) {
          apiUrl += `&sort=${sortOption}`;
        }

        const response = await axios.get(apiUrl);

        setRankings(response.data.Items || []);
      } catch (error) {
        console.error('Error fetching rankings: ', error);
      }
    };

    fetchRankings();
  }, [sortOption]);

  const handleSort = (sortOption) => {
    // ソートオプションを設定し、再取得
    setSortOption(sortOption);
  };

  return (
    <div>
      <Header />
      <main>
        <div className={styles.container}>
          <h1>今日の人気TOP20</h1>

          {/* ラジオボタン */}
          <div className={styles.radioGroup}>     
          <label>      
            </label>
            <label>
              <input
                type="radio"
                checked={sortOption === '-itemPrice'}
                onChange={() => handleSort('-itemPrice')}
              />
              価格の高い順
            </label>
            <label>
              <input
                type="radio"
                checked={sortOption === '+itemPrice'}
                onChange={() => handleSort('+itemPrice')}
              />
              価格が安い順
            </label>
            <label>
              <input
                type="radio"
                checked={sortOption === 'reviewAverage'}
                onChange={() => handleSort('reviewAverage')}
              />
              評価順
            </label>
          </div>

          {rankings.length > 0 ? (
            <ul>
              {rankings.map((book, index) => (
                <li key={book.Item.itemCode} className={styles.listItem}>
                  <div className={styles.rank}>{index + 1} 位</div>
                  <div className={styles.content}>
                    <span className={styles.title}><h3>{book.Item.title}</h3></span>
                    <img width="180"
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
      <Footer />
    </div>
  );
};

export default RankingPage;
