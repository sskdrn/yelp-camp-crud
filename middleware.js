
const { campgroundSchema, reviewSchema } = require('./schemas');
const Review = require('./models/review')
const Campground = require('./models/campground')
const { ExpressError } = require('./utils/ExpressError')
const User = require('./models/user')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Please sign in to continue');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    console.log(req.user._id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the necessary permissions to perform this action.')
        res.redirect(`/campgrounds/${id}`);
    }
    else
        next();


}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the necessary permissions to perform this action.')
        res.redirect(`/campgrounds/${id}`);
    }
    else
        next();

}
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const rev = { rating: req.body.rating, body: req.body.body };

    const { error } = reviewSchema.validate(rev);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}