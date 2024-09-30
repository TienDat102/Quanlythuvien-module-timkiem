import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Result.module.scss';
import { Button } from 'antd';
import Pagination from '~/components/Pagination';
import { getCookie } from '~/components/cookies/cookieHelper';

const cx = classNames.bind(styles);

const BOOKS_PER_PAGE = 20;

function Result() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');
  const subcategory = searchParams.get('subcategory');
  const navigate = useNavigate();

  const convertToSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/v1/allBook?search=${encodeURIComponent(query || '')}&subcategory=${encodeURIComponent(subcategory || '')}`)
      .then(response => response.json())
      .then(data => setBooks(data || []))
      .catch(error => console.error('Error fetching books:', error))
      .finally(() => setLoading(false));
  }, [query, subcategory]);

  // Pagination
  const indexOfLastBook = currentPage * BOOKS_PER_PAGE;
  const indexOfFirstBook = indexOfLastBook - BOOKS_PER_PAGE;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / BOOKS_PER_PAGE);

  // Handle registration
  const handleRegister = (bookId) => {
    const token = getCookie('jwt');
    if (!token) {
      alert('Bạn cần đăng nhập để mượn sách.');
      navigate('/login');
      return;
    }

    fetch('http://localhost:5000/api/v1/borrow', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        bookId: bookId,
        borrowDate: new Date().toISOString(),
        returnDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString()
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert('Đăng ký thành công!');
        fetch(`http://localhost:5000/api/v1/allBook?search=${encodeURIComponent(query || '')}&subcategory=${encodeURIComponent(subcategory || '')}`)
          .then(response => response.json())
          .then(data => setBooks(data || []))
          .catch(error => console.error('Error fetching updated books:', error));
      })
      .catch(error => {
        alert('Đăng ký không thành công.');
        console.error('Error updating book:', error);
      });
  };

  return (
    <div className={cx('result')}>
      <h2>Kết Quả Tìm Kiếm{query ? ` Cho: "${query}"` : ''}{subcategory ? ` - Thể loại: "${subcategory}"` : ''}</h2>
      <div className={cx('book-list')}>
        {loading ? (
          <p>Loading...</p> 
        ) : currentBooks.length > 0 ? (
          currentBooks.map((book) => (
            <div className={cx('book-item')} key={book._id}>
              <Link to={`/book/${convertToSlug(book.title)}`} className={cx('book-wrapper')}>
                <img
                  className={cx('book-cover')}
                  src={book.cover_url}
                  alt={book.title}
                />
                <div className={cx('book-info')}>
                  <p className={cx('book-title')}>{book.title}</p>
                </div>
              </Link>
              <div className={cx('button-book')}>
                <Button onClick={() => handleRegister(book._id)}>Đăng ký</Button>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sách nào.</p>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Result;
