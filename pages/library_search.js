// Livirays.js

import Header from "@/components/HeaderSigup";
import Footer from "@/components/Footer";
import Liviray from "@/components/library_search";
import styles from "@/styles/Liviray.module.css";
import NearbyLibraries from "@/components/Nearby_library_search";

export default function Livirays() {
  return (
    <div className={styles.mainContainer}>
      <Header />
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