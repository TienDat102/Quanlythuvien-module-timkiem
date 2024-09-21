// src/components/cookies/cookieHelper.js
import Cookies from 'js-cookie';

// Hàm lấy cookie
export function getCookie(cname) {
    return Cookies.get(cname);
}

// Hàm tạo cookie
export const setCookie = (name, value, options = {}) => {
    let expires = options.expires;

    if (typeof expires === 'number') {
        const date = new Date();
        date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000)); 
        expires = date.toUTCString();
    }

    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=None; Secure`;
};

// Hàm xóa cookie
export const deleteCookie = (cname) => {
    document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};


// Hàm xóa tất cả cookie
export function deleteAllCookies() {
    const cookies = Cookies.get(); // Lấy tất cả cookies
    Object.keys(cookies).forEach(cookie => {
        Cookies.remove(cookie);
    });
}
