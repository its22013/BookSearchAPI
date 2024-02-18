// pages/libraries/libraries.js
import React from 'react';

const LibrariesData = [
  // 南部エリア
  { name: '沖縄県立図書館', systemid: 'Okinawa_Pref', region: '南部', latitude: 26.2113653, longitude: 127.6769793, post: '900-0021', tel: '098-894-5858', url_pc: 'https://www.library.pref.okinawa.jp/' },
  { name: '糸満市立中央図書館', systemid: 'Okinawa_Itoman', region: '南部', latitude: 26.119468, longitude: 127.6725281, post: '901-0362', tel: '098-995-3746', url_pc: 'https://www.city.itoman.lg.jp/soshiki/35/' }, 
  { name: '豊見城市立中央図書館', systemid: 'Okinawa_Tomigusuku', region: '南部', latitude: 26.1738636, longitude: 127.6742434, post: '901-0232', tel: '098-856-6006', url_pc: 'https://www.city.tomigusuku.lg.jp/soshiki/8/1033/gyomuannai/8/350.html' }, 
  { name: '沖縄県立看護大学図書館', systemid: 'Univ_Okinawa_Nurs', region: '南部', latitude: 26.206167803379497, longitude: 127.69451820756994, post: '902-0076', tel: '098-833-8806', url_pc: 'https://libopac.okinawa-nurs.ac.jp/drupal/' }, 
  { name: '南城市立知念図書館', systemid: 'Okinawa_Nanjo', region: '南部', latitude: 26.171342, longitude: 127.820225, post: '901-1511', tel: '098-917-5310', url_pc: 'http://library.city.nanjo.okinawa.jp/Nanjo/index.php' },
  { name: '沖縄女子短期大学附属図書館', systemid: 'Univ_Okijo', region: '南部', latitude: 26.2099486, longitude: 127.7633251, post: '901-1304', tel: '098-882-9004', url_pc: 'http://www.owjc.ac.jp/library'},
  { name: '与那原町立図書館', systemid: 'Okinawa_Yonabaru', region: '南部', latitude: 26.2036684, longitude: 127.7554927, post: '901-1303', tel: '098-946-6959', url_pc: 'https://ilisod003.apsel.jp/yonabaru-library/'},
  { name: '浦添市立図書館', systemid: 'Okinawa_Urasoe', region: '南部', latitude: 26.2478412, longitude: 127.721393, post: '901-2114', tel: '098-876-4946', url_pc: 'https://www.city.urasoe.lg.jp/facilityDetail?articleId=60b9923443f5421c3eb73f2c&categoryId=20101020'},
  { name: '南風原町立図書館', systemid: 'Okinawa_Haebaru', region: '南部', latitude: 26.1876112, longitude: 127.7308292, post: '901-1113', tel: '098-889-6400', url_pc: 'https://www.lics-saas.nexs-service.jp/haebaru/webopac/index.do'},
  { name: '那覇市立中央図書館', systemid: 'Okinawa_Naha', region: '南部', latitude: 26.208391, longitude: 127.69357, post: '902-0064', tel: '098-917-3449', url_pc: 'https://www.city.naha.okinawa.jp/lib/index.html'},
  { name: '沖縄大学図書館', systemid: 'Univ_Okinawa', region: '南部', latitude: 26.201403, longitude: 127.699216, post: '902-8521', tel: '098-832-5577', url_pc: 'https://opac.okinawa-u.ac.jp/'},


  // 中部エリア
  { name: '琉球大学図書館', systemid: 'Univ_Ryukyu',region: '中部', latitude: 26.248165, longitude: 127.766442, post: '903-0215', tel: '098-895-1052', url_pc: 'http://www.lib.u-ryukyu.ac.jp/' }, 
  { name: '沖縄国際大学図書館', systemid: 'Univ_Okiu', region: '中部', latitude: 26.262150, longitude: 127.755039, post: '901-2701', tel: '098-893-7854', url_pc: 'https://www.okiu.ac.jp/library/' }, 
  { name: '沖縄大学図書館', systemid: 'Univ_Okinawa', region: '中部', latitude: 26.201403, longitude: 127.699216, psot: '902-8521', tel: '098-832-5577', url_pc: 'https://opac.okinawa-u.ac.jp/' }, 
  { name: 'うるま市立中央図書館', systemid: 'Okinawa_Uruma', region: '中部', latitude: 26.3651467, longitude: 127.8489089, post: '904-2221', tel: '098-974-1112', url_pc: 'http://www.city.uruma.lg.jp/shisei/160/2357/2363' },
  { name: '宜野湾市民図書館', systemid: 'Okinawa_Ginowan', region: '中部', latitude: 26.253944, longitude: 127.7546902, post: '901-2214', tel: '098-897-4646', url_pc: 'https://www.city.ginowan.lg.jp/soshiki/kyoiku/1/1/index.html'}, 
  { name: '西原町立図書館',  systemid: 'Okinawa_Nishihara', region: '中部', latitude: 26.2212836, longitude: 127.7599746, post: '903-0111', tel: '098-944-4996', url_pc: 'http://www.town.nishihara.okinawa.jp/library/'},
  { name: '読谷村立図書館', systemid: 'Okinawa_Yomitani', region: '中部', latitude: 26.4066041, longitude: 127.7333775, post: '904-0322', tel: '098-958-3113', url_pc: 'https://www.vill.yomitan.okinawa.jp/soshiki/library/gyomu/shisetsu/library/1048.html'},
  { name: '北中城村立あやかりの杜図書館', systemid: 'Okinawa_Kitanakagusuku', region: '中部', latitude: 26.306598, longitude: 127.790746, post: '901-2311', tel: '098-983-8060', url_pc: 'http://www.ayakari.jp/menuIndex.jsp?id=70327&menuid=14002&funcid=28'},
  { name: '中城村護佐丸歴史資料図書館', systemid: 'Okinawa_Nakanojyo', region: '中部', latitude: 26.259530, longitude: 127.790504, post: '901-2407', tel: '098-895-5302', url_pc: 'https://www.vill.nakagusuku.okinawa.jp/detail.jsp?id=75302&menuid=14691&funcid=1'},
  { name: '北谷町立図書館', systemid: 'Okinawa_Chatan', region: '中部', latitude: 26.3249464, longitude: 127.7688556, post: '904-0103', tel: '098-936-3542', url_pc: 'http://www.chatan.jp/library/'},
  { name: '嘉手納町立図書館', systemid: 'Okinawa_Kadena', region: '中部', latitude: 26.363375, longitude: 127.756361, post: '904-0203', tel: '098-957-2470', url_pc: 'http://www.town.kadena.okinawa.jp/rotaryplaza/tosyokan.html'},
  { name: '沖縄市立図書館', systemid: 'Okinawa_Okinawa', region: '中部', latitude: 26.3376477, longitude: 127.7990625, post: '904-0004', tel: '098-932-6881', url_pc: 'https://www.city.okinawa.okinawa.jp/k064-001/kosodate/shakaikyouiku/library/lib/index.html'},

  
  // 北部エリア
  { name: '名護市立中央図書館', systemid: 'Okinawa_Nago', region: '北部', latitude: 26.5996095, longitude: 127.9706358, post: '905-0011', tel: '0980-53-7246', url_pc: 'http://www.city.nago.okinawa.jp/library/' }, 
  { name: '宜野座村文化センター図書館', systemid: 'Okinawa_Ginoza', region: '北部', latitude: 26.481240, longitude: 127.976888, post: '904-1302', tel: '098-983-2611', url_pc: 'http://library.ginoza-bunka.jp/'},
  { name: '金武町立図書館', systemid: 'Okinawa_Kin', region: '北部', latitude: 26.4496821, longitude: 127.9258644, post: '904-1201', tel: '098-968-5004', url_pc: 'https://kin-lib.town.kin.okinawa.jp/'},
  { name: '本部町立図書館', systemid: 'Okinawa_Motobu', region: '北部', latitude: 26.6557358, longitude: 127.8841786, post: '905-0212', tel: '0980-47-2105', url_pc: 'http://motobu-m.town.motobu.okinawa.jp/libraryworks'},
  { name: '沖縄工業高等専門学校図書館', systemid: 'Univ_Okinawa_Ct', region: '北部', latitude: 26.5261595, longitude: 128.0310202, post: '905-2192', tel: '0980-55-4037', url_pc: 'http://www.okinawa-ct.ac.jp/menuIndex.jsp?id=74144&menuid=14875&funcid=28'},
  { name: '恩納村文化情報センター', systemid: 'Okinawa_Onna', region: '北部', latitude: 26.436467, longitude: 127.793045, post: '904-0415', tel: '098-982-5432', url_pc: 'http://www.onna-culture.jp/'},
  { name: '名桜大学附属図書館', systemid: 'Univ_Meio', region: '北部', latitude: 26.623901, longitude: 127.974972, post: '905-8585', tel: '0980-51-1062', url_pc: 'https://www.meio-u.ac.jp/library/'},

  // 離島エリア
  { name: '石垣市立図書館', systemid: 'Okinawa_Ishigaki', region: '離島', latitude: 24.339508, longitude: 124.153292, post: '907-0013', tel: '0980-83-3862', url_pc: 'https://www.city.ishigaki.okinawa.jp/kurashi_gyosei/kanko_bunka_sport/toshokan/index.html'},
  { name: '宮古島市立図書館', systemid: 'Okinawa_Miyakojima_Hirara', region: '離島', latitude: 24.801833, longitude: 125.290931, post: '906-0007', tel: '0980-72-2235', url_pc: 'https://www.city.miyakojima.lg.jp/soshiki/kyouiku/syougaigakusyu/miraisouzou/'},
  { name: '久米島図書館', systemid: 'Okinawa_Kumejima', region: '離島', latitude: 26.339217, longitude: 126.762943, post: '901-3121', tel: '098-987-7051', url_pc: 'http://www.town.kumejima.okinawa.jp/library/'},

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
