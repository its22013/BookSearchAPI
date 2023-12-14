// pages/api/utils.js

import axios from 'axios';

export async function getISBN(bookId) {
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
    const volumeInfo = response.data.volumeInfo;
    const industryIdentifiers = volumeInfo.industryIdentifiers;
    const isbnIdentifier = industryIdentifiers.find((identifier) => identifier.type === 'ISBN_13');

    return isbnIdentifier ? isbnIdentifier.identifier : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}