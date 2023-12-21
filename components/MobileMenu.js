// components/MobileMenu.js
import Link from "next/link";
import styles from "../styles/MobileMenu.module.css";

export default function MobileMenu({ onClose }) {
  return (
    <div className={styles.mobileMenu}>
      <div className={styles.menuItem}>
        <Link legacyBehavior href="/ranking">
          <a onClick={onClose}>ランキング</a>
        </Link>
      </div>
      <div className={styles.menuItem}>
        <Link legacyBehavior href="/liked-books">
          <a onClick={onClose}>お気に入り</a>
        </Link>
      </div>
      <div className={styles.menuItem}>
        <Link legacyBehavior href="/mypage">
          <a onClick={onClose}>マイページ</a>
        </Link>
      </div>
      <div className={styles.menuItem}>
        <Link legacyBehavior href="/logout">
          <a onClick={onClose}>ログアウト</a>
        </Link>
      </div>
    </div>
  );
}
