// components/Breadcrumbs.js
import Link from 'next/link';
import styles from '../styles/Breadcrumbs.module.css';

const Breadcrumbs = ({ crumbs }) => {
  return (    
    <div className={styles.breadcrumbs}>
      {crumbs.map((crumb, index) => (
        <span key={index}>
          {index > 0 && ' > '}
          {crumb.path ? (
            <Link legacyBehavior href={crumb.path}>
              <a className={styles.crumbLink}>{crumb.label}</a>
            </Link>
          ) : (
            <span className={styles.currentCrumb}>{crumb.label}</span>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
