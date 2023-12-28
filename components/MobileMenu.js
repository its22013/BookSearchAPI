// components/MobileMenu.js
import Link from "next/link";
import styles from "../styles/MobileMenu.module.css";
import { useUser } from "../hooks/firebase";

export default function MobileMenu({ onClose }) {
  const currentUser = useUser();

  return (
    <div className={styles.mobileMenu}>
      <div className={styles.menuItem}>
        <Link legacyBehavior href="/Ranking">
          <a onClick={onClose}>ランキング</a>
        </Link>
      </div>
      <div className={styles.menuItem}>
        <Link legacyBehavior href="/mypage/liked_book">
          <a onClick={onClose}>お気に入り</a>
        </Link>
      </div>
      <div className={styles.menuItem}>
      {currentUser && currentUser.displayName && (
            <Link legacyBehavior href="/mypage">
              <a>{currentUser.displayName || 'マイページ'}</a>
            </Link>
          )}
      </div>
      <div className={styles.menuItem}>
        <Link legacyBehavior href="/logout">
          <a onClick={onClose}>ログアウト</a>
        </Link>
      </div>
    </div>
  );
}
