// pages/api/search.js

import axios from 'axios';
import { getISBN } from './utils';

export default async function handler(req, res) {
  const { keyword, library } = req.query;

  try {
    const googleBooksResponse = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(keyword)}&maxResults=30`
    );

    const booksData = googleBooksResponse.data.items.map((book) => {
      const volumeInfo = book.volumeInfo || {};
      const industryIdentifiers = volumeInfo.industryIdentifiers || [];

      return {
        id: book.id,
        title: volumeInfo.title || 'No Title',
        authors: volumeInfo.authors?.join(', ') || 'Unknown Author',
        availability: industryIdentifiers.find((id) => id.type === 'ISBN_13')?.identifier || '',
      };
    });

    const isbns = await Promise.all(
      booksData.map(async (book) => {
        const identifier = book.availability;
        if (identifier) {
          return identifier;
        } else {
          return await getISBN(book.id);
        }
      })
    );

    const finalData = booksData.map((book, index) => ({
      ...book,
      availability: isbns[index],
    }));

    res.json(finalData);
  } catch (error) {
    console.error('検索エラー:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}