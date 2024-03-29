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
import { getFirestore, collection, doc, getDocs } from 'firebase/firestore';

export default function MyPage() {
  const currentUser = useUser();
  const router = useRouter();
  const auth = useAuth();
  const [uniqueRecentlyViewedBooks, setUniqueRecentlyViewedBooks] = useState([]);
  const firestoreDB = getFirestore();

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

  useEffect(() => {
    const fetchRecentlyViewedBooks = async () => {
      try {
        if (currentUser) {
          const userId = currentUser.uid;
          const userDocRef = doc(firestoreDB, 'users', userId);
          const recentlyViewedRef = collection(userDocRef, 'recently_viewed');
          const snapshot = await getDocs(recentlyViewedRef);
          const recentlyViewedBooks = snapshot.docs.map(doc => doc.data());


          // 日付で降順にソートして最新の3件を取得
          const sortedRecentlyViewedBooks = recentlyViewedBooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
          setUniqueRecentlyViewedBooks(sortedRecentlyViewedBooks);
        }
      } catch (error) {
        console.error('最近閲覧した本の取得中にエラーが発生しました:', error);
      }
    };

    fetchRecentlyViewedBooks();
  }, [currentUser]);

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
                  className={styles.Image}
                />
              </div>
              
            </div>
            <div className={styles.notification01}>
              <div className={styles.menuItem01}>
                <h3 className={styles.additionalInfo}>最近見た本</h3>
              </div>
              <div className={styles.saikin}></div>
              <ul className={styles.recentlyViewedList}>
                {uniqueRecentlyViewedBooks.map((book, index) => (
                  
                  <div key={index} className={styles.FavoriteBooksContainer}>                    
                      <Link legacyBehavior href={`/book/${book.isbn}`} passHref>
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
                ))}

              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
