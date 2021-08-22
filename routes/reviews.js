const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router=express.Router({mergeParams:true})
const reviews = require('../controllers/reviews')
const {validateReview,isAuthor,isLoggedIn,isReviewAuthor} = require('../middleware')

router.post('/',isLoggedIn,validateReview,catchAsync(reviews.addReview));
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

router.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error.ejs', { err })
})

module.exports=router;