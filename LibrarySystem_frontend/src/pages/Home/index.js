import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { Button } from 'antd';
import Pagination from '~/components/Pagination';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '~/components/cookies/cookieHelper';
const cx = classNames.bind(styles);

const BOOKS_PER_PAGE = 20;

function Home() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://librarysystem-backend.onrender.com/api/v1/allBook')
      .then(response => response.json())
      .then(data => setBooks(data || []))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  const convertToSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')  
      .replace(/\s+/g, '-')           
      .trim();
  };

  const indexOfLastBook = currentPage * BOOKS_PER_PAGE;
  const indexOfFirstBook = indexOfLastBook - BOOKS_PER_PAGE;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / BOOKS_PER_PAGE);

  const handleRegister = (bookId) => {
    console.log("BookID đăng ký:", bookId)

    const token = getCookie('jwt');
    if (!token) {
      alert('Bạn cần đăng nhập để mượn sách.');
      navigate('/login')
      return
    }
    fetch('https://librarysystem-backend.onrender.com/api/v1/borrow', {
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
      .then(data => {
        alert('Đăng ký thành công!');
        fetch('https://librarysystem-backend.onrender.com/api/v1/allBook?genre')
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
    <div className={cx('home')}>
      <h2>Thư Viện Trường Đại Hoc Thăng Long</h2>
      <div className={cx('book-list')}>
        {currentBooks.length > 0 ? (
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

export default Home;
