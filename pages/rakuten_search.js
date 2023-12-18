import { useState } from 'react';
import axios from 'axios';
import Header from '../components/HeaderSigup';
import style from '../styles/search_rakuten.module.css';

const RakutenSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [outOfStockFlag, setOutOfStockFlag] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 新しく追加した関数
  const getOutOfStockFlagValue = (flag) => {
    return flag ? '0' : '1';
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const handleSearch = async () => {
    try {
      setErrorMessage('');

      if (!keyword.trim()) {
        setErrorMessage('入力がありません。');
        return;
      }

      // getOutOfStockFlagValue 関数を使用して URL パラメータを設定
      const outOfStockFlagValue = getOutOfStockFlagValue(outOfStockFlag);
      const response = await axios.get(`https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&sort=sales&applicationId=1058786829737523251&title=${encodeURIComponent(keyword)}&page=${currentPage}&outOfStockFlag=${outOfStockFlagValue}`);
      setSearchResults(response.data.Items || []);
      setCurrentPage(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error searching books: ', error);
    }
  };

  // 在庫状況に対応する文言を返す関数
  const getAvailabilityText = (availability) => {
    switch (availability) {
      case '1':
        return '在庫あり';
      case '2':
        return '通常３〜７日程度で発送';
      case '3':
        return '通常３〜９日程度で発送';
      case '4':
        return 'メーカー取り寄せ';
      case '5':
        return '予約受付中';
      case '6':
        return 'メーカーに在庫確認';
      default:
        return '不明';
    }
  };

  return (
    <div>
      <Header />
      <main>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1 style={{ fontSize: '28px' }}>本の検索</h1>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="キーワードを入力"
              style={{ padding: '12px', fontSize: '18px', width: '40%' }}
            />
            <label style={{ marginTop: '10px' }}>
              <input
                type="checkbox"
                checked={outOfStockFlag}
                onChange={() => setOutOfStockFlag(!outOfStockFlag)}
              />
              在庫のない商品を表示しない
            </label>
            <button onClick={handleSearch} className={style.search}>検索</button>
          </div>

          {errorMessage && (
            <p style={{ color: 'red', fontSize: '16px', marginTop: '10px' }}>{errorMessage}</p>
          )}

          {searchResults.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1px' }}>検索結果</h2>
              {searchResults.map((book, index) => (
                <div key={book.Item.itemCode} style={{ width: '37%', margin: '10px', padding: '10px', border: '1px solid #ccc', fontSize: '12px' }}>
                  <h3 style={{ fontSize: '18px' }}>{book.Item.title}</h3>
                  <div className='book'>
                    <p style={{ fontSize: '18px' }}>著者: {book.Item.author}</p>
                    <div className='img'>
                      <img src={book.Item.largeImageUrl} alt={book.Item.title} style={{ width: '30%' }} />
                    </div>
                    <p style={{ fontSize: '20px', color:'red' }}>価格:{book.Item.itemPrice} 円</p>
                    <p style={{ fontSize: '18px' }}>在庫状況: {getAvailabilityText(book.Item.availability)}</p>
                    {/* 購入ページへのリンク */}
                    <a href={book.Item.itemUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'blue'}}>
                      詳細・購入
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ページネーション */}
          {searchResults.length > 0 && (
            <div className={style.paginationStyle}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                前へ
              </button>
              <span style={{ margin: '0 10px', fontSize: '18px' }}>{currentPage}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={searchResults.length < 30}
              >
                次へ
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RakutenSearch;

