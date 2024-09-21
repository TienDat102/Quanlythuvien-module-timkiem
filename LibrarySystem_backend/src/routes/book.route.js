const express = require('express')
const { getAllBooks, getSingleBook } = require('../controller/books')
const router = express.Router();
const { getRecommend } = require('../controller/getRecommend')
const auth = require('../middlewares/authMiddleware');

router.get('/allBook', getAllBooks)
    .get('/recommend/:id', auth, getRecommend);

module.exports = router