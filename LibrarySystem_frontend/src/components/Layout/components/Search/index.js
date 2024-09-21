import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import HeadlessTippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import SearchBar from '~/components/SearchBar';
import styles from './Search.module.scss';
import { useDebounce } from '~/hooks';
import { useNavigate, useLocation } from 'react-router-dom'; 
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(true);
    const debounced = useDebounce(searchValue, 500);

    const inputRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();  

    // Xử lý tìm kiếm trong HeadlessTippy
    useEffect(() => {
        if (debounced.trim() === '') {
            setSearchResult([]);
            return;
        }
        fetch(`https://librarysystem-backend.onrender.com/api/v1/allBook?search=${encodeURIComponent(debounced)}&limit=4`)
            .then((res) => res.json())
            .then((res) => {
                console.log('Search results:', res); // Kiểm tra kết quả tìm kiếm
                setSearchResult(res.slice(0, 4)); // Giới hạn số lượng kết quả về 4
            })
            .catch((err) => console.error('Error fetching search results:', err));
    }, [debounced]);

    // Xử lý nút tìm kiếm
    const handleSearch = () => {
        console.log('Search value:', searchValue); // Kiểm tra giá trị nhập vào
        if (searchValue.trim()) {
            setShowResult(false); // Ẩn HeadlessTippy trước khi điều hướng
            navigate(`/result?query=${encodeURIComponent(searchValue)}`); // Sửa tham số query
        } else {
            inputRef.current.focus();
        }
    };

    // Ẩn HeadlessTippy khi URL thay đổi
    useEffect(() => {
        setShowResult(false);
    }, [location]);

    // Xử lý nút xóa
    const handleClear = () => {
        inputRef.current.focus();
        setSearchValue('');
    };

    const handleHideResult = () => {
        setShowResult(false);
    };

    return (
        <HeadlessTippy
            interactive
            visible={showResult && searchResult.length > 0}
            render={(attrs) => (
                <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                    <PopperWrapper>
                        <h4 className={cx('search-title')}>Kết quả</h4>
                        {searchResult.map((result) => (
                            <SearchBar key={result.id} data={result} />
                        ))}
                    </PopperWrapper>
                </div>
            )}
            onClickOutside={handleHideResult}
        >
            <div className={cx('search')}>
                <input
                    ref={inputRef}
                    value={searchValue}
                    placeholder="Nhập tên sách, tên tác giả..."
                    spellCheck={false}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setShowResult(true)}
                />
                {!!searchValue && (
                    <button className={cx('clear')} onClick={handleClear}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                )}
                <button className={cx('search-btn')} onClick={handleSearch}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>
        </HeadlessTippy>
    );
}

export default Search;
