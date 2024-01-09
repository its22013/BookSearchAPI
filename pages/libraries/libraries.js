// pages/libraries/libraries.js
import React from 'react';

const LibrariesData = [
    { name: '沖縄県立図書館', systemid: 'Okinawa_Pref' },
    { name: '琉球大学図書館', systemid: 'Univ_Ryukyu' },
    { name: '糸満市立中央図書館', systemid: 'Okinawa_Itoman' },
    { name: '豊見城市立中央図書館', systemid: 'Okinawa_Tomigusuku' },
    { name: '沖縄国際大学図書館', systemid: 'Univ_Okiu' },
    { name: '沖縄大学図書館', systemid: 'Univ_Okinawa' },
    { name: '沖縄県立看護大学図書館', systemid: 'Univ_Okinawa_Nurs' },
    { name: '南城市立図書館佐敷分館', systemid: 'Okinawa_Nanjo' },
  // 他の図書館も同様に追加
];

const Libraries = () => {
  return (
    <div>
      {/* 何も表示する必要がないので空のコンポーネント */}
    </div>
  );
};

export { LibrariesData };
export default Libraries;
