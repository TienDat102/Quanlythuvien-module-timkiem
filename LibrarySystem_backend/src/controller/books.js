const Books = require('../models/Books');

const getAllBooks = async (req, res) => {
    try {
        // Lấy tham số từ query string
        const { search, genre ,subcategory } = req.query;
        // Tạo đối tượng lọc
        const filter = {};
        // Thêm điều kiện lọc theo genre nếu có
        if (genre) {
            filter.genre = genre;
        }
        if (subcategory) {
            filter.subcategory = subcategory;
        }
        // Thêm điều kiện lọc theo search nếu có
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } }, 
                { author: { $regex: search, $options: 'i' } } , 
                { subcategory: { $regex: search, $options: 'i' } }  
            ];
        }
        // Lấy sách từ cơ sở dữ liệu với filter nếu có
        const allBook = await Books.find(filter);

        res.send(allBook);
    } catch (error) {
        console.log(error);
        return res.send({ message: "something is wrong", success: false });
    }
};

const getSingleBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await Books.findById(bookId);
        res.send(book);
    } catch (error) {
        console.log(error);
        return res.send({ message: "something is wrong", success: false });
    }
};

module.exports = { getAllBooks, getSingleBook };
