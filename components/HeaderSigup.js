// components/Header.js
import Link from "next/link";
import styles from "../styles/Header.module.css";
import Image from "next/image";
import { useUser } from "../hooks/firebase";  

export default function Header() {
  const currentUser = useUser();

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
        <div className={styles.loggedContainer}>
          <Link legacyBehavior href="/mypage">
            <a className={styles.loginButton}>マイページ</a>
          </Link>
          <Link legacyBehavior href="/logout">
            <a className={styles.loginButton}>ログアウト</a>
          </Link>
        </div>
      ) : (
        <Link legacyBehavior href="/signup">
          <a className={styles.loginButton}>新規登録・ログイン</a>
        </Link>
      )}
    </div>
  );
}

