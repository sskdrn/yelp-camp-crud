const express=require('express');
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema,reviewSchema}=require('../schemas')
const {ExpressError} = require('../utils/ExpressError')
const campgrounds = require('../controllers/campground');
const {isLoggedIn} = require('../middleware')
const {validateCampground,isAuthor} = require('../middleware')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })



router.route('/new')
    .get(isLoggedIn , catchAsync(campgrounds.newCampground))
    .post(isLoggedIn,upload.array('image'), validateCampground , catchAsync(campgrounds.createCampground));

router.route('/edit/:id')
    .get(isLoggedIn, catchAsync(campgrounds.editCampground))
    .patch(isLoggedIn,upload.array('image'), isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));


router.delete('/:id',isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


router.get('/:id', catchAsync(campgrounds.viewCampground))

router.get('/', catchAsync(campgrounds.getCampgrounds))

router.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error.ejs', { err })
})
module.exports=router;