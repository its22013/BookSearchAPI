// RankingPage.js

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Ranking.module.css';
import Header from '../components/HeaderSigup';
import Footer from '../components/Footer';
import { auth, firestore, useUser } from '@/hooks/firebase';
import { doc, collection, setDoc, getDoc } from 'firebase/firestore'; 
import { generateEtags } from '@/next.config';

const genres = [
  { id: '001004', name: '小説' },
  { id: '001017', name: 'ライトノベル' },
  { id: '001021', name: 'BL(ボーイズラブ)' },
  { id: '001029', name: 'ティーンズラブ' },
  { id: '001001', name: '漫画' },
  { id: '001013', name: '写真集・タレント' },
  { id: '001011', name: 'エンタメ・ゲーム' },
  { id: '001009', name: '美術・スポーツ' },
  { id: '001028', name: '医学・薬学' },
  { id: '001010', name: '健康・美容' },
  { id: '001005', name: 'パソコン・技術書'},
  { id: '001008', name: '人文・思想'},
  { id: '001016', name: '資格・検定'},
  { id: '001003', name: '絵本・図鑑'}
];

const RankingPage = () => {
  const [rankings, setRankings] = useState([]);
  const [sortOption, setSortOption] = useState('standard');
  const [errorMessage, setErrorMessage] = useState('');
  const [showFavoriteButton, setShowFavoriteButton] = useState(true);
  const [notification, setNotification] = useState(null);
  const [userBooks, setUserBooks] = useState([]); // ユーザーのお気に入り本のステート
  const [genre, setGenre] = useState('');
  const user = useUser();

  const handleGenreChange = () => {
    // ジャンルが選択されたらページを再読み込み
    window.location.reload();
  };

  useEffect(() => {
    // ジャンルが選択されたときに再読み込みされるように
    window.addEventListener('beforeunload', handleGenreChange);

    return () => {
      // コンポーネントがアンマウントされるときにイベントリスナーを削除
      window.removeEventListener('beforeunload', handleGenreChange);
    };
  }, []); // 空の依存リストで初回のみ実行されるように

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const apiKey = process.env.APP_ID;
        let apiUrl = `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&applicationId=${apiKey}&hits=20`;

        // ジャンルが選択された場合、クエリに追加
        if (genre) {
          apiUrl += `&booksGenreId=${genre}`;
        }

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
  }, [sortOption, genre]); // genreを追加

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
          alert("この本は既にお気に入りに追加されています");
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
          <h1>{genre ? `今日の${genres.find(g => g.id === genre)?.name} TOP20` : '今日の人気TOP20'}</h1>
          <div>
            <select value={genre} onChange={(e) => setGenre(e.target.value)} style={{ fontSize: '18px', marginTop: '10px', marginLeft: '10px'}}>
              <option value="">全ジャンル</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
          {rankings.length > 0 ? (
            <ul>
              {rankings.map((book, index) => {
                const isFavorite = showFavoriteButton[`${book.Item.title}-${book.Item.author}`];
                return (
                  <li key={book.Item.itemCode} className={styles.listItem}>
                     <div className={styles.rank}>{index + 1} 位</div>
                    
                    <div className={styles.content}>
                      <span className={styles.title}>
                      <Link legacyBehavior href={`/book/${encodeURIComponent(book.Item.isbn)}`}>
                      <a><h3>{book.Item.title}</h3></a></Link>
                      <Link legacyBehavior href={`/book/${encodeURIComponent(book.Item.isbn)}`}>
                      <a> <p style={{ fontSize: '15px' }}>出版日: {book.Item.salesDate}</p></a></Link></span>
                     
                      <Link legacyBehavior href={`/book/${encodeURIComponent(book.Item.isbn)}`}>
                      <a>
                      <img width="180" src={book.Item.largeImageUrl} alt={book.Item.title} />
                      </a>
                    </Link>
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