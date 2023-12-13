import Link from "next/link";
import styles from "../styles/Header.module.css";
import Image from "next/image";
import { useUser } from "../hooks/firebase";  // useUser フックをインポート

export default function Header() {
  const currentUser = useUser();  // ユーザーの認証状態を取得

  return (
    <div className={styles.container}>
      {/* トップページに戻る写真 */}
      <Link legacyBehavior href="/">
        <a>
          <Image
            src="/images/books_01.png"
            alt="Home Image"
            width={60}
            height={60}
          />
        </a>
      </Link>
      <div className={styles.s1}>
        <h1>Book Search</h1>
      </div>
      {currentUser ? (
        // ユーザーが認証されている場合はマイページへのリンクを表示
        <Link legacyBehavior href="/mypage">
          <a className={styles.loginButton}>マイページ</a>
        </Link>
      ) : (
        // ユーザーが認証されていない場合は新規登録・ログインボタンを表示
        <Link legacyBehavior href="/signup">
          <a className={styles.loginButton}>新規登録・ログイン</a>
        </Link>
      )}
    </div>
  );
}
