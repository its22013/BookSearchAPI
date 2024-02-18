// Livirays.js

import Header from "@/components/HeaderSigup";
import Footer from "@/components/Footer";
import Liviray from "@/components/library_search";
import styles from "@/styles/Liviray.module.css";
import NearbyLibraries from "@/components/Nearby_library_search";
import Breadcrumbs from "@/components/Breadcrumbs";



export default function Livirays() {
  const breadcrumbs = [
    { label: 'トップ', path: '/' },
    { label: '図書館検索', path: '/library_search' },
  ];

  return (
    <div className={styles.mainContainer}>
      <Header />
      <Breadcrumbs crumbs={breadcrumbs} />
      <main className={styles.contentContainer}>
        <Liviray />
        <div className={styles.NearbyLibrariesContainer}>
          <NearbyLibraries />
        </div>
      </main>
      <Footer />
    </div>
  );
}