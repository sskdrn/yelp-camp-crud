const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });


module.exports.newCampground = async (req, res) => {
    res.render('campgrounds/new_campground.ejs')
};

module.exports.createCampground = async (req, res) => {
    const campground = new Campground({
        title: req.body.title,
        price: req.body.price,
        location: req.body.location,
        description: req.body.description,
        image: req.body.image,
        author: req.user._id
    });
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    campground.geometry = geoData.body.features[0].geometry;
    campground.images=req.files.map(file => ({url:file.path, filename: file.filename}));
    await campground.save();
    req.flash('success','Successfully created new campground!');
    res.redirect('/');
};

module.exports.editCampground = async (req, res) => {
    res.render('campgrounds/edit_campground.ejs', { campground: await Campground.findById(req.params.id) })
};

module.exports.updateCampground = async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        price: req.body.price,
        location: req.body.location,
        description: req.body.description,
        image: req.body.image
    });

    const geoData = await geocoder.forwardGeocode({
        query: req.campground.location,
        limit: 1
    }).send()
    campground.geometry = geoData.body.features[0].geometry;
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Successfully updated campground!')
    res.redirect('/');

};

module.exports.viewCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error','Campground not found');
        return res.redirect('/');
    }
    res.render('campgrounds/info.ejs', { campground: campground })
};

module.exports.getCampgrounds = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds: campgrounds });
}

module.exports.deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/');
};