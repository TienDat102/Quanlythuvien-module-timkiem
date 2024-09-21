import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './SideList.module.scss';
import { Button } from 'antd';

const cx = classNames.bind(styles);

function SideList() {
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ API để lấy danh sách các subcategory
    fetch('https://librarysystem-backend.onrender.com/api/v1/allBook')
      .then(response => response.json())
      .then(data => {
        const uniqueSubcategories = [...new Set(data.map(book => book.subcategory))];
        setSubcategories(uniqueSubcategories);
      })
      .catch(error => console.error('Error fetching subcategories:', error));
  }, []);

  return (
    <div className={cx('side-list')}>
      <h3>Thể loại</h3>
      <ul>
        {subcategories.map((subcategory, index) => (
          <li key={index}>
            <Link to={`/result?subcategory=${encodeURIComponent(subcategory)}`}>
              <Button>{subcategory}</Button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideList;
