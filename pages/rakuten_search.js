import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/HeaderSigup';
import style from '../styles/search_rakuten.module.css';
import Footer from '@/components/Footer';

const RakutenSearch = () => {
  const [searchType, setSearchType] = useState('title');
  const [keyword, setKeyword] = useState('');
  const [publisherName, setPublisherName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [outOfStockFlag, setOutOfStockFlag] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
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

      const outOfStockFlagValue = getOutOfStockFlagValue(outOfStockFlag);

      const response = await axios.get(
        `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&sort=sales&applicationId=1058786829737523251&${searchQuery}&page=${page}&outOfStockFlag=${outOfStockFlagValue}`
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

          {errorMessage && (
            <p style={{ color: 'red', fontSize: '16px', marginTop: '10px' }}>{errorMessage}</p>
          )}

          {searchResults.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1px' }}>検索結果</h2>
              {searchResults.map((book, index) => (
                <div
                  key={book.Item.itemCode}
                  style={{
                    width: '37%',
                    margin: '10px',
                    padding: '10px',
                    border: '1px solid #ccc',
                    fontSize: '12px',
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
                    <p style={{ fontSize: '20px', color: 'red' }}>
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
                      style={{ fontSize: '12px', color: 'blue' }}
                    >
                      詳細・購入
                    </a>
                  </div>
                </div>
              ))}
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

