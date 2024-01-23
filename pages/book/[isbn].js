// pages/book/[isbn].js

import { useEffect, useState } from 'react';
import Header from "@/components/HeaderSigup";
import Footer from "@/components/Footer";
import { useRouter } from 'next/router';
import Styles from '@/styles/Liviray.module.css';
import styles from '@/styles/BookDetailsPage.module.css'
import Link from 'next/link';

const BookDetailsPage = () => {
  const router = useRouter();
  const { isbn } = router.query;
  const [bookDetails, setBookDetails] = useState(null);

  const getAvailabilityStatus = (availability) => {
    switch (availability) {
      case '1':
        return '在庫あり';
      case '2':
        return '通常3～7日程度で発送';
      case '3':
        return '通常3～9日程度で発送';
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

  const getPostageFlag = (postageFlag) => {
    switch (postageFlag) {
      case 0: 
        return '送料別';
      case 1:
        return '宅配送料無料';
      case 2:
        return '送料無料(コンビニ送料含む)※キャンペーンなどで実際の送料の扱いは、出力内容と異なることがあります';
      default:
        return '不明';
    }
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        if (isbn) {
          const apiKey = process.env.APP_ID;
          const response = await fetch(`https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&isbn=${isbn}&applicationId=${apiKey}`);
          const data = await response.json();

          // Itemsプロパティが存在し、かつ最初のアイテムが存在する場合に詳細情報をセット
          if (data.Items && data.Items.length > 0) {
            setBookDetails(data.Items[0].Item);
          } else {
            console.error('楽天BooksAPIからの詳細情報が見つかりませんでした。', data);
          }
        }
      } catch (error) {
        console.error('楽天BooksAPIからの詳細情報取得中にエラーが発生しました:', error);
      }
    };

    fetchBookDetails();
  }, [isbn]);

  return (
    <div className={Styles.mainContainer}>
      <Header />
      <main>
        {bookDetails ? (
          // 詳細情報を表示する部分
          <div className={styles.bookDetailsContainer}>
          
            <img src={bookDetails.largeImageUrl} alt="本の画像" />
            <h1>{bookDetails.title}</h1>
            <p>著者名: {bookDetails.author}</p>
            <p>価格: {bookDetails.itemPrice}円</p>
            <p>商品説明: {bookDetails.itemCaption}</p>
            <p>在庫確認: {getAvailabilityStatus(bookDetails.availability)}</p>
            <p>出版日: {bookDetails.salesDate}</p>
            <p>送料: {getPostageFlag(bookDetails.postageFlag)}</p>
            <p>ISBN: {bookDetails.isbn}</p>
            <a href={bookDetails.itemUrl} target="_blank" rel="noopener noreferrer">
              詳細・購入
            </a>
            <p>レビュー件数: {bookDetails.reviewCount}</p>
            {/* リンクやプレビューなども必要に応じて表示 */}
          </div>
        ) : (
          // ローディングなどの表示
          <h1 className={styles.nobook}>その本の詳細は現時点では見つかりません！</h1>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BookDetailsPage;