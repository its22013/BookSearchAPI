import Link from "next/link";
import Header from "../components/HeaderSigup";
import Styles from "../styles/Home.module.css";
import Footer from "@/components/Footer";

export default function FirstPost() {
  return (
    <div className={Styles.mainContainer}>
      <Header />
      <main>   
        <div className={`${Styles.all} ${Styles.buttonCentered}`}>
          <Link legacyBehavior href="/rakuten_search">
          <div className={`${Styles.buttonWithPadding}`}>
            <a className={`${Styles.button} ${Styles.centerText} ${Styles.button1}`}>
              楽天本APIで<br />検索
            </a>
          </div>
          </Link>
          <Link legacyBehavior href="/library_search">
          <div className={`${Styles.buttonSpacing} ${Styles.buttonWithPadding}`}>
            <a className={`${Styles.button} ${Styles.centerText} ${Styles.button2}`}>
              図書館で<br />検索
            </a>
          </div>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
