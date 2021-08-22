const Review = require('../models/review')
const Campground = require('../models/campground');
module.exports.addReview = async (req,res)=>{

    let campground = await Campground.findById(req.params.id);
    let review=new Review({body:req.body.body,rating:req.body.rating, author:req.user._id});
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Successfully added the review!')
    res.redirect(`/campgrounds/${req.params.id}`)
        
};
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
};