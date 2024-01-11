import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/HeaderSigup';
import style from '../styles/search_rakuten.module.css';
import Footer from '@/components/Footer';
import { env } from '@/next.config';
import { auth, firestore, useUser } from '@/hooks/firebase';
import { doc, collection, setDoc, getDoc } from 'firebase/firestore'; 

const RakutenSearch = () => {
  const user = useUser();
  const [searchType, setSearchType] = useState('title');
  const [keyword, setKeyword] = useState('');
  const [publisherName, setPublisherName] = useState('');
  const [genre, setGenre] = useState(''); // 新しく追加
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [outOfStockFlag, setOutOfStockFlag] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showFavoriteButton, setShowFavoriteButton] = useState(true); 
  const [notification, setNotification] = useState(null);

  // ジャンルの選択肢
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
  ];
  useEffect(() => {
    if (user && user.bookmarks) {
      // ユーザーがログインしている場合かつブックマークが存在する場合、お気に入り情報を更新
      setBooks((prevBooks) =>
        prevBooks.map((prevBook) => ({
          ...prevBook,
          isFavorite: user.bookmarks.some(
            (bookmark) => bookmark.title === prevBook.title && bookmark.authors === prevBook.authors
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
  
  const getOutOfStockFlagValue = (flag) => {
    return flag ? '0' : '1';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // デフォルトのフォーム送信を防ぐ
      handleSearch();
    }
  };
  

  const handleSearch = async (page = 1) => {
    try {
      setErrorMessage('');

      if (!keyword.trim() && !publisherName.trim()) {
        setErrorMessage('書籍名または出版社名の入力がありません。');
        return;
      }

      let searchQuery = '';
      if (searchType === 'title') {
        searchQuery = `title=${encodeURIComponent(keyword)}`;
      } else if (searchType === 'publisher') {
        searchQuery = `publisherName=${encodeURIComponent(publisherName)}`;
      }
      const apiKey = env.APP_ID;
      const outOfStockFlagValue = getOutOfStockFlagValue(outOfStockFlag);
      if (genre) {
        searchQuery += `&booksGenreId=${genre}`;
      }
      const response = await axios.get(
        `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&sort=sales&applicationId=${apiKey}&${searchQuery}&page=${page}&outOfStockFlag=${outOfStockFlagValue}`
      );

      setSearchResults(response.data.Items || []);
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error searching books: ', error);
    }
  };

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case '1':
        return { text: '在庫あり', color: 'blue' };
      case '2':
        return { text: '通常３〜７日程度で発送', color: 'blue' };
      case '3':
        return { text: '通常３〜９日程度で発送', color: 'blue' };
      case '4':
        return { text: 'メーカー取り寄せ', color: 'blue' };
      case '5':
        return { text: '予約受付中', color: 'blue' };
      case '6':
        return { text: 'メーカーに在庫確認', color: 'blue' };
      default:
        return { text: '不明', color: 'red' };
    }
  };


  // 通知表示の関数
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
      const bookDocRef = doc(bookmarksCollectionRef, book.Item.isbn); // ここでは楽天APIのISBNを使用

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
    <div className={style.mainContainer}>
      <Header />
      <main>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1 style={{ fontSize: '28px' }}>本の検索</h1>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label>
              <input
                type="radio"
                value="title"
                checked={searchType === 'title'}
                onChange={() => setSearchType('title')}
              />
              書籍名検索
            </label>

            <label>
              <input
                type="radio"
                value="publisher"
                checked={searchType === 'publisher'}
                onChange={() => setSearchType('publisher')}
              />
              出版社名検索
            </label>

            {searchType === 'title' && (
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="書籍名を入力"
                style={{ padding: '12px', fontSize: '18px', width: '40%', marginTop: '10px' }}
              />
            )}

              {searchType === 'publisher' && (
                <>
              <input
              type="text"
              value={publisherName}
              onChange={(e) => setPublisherName(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
                placeholder="出版社名を入力"
            style={{ padding: '12px', fontSize: '18px', width: '40%', marginTop: '10px' }}
            />  
            </>
                  )}      

            <button onClick={() => handleSearch()} className={style.search}>
              検索
            </button>
          </div>
          <label>
            <input
              type="checkbox"
              checked={outOfStockFlag}
              onChange={() => setOutOfStockFlag(!outOfStockFlag)}
            />
            在庫のある商品のみ表示
          </label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} style={{ fontSize: '18px', marginTop: '10px', marginLeft: '10px'}}>
            <option value="">全ジャンル</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          {errorMessage && (
            <p style={{ color: 'red', fontSize: '16px', marginTop: '10px' }}>{errorMessage}</p>
          )}

{searchResults.length === 0 ? (
      <p style={{ fontSize: '18px', marginTop: '10px', marginTop: '150px'}}> <h2>書籍が見つかりませんでした</h2></p>
    ) : (
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: '1px' }}>検索結果</h2>
        {searchResults.map((book, index) => {
                const isFavorite = showFavoriteButton[`${book.Item.title}-${book.Item.author}`];

                return (
                <div
                  key={book.Item.itemCode}
                  style={{
                    width: '37%',
                    margin: '10px',
                    padding: '10px',
                    border: '1px solid #ccc',
                    fontSize: '12px',
                    backgroundColor: '#FFFFEE'
                  }}
                >
                  <h3 style={{ fontSize: '18px' }}>{book.Item.title}</h3>
                  <div className="book">
                    <p style={{ fontSize: '18px' }}>著者: {book.Item.author}</p>
                    <div className="img">
                      <img
                        src={book.Item.largeImageUrl}
                        alt={book.Item.title}
                        style={{ width: '30%' }}
                      />
                    </div>
                    <p style={{ fontSize: '20px', color: 'red', paddingTop: '50px' }}>
                      価格:{book.Item.itemPrice} 円
                    </p>
                    <p
                      style={{
                        fontSize: '18px',
                        color: getAvailabilityText(book.Item.availability).color,
                      }}
                    >
                      <span style={{ color: 'black' }}>在庫状況:</span>{' '}
                      {getAvailabilityText(book.Item.availability).text}
                    </p>
                    <a
                      href={book.Item.itemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '25px', color: 'blue' }}
                    >
                      詳細・購入
                    </a>
                  </div>
                  <div className={style.iine}>
                  {isFavorite ? (
                      <span className={style.displayFavorite}>❤</span>
                  ) : (
                      <a onClick={() => handleFavoriteButtonClick(book)} className={style.heartIcon}>❤</a>
                  )}
                </div>
                </div>
                );
              })}
            </div>
          )}

{searchResults.length > 0 && (
            <div className={style.paginationContainer}>
            <div className={style.paginationStyle} style={{ marginTop: '10px', position: 'relative' }}>
              <button
                onClick={() => handleSearch(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ marginRight: '10px' }}
              >
                前へ
              </button>
              <span style={{ margin: '0 10px', fontSize: '18px' }}>{currentPage}</span>
              <button
                onClick={() => handleSearch(currentPage + 1)}
                disabled={searchResults.length < 30}
                style={{ marginRight: '10px' }}
              >
                次へ
              </button>
              </div>
              <button
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className={style.scrollToTopButton}
    >
      先頭に戻る
    </button>

            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RakutenSearch;
