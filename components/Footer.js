import styles from '../styles/Footer.module.css';
import { FaGithub } from 'react-icons/fa';
import { FaSlack } from "react-icons/fa";


export default function Footer() {
  return (
    <footer className={styles.footer}>
      © 2023 Happiness requires struggle.
      <div className={styles.space}></div>
      <a href="https://github.com/its22013/BookSearchAPI" target="_blank" rel="noopener noreferrer">
        <FaGithub className={styles.githubIcon} />
        GitHub
      </a>
      <a>
      <FaSlack className={styles.githubIcon} />
        Slack
      </a>
    </footer>
  );
}
