// pages/mypage.js
import { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';
import Header from "../components/HeaderSigup";
import Styles from "../styles/Home.module.css";
import Footer from "@/components/Footer";
import styles from "../styles/MyPage.module.css";
import Image from "next/image";
import { useUser, useAuth } from "../hooks/firebase";  
import Breadcrumbs from '../components/Breadcrumbs';

export default function MyPage() {
  const currentUser = useUser();
  const router = useRouter();
  const auth = useAuth();
  const [uniqueRecentlyViewedBooks, setUniqueRecentlyViewedBooks] = useState([]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('ログアウトしました');
      await router.replace('/');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const breadcrumbs = [
    { label: 'トップ', path: '/' },
    { label: 'マイページ', path: '/mypage' },
  ];

  const RAKUTEN_APP_ID = process.env.APP_ID; 

  const fetchBookInfo = async (isbn) => {
    try {
      const response = await fetch(`https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&isbn=${isbn}&applicationId=${RAKUTEN_APP_ID}`);
      const data = await response.json();

      if (data && data.Items && data.Items.length > 0) {
        const bookInfo = data.Items[0].Item;
        return {
          title: bookInfo.title,
          imageUrl: bookInfo.largeImageUrl,
          author: bookInfo.author, 
          salesDate: bookInfo.salesDate
        };
      }
    } catch (error) {
      console.error('楽天APIエラー:', error);
    }
    return null;
  };

  useEffect(() => {
    const recentlyViewedBooks = JSON.parse(localStorage.getItem('recentlyViewedBooks')) || [];
    const uniqueBooks = Array.from(new Set(recentlyViewedBooks.map(book => book.isbn)))
      .map(async (isbn) => {
        const bookInfo = await fetchBookInfo(isbn);
        return { ...bookInfo, isbn };
      })
      .slice(0, 5);

    Promise.all(uniqueBooks).then((books) => setUniqueRecentlyViewedBooks(books.filter(Boolean)));
  }, []);


  return (
    <div className={Styles.mainContainer}>
      <Header />
      <main>
        <Breadcrumbs crumbs={breadcrumbs} />
        <div className={styles.secondContainer}>  
          <h1 className={styles.h1}>MY PAGE</h1>
          <div className={styles.box1}>
            {currentUser && currentUser.displayName && (
              <a>{currentUser.displayName || 'マイページ'} さん ようこそ！</a>
            )}
          </div>

          <div className={styles.menuAndNotification}>
            <div className={styles.menuContainer}>
              {/* お気に入りリストへのリンク */}
              <Link legacyBehavior href="/mypage/liked_book">
                <h3 className={styles.menuItem}>
                  <a>お気に入りリスト</a>
                </h3>
              </Link>

              {/* パスワード確認・変更へのリク */}
              <Link legacyBehavior href="/mypage/edit">
                <h3 className={styles.menuItem}>
                  <a>パスワード確認・変更</a>
                </h3>
              </Link>

              {/* ログアウト */}
              <h3 className={styles.menuItem}>
                <a onClick={handleLogout} className={styles.logout}>ログアウト</a>
              </h3>

              <div className={styles.space}>
                <Image
                  src="/images/kohacu.png"
                  alt="Ranking Image"
                  width={100}
                  height={100}
                />
              </div>
              
            </div>
            <div className={styles.notification01}>
              <div className={styles.menuItem01}>
                <h3 className={styles.additionalInfo}>最近見た本</h3>
              </div>
              <ul className={styles.recentlyViewedList}>
                {uniqueRecentlyViewedBooks.map((book, index) => (
                  <div key={index} className={styles.FavoriteBooksContainer}>
                    <div className={Styles.FavoriteBooksContainer}>
                      <Link legacyBehavior href={`/book/${book.isbn}`}>
                        <a>
                          <div className={styles.bookInfo}>
                            <Image
                              src={book.imageUrl}
                              alt={book.title}
                              width={110}
                              height={160}
                            />
                            <div className={styles.bookDetails}>
                              <p className={styles.bookTitle}>{book.title}</p>
                              <p className={styles.bookAuthor}>著者: {book.author}</p>
                              <p className={styles.bookSalesDate}>出版日: {book.salesDate}</p>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
            {/* お知らせの表示は省略 */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}