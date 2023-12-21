// pages/mypage.js
import Link from "next/link";
import { useRouter } from 'next/router';
import Header from "../components/HeaderSigup";
import Styles from "../styles/Home.module.css";
import Footer from "@/components/Footer";
import styles from "../styles/MyPage.module.css";
import { useUser, useAuth } from "../hooks/firebase";  // 追加

export default function MyPage() {
  const currentUser = useUser();
  const router = useRouter();
  const auth = useAuth();  // 追加

  const handleLogout = async () => {
    try {
      // Firebase Auth の signOut メソッドを使用してログアウト
      await auth.signOut();
      console.log('ログアウトしました');
      await router.replace('/'); // ログアウト後にトップページに遷移
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <div className={Styles.mainContainer}>
      <Header />
      <main>
        <div className={styles.secondContainer}>
          <Link legacyBehavior href="/">
            <a className={styles.mypage01}>トップ</a>
          </Link>
          {" > "}
          <Link legacyBehavior href="/mypage">
            <a className={styles.mypage02}>マイページ</a>
          </Link>
          <h1 className={styles.h1}>MY PAGE</h1>
          <div className={styles.box1}>
            {currentUser && currentUser.displayName && (
              <a>{currentUser.displayName || 'マイページ'} さん ようこそ！</a>
            )}
          </div>

          <h3 className={styles.menuItem}>
            <Link legacyBehavior href="/favorites">
              <a>お気に入りリスト</a>
            </Link>
          </h3>
          <h3 className={styles.menuItem}>
            <Link legacyBehavior href="/password">
              <a>パスワード確認・変更</a>
            </Link>
          </h3>
          <h3 className={styles.menuItem}>
            <a onClick={handleLogout}>ログアウト</a>
          </h3>

        </div>
      </main>
      <Footer />
    </div>
  );
}