// FavoriteBooksPage.js

import { useEffect, useState } from 'react';
import Header from "@/components/HeaderSigup";
import Footer from "@/components/Footer";
import { useUser, firestore } from '@/hooks/firebase';
import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import Styles from '@/styles/Liviray.module.css';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

const FavoriteBooksPage = () => {
  const user = useUser();
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      try {
        if (user) {
          const usersCollectionRef = collection(firestore, 'users');
          const userDocRef = doc(usersCollectionRef, user.uid);
          const bookmarksCollectionRef = collection(userDocRef, 'bookmarks');
          const querySnapshot = await getDocs(bookmarksCollectionRef);
          const favoriteBooksData = [];

          querySnapshot.forEach((doc) => {
            favoriteBooksData.push({ id: doc.id, ...doc.data() });
          });

          favoriteBooksData.sort((a, b) => b.timestamp - a.timestamp);

          setFavoriteBooks(favoriteBooksData);
        }
      } catch (error) {
        console.error('お気に入りの本の取得中にエラーが発生しました:', error);
      }
    };

    fetchFavoriteBooks();
  }, [user]);

  const handleDeleteButtonClick = async (bookId) => {
    try {
      if (user) {
        const usersCollectionRef = collection(firestore, 'users');
        const userDocRef = doc(usersCollectionRef, user.uid);
        const bookmarksCollectionRef = collection(userDocRef, 'bookmarks');
        const bookDocRef = doc(bookmarksCollectionRef, bookId);

        await deleteDoc(bookDocRef);

        const querySnapshot = await getDocs(bookmarksCollectionRef);
        const favoriteBooksData = [];

        querySnapshot.forEach((doc) => {
          favoriteBooksData.push({ id: doc.id, ...doc.data() });
        });

        favoriteBooksData.sort((a, b) => b.timestamp - a.timestamp);

        setFavoriteBooks(favoriteBooksData);
      }
    } catch (error) {
      console.error('お気に入りの本の削除中にエラーが発生しました:', error);
    }
  };

  const breadcrumbs = [
    { label: 'トップ', path: '/' },
    { label: 'マイページ', path: '/mypage' },
    { label: 'お気に入りリスト', path: '/mypage/liked_book' },
  ];

  return (
    <div className={Styles.mainContainer}>
      <Header />
      <main>
        <Breadcrumbs crumbs={breadcrumbs} />
        <div className={Styles.container}>
          <h1 className={Styles.title01}>お気に入りの本</h1>
          {favoriteBooks.length === 0 ? (
            <p>お気に入りの本はありません。</p>
          ) : (
            <ul>
              {favoriteBooks.map((book) => (
                <div key={book.id} className={Styles.favoriteBook}>
                  <div className={Styles.FavoriteBooksContainer}>
                  <Link legacyBehavior href="/book/[bookId]" as={`/book/${book.id}`}>
                    <img src={book.image} alt="本の画像" style={{ maxWidth: '110px', maxHeight: '160px' }} />
                  </Link>
                    <div className={Styles.title}>

                        <div className={Styles.sd01}>
                        <Link legacyBehavior href="/book/[bookId]" as={`/book/${book.id}`}>
                          <a>
                          <h3>{book.title}</h3>
                          <p>{book.authors}</p>
                          </a>
                          </Link>
                        </div>
                      
                      <div>
                        <button onClick={() => handleDeleteButtonClick(book.id)} className={Styles.button01}>削除</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FavoriteBooksPage;