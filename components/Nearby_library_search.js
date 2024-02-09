import React, { useState } from 'react';
import { LibrariesData } from '@/pages/libraries/libraries';
import styles from '@/styles/Liviray.module.css'

const Libraries = () => {
  const [nearbyLibraries, setNearbyLibraries] = useState([]); // 近くの図書館の情報を格納するstate
  const [error, setError] = useState(null); // エラーメッセージを格納するstate
  const [showLibraries, setShowLibraries] = useState(false); // 近くの図書館を表示するかどうかのstate

  const fetchNearbyLibraries = async () => {
    try {
      const { coords } = await getCurrentPosition(); // ユーザーの現在位置を取得
      const { latitude, longitude } = coords; // 緯度と経度を取得

      // 各図書館との距離を計算し、近くの図書館を取得
      const nearby = LibrariesData.map(library => {
        return { ...library, distance: getDistance(latitude, longitude, library.latitude, library.longitude) };
      });

      // 距離が近い順にソートし、上位5つを取得
      const sortedNearby = nearby.sort((a, b) => a.distance - b.distance).slice(0, 10);
      setNearbyLibraries(sortedNearby); // 近くの図書館情報をstateにセット
      setShowLibraries(true); // 近くの図書館を表示する
    } catch (error) {
      console.error('Error fetching nearby libraries:', error);
      setError('近くの図書館情報の取得中にエラーが発生しました');
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject); // ユーザーの現在位置を取得するPromise
    });
  };

  // 2点間の距離を計算する関数
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 地球の半径（km）
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // 2点間の距離（km）
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180); // 度をラジアンに変換する関数
  };

  const handleShowLibraries = () => {
    if (!showLibraries) {
      fetchNearbyLibraries();
    } else {
      setNearbyLibraries([]); // 近くの図書館情報をクリア
      setShowLibraries(false); // 近くの図書館を非表示にする
    }
  };

  return (
    <div className={styles.sapce01}>
      <h2>近くの図書館を検索</h2>
      <button onClick={handleShowLibraries}>
        {showLibraries ? '近くの図書館を非表示にする' : '近くの図書館を表示する'}
      </button>
      {error && <div>{error}</div>} {/* エラーメッセージの表示 */}
      {showLibraries && (
        <div className={styles.scrollableContainer}>
          <ul>
            {nearbyLibraries.map(library => (
              <p key={library.systemid} className={styles.text01}>
                <div className={styles.text02}>{library.name}</div>
                <div>現在地からの距離: {library.distance.toFixed(2)}km</div>
                <div>電話番号: {library.tel}</div>
                <div>住所: {library.post}</div>
                <div>
                  <button>
                  <a href={library.url_pc} target="_blank" rel="noopener noreferrer">図書館のページへ</a>
                  </button>
                </div>
              </p>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Libraries;