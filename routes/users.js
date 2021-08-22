const express=require('express');
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema,reviewSchema}=require('../schemas')
const {ExpressError} = require('../utils/ExpressError')
const User = require('../models/user');
const users = require('../controllers/users')
const passport = require('passport');

router.route('/register')
    .get(users.renderRegisterForm)
    .post( catchAsync(users.createUser))

router.route('/login')
    .get(users.renderLoginForm )
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),users.loginUser);


router.get('/logout',users.logoutUser )

module.exports=router;