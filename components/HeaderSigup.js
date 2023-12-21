// components/Header.js
import { useState } from "react";
import Link from "next/link";
import styles from "../styles/Header.module.css";
import Styles from "../styles/heart.module.css";
import Image from "next/image";
import { useUser } from "../hooks/firebase";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const currentUser = useUser();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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

      {/* ハンバーガーメニューのトグルボタン */}
      {currentUser ? (
        <div
          className={`${styles.mobileMenuToggle} ${
            isMobileMenuOpen ? styles.open : ""
          }`}
          onClick={toggleMobileMenu}
        >
          <div className={styles.hamburgerIcon}></div>
        </div>
      ) : null}

      {/* モバイルメニュー */}
      {isMobileMenuOpen && <MobileMenu onClose={closeMobileMenu} />}

      {currentUser ? (
        // ログイン時のメニュー
        <div
          className={`${styles.loggedContainer} ${
            isMobileMenuOpen ? styles.showMobileMenu : ""
          }`}
        >
          <div className={styles.linkWithImage01}>
            <Link href="/Ranking">
              <Image
                src="/images/ran.png"
                alt="Ranking Image"
                width={50}
                height={50}
              />
            </Link>
            <div className={styles.linkText01}>
              <Link href="/Ranking">ランキング</Link>
            </div>
          </div>

          <div className={styles.space}></div>

          <div className={styles.linkWithImage02}>
            <Link href="/liked-books">
              <div className={Styles.heart}></div>
            </Link>
            <div className={styles.linkText02}>
              <Link href="/liked-books">お気に入り</Link>
            </div>
          </div>

          <div className={styles.space}></div>

          {currentUser.displayName && (
            <Link legacyBehavior href="/mypage">
              <a className={styles.loginButton}>{currentUser.displayName || 'マイページ'}</a>
            </Link>
          )}

          <div className={styles.space}></div>

          <Link legacyBehavior href="/logout">
            <a className={styles.loginButton}>ログアウト</a>
          </Link>
        </div>
      ) : (
        // 非ログイン時のメニュー
        <Link legacyBehavior href="/signup">
          <a className={styles.loginButton}>新規登録・ログイン</a>
        </Link>
      )}
    </div>
  );
}