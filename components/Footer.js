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
      <div className={styles.space01}></div>
      <a href="https://www.it-college.ac.jp/?gclid=CjwKCAiAvoqsBhB9EiwA9XTWGZYeNJJvtzm6FiBpkpR2QO5CBdlt1uy6NEBZxQG7Pfg8YgyqHg62aRoCAAUQAvD_BwE" target="_blank" rel="noopener noreferrer">
      <FaSlack className={styles.githubIcon} />
        ItCollege
      </a>
    </footer>
  );
}
