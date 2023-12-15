// Liviray.js

import { useState, useEffect } from 'react';
import fetchJsonp from 'fetch-jsonp';
import libraries from '../pages/libraries/libraries';
import Styles from '../styles/Liviray.module.css';
import Header from "../components/HeaderSigup";

const Liviray = () => {
  const [keyword, setKeyword] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [selectedSystemId, setSelectedSystemId] = useState('Okinawa_Pref');
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  useEffect(() => {
    if (keyword && searchButtonClicked) {
      searchBooks();
    }
  }, [searchButtonClicked]);

  const searchBooks = async () => {
    try {
      setLoading(true);
      setSearchButtonClicked(false);

      const response = await fetch(`http://localhost:3000/api/search?keyword=${encodeURIComponent(keyword)}&library=${selectedSystemId}`);
      const data = await response.json();

      setBooks(data);

      const availabilityData = await Promise.all(data.map(async (book) => {
        const isbn = book.availability;
        const availabilityResponse = await fetchAvailability(isbn);

        const googleBooksResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(book.title)}&inauthor=${encodeURIComponent(book.authors)}`);
        const googleBooksData = await googleBooksResponse.json();
        const bookDetails = googleBooksData.items ? googleBooksData.items[0] : null;

        return { book, availability: availabilityResponse, details: bookDetails };
      }));

      setAvailability(availabilityData);
    } catch (error) {
      console.error('検索エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async (isbn) => {
    try {
      const response = await fetchJsonp(`https://api.calil.jp/check?appkey=${process.env.NEXT_PUBLIC_CALIL_API_KEY}&isbn=${isbn}&format=json&systemid=${selectedSystemId}`);
      return await response.json();
    } catch (error) {
      console.error('貸出状況の取得エラー:', error);
      return null;
    }
  };

  const getStatusDisplay = (libkey) => {
    if (!libkey || !libkey[selectedSystemId] || !libkey[selectedSystemId].libkey) {
      return '蔵書なし';
    }

    const systemLibkey = libkey[selectedSystemId].libkey;
    const libraryKeys = Array.isArray(systemLibkey) ? systemLibkey : Object.keys(systemLibkey);

    if (libraryKeys.some(libraryKey => systemLibkey[libraryKey] === '貸出中')) {
      return '貸出中';
    } else if (libraryKeys.some(libraryKey => systemLibkey[libraryKey] === '貸出可')) {
      return '貸出可';
    } else if (libraryKeys.some(libraryKey => systemLibkey[libraryKey] === '蔵書あり')) {
      return '蔵書あり';
    } else if (libraryKeys.some(libraryKey => systemLibkey[libraryKey] === '館内のみ')) {
      return '館内のみ';
    } else if (libraryKeys.some(libraryKey => systemLibkey[libraryKey] === '予約中')) {
      return '予約中';
    } else if (libraryKeys.some(libraryKey => systemLibkey[libraryKey] === '準備中')) {
      return '準備中';
    } else if (libraryKeys.some(libraryKey => systemLibkey[libraryKey] === '休館中')) {
      return '休館中';
    } else {
      return '蔵書なし';
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
      setCurrentPage(1); // 新しい検索時にページをリセット
    } else {
      alert('図書館を選択してください');
    }
  };

  const paginate = (array, page_size, page_number) => {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  };

  return (
    <div>
      <Header />
      <main>
      <div className={Styles.container}>
      <h1>図書館で検索</h1>
      <div className={Styles.searchContainer}>
      <select value={selectedSystemId} onChange={(e) => setSelectedSystemId(e.target.value)}>
        {libraries.map((library) => (
          <option key={library.systemid} value={library.systemid}>
            {library.name}
          </option>
        ))}
      </select>
      <div className={Styles.form}>
      <input className={Styles.text}
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleEnterKeyPress}
        placeholder="キーワードを入力"
      />
      </div>
      <button onClick={handleSearchButtonClick}>検索</button>
      </div>

      {loading && (
        <div className="loading-spinner">
          loading...
        </div>
      )}

      {Array.isArray(availability) && availability.length > 0 && !loading && (
        <div>
          {paginate(availability, booksPerPage, currentPage).map((bookData, index) => {
            const book = bookData.book;
            const bookDetails = bookData.details;
            const bookImage = bookDetails?.volumeInfo?.imageLinks?.thumbnail || null;

            return (
              <div key={index}>
                <div className={Styles.image01}>
                {bookImage && <img src={bookImage} alt="本の画像" style={{ maxWidth: '100px', maxHeight: '150px' }} />}
                </div>
                <strong>{book.title}</strong> - {book.authors}
                {bookData.availability && bookData.availability.books && Object.keys(bookData.availability.books).length > 0 ? (
                  <div>
                    <p>貸出状況: {getStatusDisplay(bookData.availability.books[Object.keys(bookData.availability.books)[0]])}</p>
                    {bookData.availability.books[Object.keys(bookData.availability.books)[0]][selectedSystemId]?.reserveurl && (
                      <p>
                        予約URL: <a href={bookData.availability.books[Object.keys(bookData.availability.books)[0]][selectedSystemId]?.reserveurl} target="_blank" rel="noopener noreferrer">
                          <div className={Styles.ss1}>予約はこちら</div></a>
                      </p>
                    )}
                  </div>
                ) : (
                  <p>取り扱いなし</p>
                )}
              </div>
            );
          })}

          {/* ページネーションのリンク */}
          <div className={Styles.pagination}>
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
          </div>
        </div>
      )}
      </div>  
      </main>  
    </div>

  );
};

export default Liviray;