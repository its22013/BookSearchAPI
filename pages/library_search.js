// Liviray.js

import { useState, useEffect } from 'react';
import fetchJsonp from 'fetch-jsonp';
import libraries from '../pages/libraries/libraries';
import Styles from '../styles/Liviray.module.css';
import Header from "../components/HeaderSigup";
import Image from "next/image";

const Liviray = () => {
  const [keyword, setKeyword] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [selectedSystemId, setSelectedSystemId] = useState('Okinawa_Pref');
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;
  const loadingTimeout = 15000;  // ローディング時間15秒
  const [error, setError] = useState(null);

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

      const response = await fetch(`http://localhost:3000/api/search?keyword=${encodeURIComponent(keyword)}&library=${selectedSystemId}`);
      const data = await response.json();

      setBooks(data);
      setError(null);

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
      setError('検索中にエラーが発生しました');
    } finally {
      // setLoading(false); // ローディングがすぐに非表示になるようにコメントアウト
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
      return <span className={Styles.displayAvailable}>予約中</span>;
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
              <input
                className={Styles.text}
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleEnterKeyPress}
                placeholder="キーワードを入力"
              />
            </div>
            <button onClick={handleSearchButtonClick}><Image src="/images/search.png" alt="Search Image" width={30} height={30}/></button>
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

          {Array.isArray(availability) && availability.length > 0 && !loading && (
            <div>
              {paginate(availability, booksPerPage, currentPage).map((bookData, index) => {
                const book = bookData.book;
                const bookDetails = bookData.details;
                const defaultImageUrl = "/images/images.png";
                const bookImage = bookDetails?.volumeInfo?.imageLinks?.thumbnail || defaultImageUrl;
                const isLongTitle = book.title.length > 20;

                return (
                  <div key={index} className={Styles.results}>
                    <div className={Styles.image01}>
                      <img src={bookImage} alt="本の画像" style={{ maxWidth: '103px', maxHeight: '150px' }} />
                    </div>
                    <strong className={isLongTitle ? `${Styles.bookTitle} ${Styles.breakLine}` : Styles.bookTitle}>{book.title}</strong> - {book.authors}
                    {bookData.availability && bookData.availability.books && Object.keys(bookData.availability.books).length > 0 ? (
                      <div>
                        <div className={Styles.display}>
                          貸出状況: <div className={Styles.space}></div>{getStatusDisplay(bookData.availability.books[Object.keys(bookData.availability.books)[0]])}
                        </div>
                        {bookData.availability.books[Object.keys(bookData.availability.books)[0]][selectedSystemId]?.reserveurl && (
                          <div>
                            <a href={bookData.availability.books[Object.keys(bookData.availability.books)[0]][selectedSystemId]?.reserveurl} target="_blank" rel="noopener noreferrer">
                              <div className={Styles.ss1}>予約はこちら</div>
                            </a>
                          </div>
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
