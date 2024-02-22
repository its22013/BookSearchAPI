import { useEffect, useState } from 'react';
import Header from "@/components/HeaderSigup";
import Footer from "@/components/Footer";
import { useRouter } from 'next/router';
import Styles from '@/styles/Liviray.module.css';
import styles from '@/styles/BookDetailsPage.module.css'
import Link from 'next/link';
import { doc, setDoc, collection, deleteDoc, getDoc } from 'firebase/firestore';
import { useUser } from '@/hooks/firebase';
import { getFirestore } from 'firebase/firestore';

const BookDetailsPage = () => {
  const router = useRouter();
  const { isbn } = router.query;
  const [bookDetails, setBookDetails] = useState(null);
  const user = useUser();
  const firestoreDB = getFirestore();
  const [isFavorite, setIsFavorite] = useState(false); // お気に入りステートを修正
  const goBack = () => {
    router.back();
  };

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

  const saveRecentlyViewedBook = async (bookDetails) => {
    try {
      if (!user) return;

      const userId = user.uid;
      const userDocRef = doc(firestoreDB, 'users', userId);
      const recentlyViewedRef = collection(userDocRef, 'recently_viewed');

      // 最新の閲覧した本をFirestoreに保存
      await setDoc(doc(recentlyViewedRef, isbn), {
        title: bookDetails.title,
        isbn: bookDetails.isbn,
        author: bookDetails.author,
        imageUrl: bookDetails.largeImageUrl,
        salesDate: bookDetails.salesDate,
        createdAt: new Date().toISOString() // 追加：ドキュメントの作成日時をISO文字列に変換
      });

      // 最新の5件のみを保存するため、古いデータを削除する
      const snapshot = await getDocs(recentlyViewedRef);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (docs.length > 5) {
        const sortedDocs = docs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // 追加：日付で昇順ソート
        const oldestDoc = sortedDocs[0];
        await deleteDoc(doc(recentlyViewedRef, oldestDoc.id));
      }

      console.log('最近閲覧した本を保存しました');
    } catch (error) {
      console.error('最近閲覧した本の保存中にエラーが発生しました:', error);
    }
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        if (isbn) {
          const apiKey = process.env.APP_ID;
          const response = await fetch(`https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&isbn=${isbn}&applicationId=${apiKey}`);
          const data = await response.json();

          if (data.Items && data.Items.length > 0) {
            const bookDetails = data.Items[0].Item;
            setBookDetails(bookDetails);
            saveRecentlyViewedBook(bookDetails); // ブックディテールを保存する
          } else {
            console.error('楽天BooksAPIからの詳細情報が見つかりませんでした。', data);
          }
        }
      } catch (error) {
        console.error('楽天BooksAPIからの詳細情報取得中にエラーが発生しました:', error);
      }
    };

    fetchBookDetails();
  }, [isbn, user]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        if (user && isbn) {
          const userId = user.uid;
          const userDocRef = doc(firestoreDB, 'users', userId);
          const bookmarksCollectionRef = collection(userDocRef, 'bookmarks');
          const bookDocRef = doc(bookmarksCollectionRef, isbn);
          const existingDoc = await getDoc(bookDocRef);
          setIsFavorite(existingDoc.exists());
        }
      } catch (error) {
        console.error('お気に入りステータスの確認中にエラーが発生しました:', error);
      }
    };

    checkFavoriteStatus();
  }, [user, isbn]);

  const handleFavoriteButtonClick = async () => {
    try {
      if (!user) {
        console.log('ログインしていません');
        return;
      }
  
      const userId = user.uid;
      const userDocRef = doc(firestoreDB, 'users', userId);
      const bookmarksCollectionRef = collection(userDocRef, 'bookmarks');
      const bookDocRef = doc(bookmarksCollectionRef, isbn);
  
      const existingDoc = await getDoc(bookDocRef);
  
      if (!existingDoc.exists()) {
        // largeImageUrl を image に変更して保存
        await setDoc(bookDocRef, { ...bookDetails, image: bookDetails.largeImageUrl });
        console.log('お気に入りに追加しました');
        alert('お気に入りに追加しました');
        setIsFavorite(true);
      } else {
        await deleteDoc(bookDocRef);
        console.log('お気に入りから削除しました');
        alert("この本は既にお気に入りに追加されています");
        setIsFavorite(false);
      }
    } catch (error) {
      console.error('お気に入りの更新中にエラーが発生しました:', error);
    }
  };
  


  return (
    <div className={Styles.mainContainer}>
      <Header />
      <main>
        {bookDetails ? (
          <div className={styles.bookDetailsContainer}>
            <div>
              <img src={bookDetails.largeImageUrl} alt="本の画像" className={styles.s1}/>
            </div>
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
            <div className={styles.heartIcon01}>
              {!isFavorite && (
                <a onClick={() => handleFavoriteButtonClick(bookDetails)} className={Styles.heartIcon}>
                  ❤
                </a>
              )}
              {isFavorite && (
                <span className={Styles.displayFavorite}>
                  ❤
                </span>
              )}
            </div>
            <button className={styles.backButton} onClick={goBack}>
              前のページに戻る
            </button>
          </div>
        ) : (
          <h1 className={styles.nobook}>その本の詳細は現時点では見つかりません！</h1>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BookDetailsPage;