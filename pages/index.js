import Header from "../components/HeaderSigup";
import Styles from "../styles/Home.module.css";

export default function FirstPost() {
  return (
    <div>
      <Header />
      <main>
        <div className={`${Styles.all} ${Styles.buttonCentered}`}>
          <div className={`${Styles.buttonWithPadding}`}>
            <a className={`${Styles.button} ${Styles.centerText} ${Styles.button1}`}>
              楽天本APIで<br />検索
            </a>
          </div>

          <div className={`${Styles.buttonSpacing} ${Styles.buttonWithPadding}`}>
            <a className={`${Styles.button} ${Styles.centerText} ${Styles.button2}`}>
              図書館で<br />検索
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
