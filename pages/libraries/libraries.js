// pages/libraries/libraries.js
import React from 'react';

const LibrariesData = [
  { name: '沖縄県立図書館', systemid: 'Okinawa_Pref', latitude: 26.2113653, longitude: 127.6769793, post: '900-0021', tel: '098-894-5858', url_pc: 'https://www.library.pref.okinawa.jp/' },
  { name: '琉球大学図書館', systemid: 'Univ_Ryukyu', latitude: 26.248165, longitude: 127.766442, post: '903-0215', tel: '098-895-1052', url_pc: 'http://www.lib.u-ryukyu.ac.jp/' }, 
  { name: '糸満市立中央図書館', systemid: 'Okinawa_Itoman', latitude: 26.119468, longitude: 127.6725281, post: '901-0362', tel: '098-995-3746', url_pc: 'https://www.city.itoman.lg.jp/soshiki/35/' }, 
  { name: '豊見城市立中央図書館', systemid: 'Okinawa_Tomigusuku', latitude: 26.1738636, longitude: 127.6742434, post: '901-0232', tel: '098-856-6006', url_pc: 'https://www.city.tomigusuku.lg.jp/soshiki/8/1033/gyomuannai/8/350.html' }, 
  { name: '沖縄国際大学図書館', systemid: 'Univ_Okiu', latitude: 26.262150, longitude: 127.755039, post: '901-2701', tel: '098-893-7854', url_pc: 'https://www.okiu.ac.jp/library/' }, 
  { name: '沖縄大学図書館', systemid: 'Univ_Okinawa', latitude: 26.201403, longitude: 127.699216, psot: '902-8521', tel: '098-832-5577', url_pc: 'https://opac.okinawa-u.ac.jp/' }, 
  { name: '沖縄県立看護大学図書館', systemid: 'Univ_Okinawa_Nurs', latitude: 26.206167803379497, longitude: 127.69451820756994, post: '902-0076', tel: '098-833-8806', url_pc: 'https://libopac.okinawa-nurs.ac.jp/drupal/' }, 
  { name: '南城市立図書館佐敷分館', systemid: 'Okinawa_Nanjo', latitude: 26.1700946, longitude: 127.7874446, post: '901-1206', tel: '098-917-5532', url_pc: 'http://library.city.nanjo.okinawa.jp/Nanjo/index.php' },
  { name: '名護市立中央図書館', systemid: 'Okinawa_Nago', latitude: 26.5996095, longitude: 127.9706358, post: '905-0011', tel: '0980-53-7246', url_pc: 'http://www.city.nago.okinawa.jp/library/' }, 
  { name: 'うるま市立中央図書館', systemid: 'Okinawa_Uruma', latitude: 26.3651467, longitude: 127.8489089, post: '904-2221', tel: '098-974-1112', url_pc: 'http://www.city.uruma.lg.jp/shisei/160/2357/2363' },
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
