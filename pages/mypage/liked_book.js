// FavoriteBooksPage.js

import { useEffect, useState } from 'react';
import Header from "@/components/HeaderSigup";
import Footer from "@/components/Footer";
import { useUser, firestore } from '@/hooks/firebase';
import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import Styles from '@/styles/Liviray.module.css';

const FavoriteBooksPage = () => {
  const user = useUser();
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      try {
        if (user) {
          // 'users' コレクションに対する DocumentReference を取得
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
        // 'users' コレクションに対する DocumentReference を取得
        const usersCollectionRef = collection(firestore, 'users');
        const userDocRef = doc(usersCollectionRef, user.uid);

        // 'bookmarks' コレクションに対する DocumentReference を取得
        const bookmarksCollectionRef = collection(userDocRef, 'bookmarks');
        const bookDocRef = doc(bookmarksCollectionRef, bookId);

        await deleteDoc(bookDocRef);

        // 削除後、お気に入りの本を再取得して更新
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

  const formatTimestamp = (timestamp) => {
    const dateObject = new Date(timestamp);
    return `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')} ${dateObject.getHours().toString().padStart(2, '0')}:${dateObject.getMinutes().toString().padStart(2, '0')}:${dateObject.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div className={Styles.mainContainer}>
      <Header />
      <main>
        <div className={Styles.container}>
          <h1 className={Styles.title01}>お気に入りの本</h1>
          {favoriteBooks.length === 0 ? (
            <p>お気に入りの本はありません。</p>
          ) : (
            <ul>
              {favoriteBooks.map((book) => (
                <div key={book.id} className={Styles.favoriteBook}>
                  <div className={Styles.FavoriteBooksContainer}>
                    <img src={book.image} alt="本の画像" style={{ maxWidth: '110px', maxHeight: '160px' }} />
                    <div className={Styles.title}>
                      <div className={Styles.sd01}>
                      <h3>{book.title}</h3>
                      <p>{book.authors}</p>
                      <p>{formatTimestamp(book.timestamp)}</p>
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