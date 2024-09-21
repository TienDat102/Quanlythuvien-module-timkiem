import classNames from 'classnames/bind';
import styles from './SearchBar.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function SearchBar({ data }) {
    // Hàm chuyển đổi title thành slug
    const convertToSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')  
            .replace(/\s+/g, '-')           
            .trim();
    };

    if (!data) {
        return null;  
    }

    return (
        <Link to={`/book/${convertToSlug(data.title)}`} className={cx('wrapper')}>
            <img
                className={cx('cover')}
                src={data.cover_url}
                alt={data.title}
            />
            <div className={cx('info')}>
                <h4 className={cx('namebook')}>
                    <span>{data.title}</span>
                </h4>
                <span className={cx('author')}>{data.author}</span>
            </div>
        </Link>
    );
}

export default SearchBar;
