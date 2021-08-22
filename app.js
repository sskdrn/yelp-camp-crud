if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const { ExpressError } = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const catchAsync = require('./utils/catchAsync')
const Campground = require('./models/campground')
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const helmet = require("helmet");
const MongoStore = require('connect-mongo');
const morgan = require('morgan');


const dbUrl = process.env.MONGODB_URL;
const secret = process.env.SECRET || 'thisbetterbeasecret';
const port = process.env.PORT || 3000;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

const sessionConfig = {
    store,
    name: 'yelpcamp',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 604800000,
        maxAge: 604800000
    }
}

store.on("error", error => {
    console.log("Session error", error);
})


app = express()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'static')));
app.engine('ejs', ejsMate);
app.use(session(sessionConfig));
app.use(flash());
app.use(mongoSanitize());
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));


mongoose.connect(dbUrl, { useFindAndModify: false, useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection to MongoDB successful.")
    })
    .catch(error => {
        console.log(error);
    });


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if (!(['/login', '/register', '/', '/favicon.ico', '/3'].includes(req.originalUrl))) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})

app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/', userRoutes);
app.get('/test', (req, res) => {
    res.render('test');
})
app.get('/', catchAsync(async (req, res) => {
    res.render('home.ejs')
}))

app.all('*', (req, res, next) => {
    error = new ExpressError('Page Not Found', 404);
    next(error);
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error.ejs', { err })
})



app.listen(port, () => {
    console.log("App is Ready!")
})