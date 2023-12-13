import Link from "next/link";
import styles from "../styles/Header.module.css";
import Image from "next/image";

export default function Header() {

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
      <h1>Book Serach</h1>
      </div>
      <Link legacyBehavior href="/signup">
        <a className={styles.loginButton}>新規登録・ログイン</a>
      </Link>
    </div>
  );
}