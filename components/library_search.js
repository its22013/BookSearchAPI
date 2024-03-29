// Componets/library_search.js

import { useState, useEffect } from 'react';
import fetchJsonp from 'fetch-jsonp';
import { LibrariesData } from '../pages/libraries/libraries';
import Styles from '@/styles/Liviray.module.css';
import Image from "next/image";
import { auth, firestore, useUser } from '@/hooks/firebase';
import { doc, collection, setDoc, getDoc } from 'firebase/firestore'; 
import Link from 'next/link';

const Liviray = () => {
  const user = useUser();
  const [keyword, setKeyword] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [selectedSystemId, setSelectedSystemId] = useState('Okinawa_Pref');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;
  const loadingTimeout = 15000;
  const [error, setError] = useState(null);
  const [showFavoriteButton, setShowFavoriteButton] = useState(true); 
  const [notification, setNotification] = useState(null);
  const getSelectedLibraryName = () => {
    const selectedLibrary = LibrariesData.find(library => library.systemid === selectedSystemId);
    return selectedLibrary ? selectedLibrary.name : '';
  };
  

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

  useEffect(() => {
    let timer;

    if (loading) {
      timer = setTimeout(() => {
        setLoading(false);
      }, loadingTimeout);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [loading]);

  useEffect(() => {
    if (searchButtonClicked) {
      searchBooks();
    }
  }, [searchButtonClicked]);

  const searchBooks = async () => {
    try {
      setLoading(true);
      setSearchButtonClicked(false);
  
      if (!keyword) { 
        setBooks([]);
        setAvailability([]);
        setLoading(false);
        setError('検索キーワードを入力してください');
        return;
      }

      // リクエストを送信する前に1秒待機
      await new Promise(resolve => setTimeout(resolve, 5000));
  
      const response = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}&library=${selectedSystemId}`);
      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error('検索エラー: レスポンスが配列ではありません');
        setError('検索中にエラーが発生しました');
        setLoading(false);
        return;
      }
  
      setBooks(data);
      setError(null);  
        
      const availabilityData = await Promise.all(data.map(async (book) => {
        const isbn = book.availability;
        const availabilityResponse = await fetchAvailabilityWithRetry(isbn);
  
        const googleBooksResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(book.title)}&inauthor=${encodeURIComponent(book.authors)}`);
        const googleBooksData = await googleBooksResponse.json();
        const bookDetails = googleBooksData.items ? googleBooksData.items[0] : null;
  
        return { book, availability: availabilityResponse, details: bookDetails };
      }));
  
      setAvailability(availabilityData);
    } catch (error) {
      console.error('検索エラー:', error);
      setError('検索中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAvailabilityWithRetry = async (isbn, retryCount = 3) => {
    try {
      let response;
      let availabilityData;
  
      for (let i = 0; i < retryCount; i++) {
        response = await fetchJsonp(`https://api.calil.jp/check?appkey=${process.env.NEXT_PUBLIC_CALIL_API_KEY}&isbn=${isbn}&format=json&systemid=${selectedSystemId}`);
        availabilityData = await response.json();
  
        if (availabilityData && Object.keys(availabilityData.books).length > 0) {
          // データが取得できたらループを抜ける
          break;
        } else {
          // データが取得できなかった場合、指数バックオフでリトライ
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
      }
  
      return availabilityData;
    } catch (error) {
      console.error('貸出状況の取得エラー:', error);
      return null;
    }
  };
  
  
  
  const getStatusDisplay = (libkey) => {
    if (!libkey || !libkey[selectedSystemId] || !libkey[selectedSystemId].libkey) {
      return <span className={Styles.displayNotAvailable}>蔵書なし</span>;
    }
  
    const systemLibkey = libkey[selectedSystemId].libkey;
    const libraryKeys = Array.isArray(systemLibkey) ? systemLibkey : Object.keys(systemLibkey);
  
    if (libraryKeys.some(libraryKey => systemLibkey[libraryKey] === '貸出中')) {
      return <span className={Styles.displayLoaned}>貸出中</span>;
    } else if (libraryKeys.some(libraryKey => systemLibkey[libraryKey] === '貸出可')) {
      return <span className={Styles.displayAvailable}>貸出可</span>;
    } else if (libraryKeys.some(libraryKey => systemLibkey[libraryKey] === '蔵書あり')) {
      return <span className={Styles.displayAvailable}>蔵書あり</span>;
    } else if (libraryKeys.some(libraryKey => systemLibkey[libraryKey] === '館内のみ')) {
      return <span className={Styles.displayAvailable}>館内のみ</span>;
    } else if (libraryKeys.some(libraryKey => systemLibkey[libraryKey] === '予約中')) {
      const reserveUrl = systemLibkey[libraryKeys.find(libraryKey => systemLibkey[libraryKey] === '予約中')][selectedSystemId]?.reserveurl;
      return (
        <div className={Styles.display}>
          <span className={Styles.displayAvailable}>予約中</span>
          {reserveUrl && (
            <a href={reserveUrl} target="_blank" rel="noopener noreferrer">
              <div className={Styles.ss1}>予約はこちら</div>
            </a>
          )}
        </div>
      );
    } else if (libraryKeys.some(libraryKey => systemLibkey[libraryKey] === '準備中')) {
      return <span className={Styles.displayAvailable}>準備中</span>;
    } else if (libraryKeys.some(libraryKey => systemLibkey[libraryKey] === '休館中')) {
      return <span className={Styles.displayAvailable}>休館中</span>;
    } else {
      return <span className={Styles.displayNotAvailable}>蔵書なし</span>;
    }
  };  

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchButtonClick();
    }
  };

  const handleSearchButtonClick = () => {
    if (selectedSystemId) {
      setSearchButtonClicked(true);
      setCurrentPage(1);
    } else {
      setError('図書館を選択してください');
    }
  };

  const handleNextButtonClick = () => {
    if (currentPage < Math.ceil(availability.length / booksPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevButtonClick = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const paginate = (array, page_size, page_number) => {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
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
      const googleBooksResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(book.title)}&inauthor=${encodeURIComponent(book.authors)}`);
      const googleBooksData = await googleBooksResponse.json();
      const bookDetails = googleBooksData.items ? googleBooksData.items[0] : null;

      const isbn = bookDetails?.volumeInfo?.industryIdentifiers?.find(identifier => identifier.type === 'ISBN_13' || identifier.type === 'ISBN_10')?.identifier;

      if (!isbn) {
        console.error('ISBNが取得できませんでした');
        alert("その本はお気に入りできません")
        return;
      }

      const userDocRef = doc(firestore, 'users', user.uid);
      const bookmarksCollectionRef = collection(userDocRef, 'bookmarks');
      const bookDocRef = doc(bookmarksCollectionRef, isbn);  // ISBNをドキュメントIDとして使用

      const bookData = {
        title: book.title,
        authors: book.authors,
        image: bookDetails?.volumeInfo?.imageLinks?.thumbnail || '',
        timestamp: new Date().toISOString(),
        isbn: isbn,
      };

      const formattedTimestamp = formatTimestamp(bookData.timestamp);
      bookData.formattedTimestamp = formattedTimestamp;

      const existingDoc = await getDoc(bookDocRef);

      if (!existingDoc.exists()) {
        await setDoc(bookDocRef, bookData);
        console.log('お気に入りに追加しました');
        alert("お気に入りに追加しました")
        // ボタンを非表示にするためのステートを更新
        setShowFavoriteButton((prevStatus) => ({ ...prevStatus, [`${book.title}-${book.authors}`]: true }));
      } else {
        console.log('この本は既にお気に入りに追加されています');
        alert("この本は既にお気に入りに追加されています")
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
      <main>
        <div className={Styles.container}>
          <h1 className={Styles.h1}>{getSelectedLibraryName()}で検索</h1>
          <div className={Styles.searchContainer}>

          <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className={Styles.form01}>
            <optgroup label="地域を選択"></optgroup>
            <option value="" className={Styles.sentaku}>地域を選択</option>
            <option value="北部">北部</option>
            <option value="中部">中部</option>
            <option value="南部">南部</option>
            <option value="離島">離島エリア</option>
            <option value="大学">大学</option>
          </select>
          {/* 図書館を地域でフィルタリング */}
          <select value={selectedSystemId} onChange={(e) => setSelectedSystemId(e.target.value)} className={Styles.form01}>
            <optgroup label="図書館を選択">
              {/* デフォルトの選択肢を追加 */}
              <option value="" className={Styles.sentaku}>選択してください</option>
            </optgroup>
            {/* selectedRegion が空でない場合のみフィルタリング */}
            {selectedRegion && LibrariesData.filter(library => library.region === selectedRegion).map((library) => (
              <option key={library.systemid} value={library.systemid}>
                {library.name}
              </option>
            ))}
          </select>

            
            <div className={Styles.form}>
              <input
                className={Styles.text}
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleEnterKeyPress}
                placeholder="キーワードを入力"
              />
            </div>
            <div className={Styles.button02}>
            <button onClick={handleSearchButtonClick}><Image src="/images/search.png" alt="Search Image" width={34} height={34} className={Styles.button}/></button>
            </div>
          </div>

          {(loading || searchButtonClicked) && (
            <div className={Styles.loadingContainer}>
              <div className={Styles.loadingSpinner}>
                検索中
                <div className={Styles.dot}></div>
                <div className={Styles.dot}></div>
                <div className={Styles.dot}></div>
              </div>
            </div>
          )}

          {error && (
            <div className={Styles.errorContainer}>
              {error}
            </div>
          )}

        {notification && (
          <div className={Styles.notification}>
            {notification}
          </div>
        )}

        {Array.isArray(availability) && availability.length > 0 && !loading && (
        <div>
          {paginate(availability, booksPerPage, currentPage).map((bookData, index) => {
            const book = bookData.book;
            const bookDetails = bookData.details;
            const defaultImageUrl = "/images/images.png";
            const bookImage = bookDetails?.volumeInfo?.imageLinks?.thumbnail || defaultImageUrl;
            const isLongTitle = book.title.length > 20;
            

            const isFavorite = showFavoriteButton[`${book.title}-${book.authors}`];

            return (
              <div key={index} className={Styles.results}>
                <Link legacyBehavior href="/book/[bookId]" as={`/book/${book.id}`}>
                <div className={Styles.image01}>
                  <img src={bookImage} alt="本の画像" style={{ maxWidth: '103px', maxHeight: '150px' }} />
                </div>
                </Link>
               <div className={Styles.title92}>
                <strong className={isLongTitle ? `${Styles.bookTitle} ${Styles.breakLine}` : Styles.bookTitle}>{book.title}</strong> - {book.authors}
              </div>
                {bookData.availability && bookData.availability.books && Object.keys(bookData.availability.books).length > 0 ? (
                  <div className={Styles.display}>
                    貸出状況: <div className={Styles.space}></div>{getStatusDisplay(bookData.availability.books[Object.keys(bookData.availability.books)[0]])}
                    {getStatusDisplay(bookData.availability.books[Object.keys(bookData.availability.books)[0]]) !== '蔵書なし' && (
                      <a href={bookData.availability.books[Object.keys(bookData.availability.books)[0]][selectedSystemId]?.reserveurl} target="_blank" rel="noopener noreferrer">
                        <div className={Styles.ss1}>予約はこちら</div>
                      </a>
                    )}
                    {showFavoriteButton && !isFavorite && (
                      <a onClick={() => handleFavoriteButtonClick(book)} className={Styles.heartIcon}>
                        ❤
                      </a>
                    )}
                    {isFavorite && (
                      <span className={Styles.displayFavorite}>
                        ❤
                      </span>
                    )}
                  </div>
                ) : (
                  <p className={Styles.display}>取り扱いなし</p>
                )}
              </div>
            );
          })}

              <div className={Styles.pagination}>
                <button onClick={handlePrevButtonClick}>前へ</button>
                {[...Array(Math.ceil(availability.length / booksPerPage))].map((_, index) => (
                  <span
                    key={index}
                    className={index + 1 === currentPage ? `${Styles.currentPage} ${Styles.page}` : Styles.page}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                    {index + 1 < Math.ceil(availability.length / booksPerPage) && '\u00A0'}
                  </span>
                ))}
                <button onClick={handleNextButtonClick}>次へ</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Liviray;