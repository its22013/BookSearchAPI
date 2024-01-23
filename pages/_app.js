// pages/_app.js

import Head from 'next/head';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* 他のメタ情報やスタイルシートのリンクなどをここに追加できます */}
        <link rel="icon" href="/book_search.ico" sizes="16x16" type="image/x-icon" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
