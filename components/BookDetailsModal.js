// BookDetailsModal.js

import React from 'react';
import style from '../styles/BookDetailsModal.module.css'; 
import {CloseIcon, ExternalLinkIcon} from '@chakra-ui/icons';

const BookDetailsModal = ({ book, onClose }) => {
    const getAvailabilityStatus = (availability) => {
        switch (availability) {
          case '1':
            return '在庫あり';
          case '2':
            return '通常3～7日程度で発送';
          case '3':
            return '通常3～9日程度で発送';
          case '4':
            return 'メーカー取り寄せ';
          case '5':
            return '予約受付中';
          case '6':
            return 'メーカーに在庫確認';
          default:
            return '不明';
        }
      };
      const getPostageFlag = (postageFlag) => {
        switch (postageFlag) {
          case 0:
            return '送料別';
          case 1:
            return '宅配送料無料';
          case 2:
            return '送料無料(コンビニ送料含む)※キャンペーンなどで実際の送料の扱いは、出力内容と異なることがあります';
          default:
            return '不明';
        }
      };
  return (
    <div className={style.modalOverlay} onClick={onClose}>
      <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
      <div className={style.Icons}>
        <CloseIcon boxSize={25} onClick={onClose}/>
        </div>
      <img src={book.Item.largeImageUrl} alt="本の画像" />
            <h1>{book.Item.title}</h1>
            <p>著者名: {book.Item.author}</p>
            <p>価格: {book.Item.itemPrice}円</p>
            <p>商品説明: {book.Item.itemCaption}</p>
            <p>在庫確認: {getAvailabilityStatus(book.Item.availability)}</p>
            <p>出版日: {book.Item.salesDate}</p>
            <p>送料: {getPostageFlag(book.Item.postageFlag)}</p>
            <button   className={style.showsai}
               onClick={() => window.open(book.Item.itemUrl, '_blank')}
             >
               詳細・購入<ExternalLinkIcon boxSize={20} ml={8} />
             </button>
       
      </div>
    </div>
  );
};

export default BookDetailsModal;

