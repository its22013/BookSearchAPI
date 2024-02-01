// BookDetailsModal.js

import React from 'react';
import style from '../styles/BookDetailsModal.module.css'; 
import {CloseIcon, ExternalLinkIcon} from '@chakra-ui/icons';

const BookDetailsModal = ({ book, onClose }) => {
  const getAvailabilityText = (availability) => {
    switch (availability) {
      case '1':
        return { text: '在庫あり', color: 'blue' };
      case '2':
        return { text: '通常３〜７日程度で発送', color: 'blue' };
      case '3':
        return { text: '通常３〜９日程度で発送', color: 'blue' };
      case '4':
        return { text: 'メーカー取り寄せ', color: 'blue' };
      case '5':
        return { text: '予約受付中', color: 'blue' };
      case '6':
        return { text: 'メーカーに在庫確認', color: 'blue' };
      default:
        return { text: '不明', color: 'red' };
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
      <img style={{height:'250px'}} src={book.Item.largeImageUrl} alt="本の画像" />
            <h1>{book.Item.title}</h1>
            <p style={{fontSize:'18px'}}>著者名: {book.Item.author}</p>
            <p style={{ fontSize: '20px'}}>価格: <span style={{color:'red'}}>{book.Item.itemPrice}円</span></p>
            <p style={{fontSize:'20px'}}>商品説明: {book.Item.itemCaption}</p>
            <p style={{ fontSize: '20px', color: getAvailabilityText(book.Item.availability).color }}>
                <span style={{ color: 'black' }}>在庫状況:</span>{getAvailabilityText(book.Item.availability).text}
                </p>
            <p style={{fontSize:'20px'}}>出版日: {book.Item.salesDate}</p>
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

