import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

const RakutenBooksSlider = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const keywords = [
          "Bリーグ",
          "Sport",
          "Next.js",
          "Java",
          "AWS",
          "Python",
          "Kotlin",
          "料理",
          "Node.js",
          "ITパスポート",
          "mysql"
        ];
        const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

        const API_KEY = process.env.APP_ID;

        const response = await axios.get(
          `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&title=${randomKeyword}&applicationId=${API_KEY}&hits=30`
        );
        setBooks(response.data.Items);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  // ISBNを取得する関数
  const getISBN = (book) => {
    // bookがnullまたはundefinedでないことを確認する
    if (book && book.Item && book.Item.isbn) {
      // ISBNをそのまま返す
      return book.Item.isbn;
    } else {
      return null; // ISBNが取得できない場合はnullを返す
    }
  };
  
  

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "60px",
    autoplay: true,
    autoplaySpeed: 3000
  };


  // 代替の画像URL
  const fallbackImageUrl = "/images/images.png";

  return (
    <div className={styles.slider}>
      <Slider {...settings} className={styles.slider}>
        {books.map((book, index) => (
          <div key={index}>
            {/* 画像が存在する場合は本の画像を表示、存在しない場合は代替の画像を表示 */}
            {book.Item && book.Item.largeImageUrl ? (
              <Link legacyBehavior href={`/book/${getISBN(book)}`}>
                <img src={book.Item.largeImageUrl} alt={book.Item.itemCaption} onError={(e) => { e.target.src = fallbackImageUrl }} />
              </Link>
            ) : (
              <img src={fallbackImageUrl} alt="No Image" style={{ width: "130px", height: "100%" }} />
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RakutenBooksSlider;
