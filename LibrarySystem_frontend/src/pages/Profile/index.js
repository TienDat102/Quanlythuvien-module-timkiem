import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Profile.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '~/components/cookies/cookieHelper';

const cx = classNames.bind(styles);

function Profile() {
  const { id } = useParams(); 
  const [book, setBooks] = useState(null);
  const navigate = useNavigate();

  const convertToSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')  
      .replace(/\s+/g, '-')           
      .trim();
  };

  useEffect(() => {
    axios.get('https://librarysystem-backend.onrender.com/api/v1/allBook')
      .then((response) => {
        const allBooks = response.data || [];
        const foundBook = allBooks.find((book) => convertToSlug(book.title) === id);
        if (!foundBook) {
          console.error('Book not found with slug:', id);
        }
        setBooks(foundBook);
      })
      .catch(error => {
        console.error('Error fetching book data:', error);
      });
  }, [id]);

  const handleRegister = (bookId) => {
    console.log("BookID đăng ký:", bookId);

    const token = getCookie('jwt');
    if (!token) {
      alert('Bạn cần đăng nhập để mượn sách.');
      navigate('/login');
      return;
    }

    fetch(`https://librarysystem-backend.onrender.com/api/v1/borrow`, {
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
        return axios.get('https://librarysystem-backend.onrender.com/api/v1/allBook')
          .then((response) => {
            const allBooks = response.data || [];
            const foundBook = allBooks.find((book) => convertToSlug(book.title) === id);
            setBooks(foundBook);
          })
          .catch(error => console.error('Error fetching updated book data:', error));
      })
      .catch(error => {
        alert('Đăng ký không thành công.');
        console.error('Error updating book:', error);
      });
  };

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div className={cx('profile')}>
      <h1 className={cx('title')}>{book.title}</h1>
      <img className={cx('cover')} src={book.cover_url} alt={book.title} />
      <p className={cx('author')}><strong>Tác giả:</strong> {book.author}</p>
      <p className={cx('publish-year')}><strong>Năm xuất bản:</strong> {book.publish_year}</p>
      <p className={cx('subcategory')}><strong>Thể loại:</strong> {book.subcategory}</p>
      <div className={cx('button-book')}>
        <Button outline onClick={() => handleRegister(book._id)}>Đăng ký</Button>
      </div>
    </div>
  );
}

export default Profile;
