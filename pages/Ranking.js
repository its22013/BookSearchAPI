// RankingPage.js

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Ranking.module.css';
import Header from '../components/HeaderSigup';
import Footer from '../components/Footer';
import { auth, firestore, useUser } from '@/hooks/firebase';
import { doc, collection, setDoc, getDoc } from 'firebase/firestore'; 

const RankingPage = () => {
  const [rankings, setRankings] = useState([]);
  const [sortOption, setSortOption] = useState('standard');
  const [errorMessage, setErrorMessage] = useState('');
  const [showFavoriteButton, setShowFavoriteButton] = useState(true);
  const [notification, setNotification] = useState(null);
  const [userBooks, setUserBooks] = useState([]); // 追加: ユーザーのお気に入り本のステート

  const user = useUser();

  useEffect(() => {
    if (user && user.bookmarks) {
      // ユーザーがログインしている場合かつブックマークが存在する場合、お気に入り情報を更新
      setUserBooks((prevBooks) =>
        prevBooks.map((prevBook) => ({
          ...prevBook,
          isFavorite: user.bookmarks.some(
            (bookmark) =>
              bookmark.title === prevBook.title && bookmark.authors === prevBook.authors
          ),
        }))
      );

      // 各本ごとのお気に入りステータスを更新
      const favoriteStatusMap = {};
      user.bookmarks.forEach((bookmark) => {
        favoriteStatusMap[`${bookmark.title}-${bookmark.authors}`] = true;
      });
      setShowFavoriteButton(favoriteStatusMap);
    }
  }, [user, showFavoriteButton]);

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

  const showNotification = (message) => {
    setNotification(message);
    // 3秒後に通知を非表示にする
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  

  const handleFavoriteButtonClick = async (book) => {
    try {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const bookmarksCollectionRef = collection(userDocRef, 'bookmarks');
        const bookDocRef = doc(bookmarksCollectionRef, book.Item.isbn || '');

  
        const bookData = {
          title: book.Item.title,
          authors: book.Item.author,
          image: book.Item.largeImageUrl,
          timestamp: new Date().toISOString(),
        };
  
        const formattedTimestamp = formatTimestamp(bookData.timestamp);
        bookData.formattedTimestamp = formattedTimestamp;
  
        const existingDoc = await getDoc(bookDocRef);
  
        if (!existingDoc.exists()) {
          await setDoc(bookDocRef, bookData);
          console.log('お気に入りに追加しました');
  
          // お気に入り追加の通知を表示
          showNotification('お気に入りに追加しました');
          
          // お気に入りボタンの状態を更新
          setShowFavoriteButton((prevStatus) => ({ ...prevStatus, [`${book.Item.title}-${book.Item.author}`]: true }));
        } else {
          console.log('この本は既にお気に入りに追加されています');
        }
      } else {
        console.log('ログインしていません');
      }
    } catch (error) {
      console.error('お気に入り追加エラー:', error);
    }
  };
  
  
    const formatTimestamp = (timestamp) => {
      const dateObject = new Date(timestamp);
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Tokyo', // タイムゾーンを日本時間に設定
      };
    
      return new Intl.DateTimeFormat('ja-JP', options).format(dateObject).replace(/年|月/g, '-').replace(/日/g, ' ');
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
              <input
                type="radio"
                checked={sortOption === 'standard'}
                onChange={() => handleSort('standard')}
              />
              人気順
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
            {rankings.map((book, index) => {
  const isFavorite = showFavoriteButton[`${book.Item.title}-${book.Item.author}`];
  return (
    <li key={book.Item.itemCode} className={styles.listItem}>
      <div className={styles.rank}>{index + 1} 位</div>
      <div className={styles.content}>
        <span className={styles.title}><h3>{book.Item.title}</h3></span>
        <img width="180" src={book.Item.mediumImageUrl} alt={book.Item.title} />
      </div>
      <p className={styles.p}>
        <Link legacyBehavior href={book.Item.itemUrl}>
          <a target="_blank" rel="noopener noreferrer">詳細・購入</a>
        </Link>
      </p>
      <div className={styles.iine}>
        {isFavorite ? (
          <span className={styles.displayFavorite}>❤</span>
        ) : (
          <a onClick={() => handleFavoriteButtonClick(book)} className={styles.heartIcon}>❤</a>
        )}
      </div>
    </li>
  );
})}
 
            
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
