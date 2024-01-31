import Link from "next/link";
import Header from "../components/HeaderSigup";
import Styles from "../styles/Home.module.css";
import Footer from "@/components/Footer";
import GoogleBooksSlider from "@/components/RandomBook";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function FirstPost() {
  return (
    <div className={Styles.mainContainer}>
      <Header />
      <main>   

        <div className={Styles.space}></div>

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
        <h2 className={Styles.book_h2}>オススメの本</h2>
        <div className={`${Styles.sliderContainer} slider-container`}>
          <GoogleBooksSlider />
        </div>
      </main>
      <Footer />
    </div>
  );
}
