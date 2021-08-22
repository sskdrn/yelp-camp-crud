const User = require('../models/user');
module.exports.renderRegisterForm =(req, res) => {
    res.render('users/register');
}

module.exports.createUser = async (req,res,next)=>{
    try{
        const {username,email,password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err)
            next(err);
            else{
                req.flash('success', 'Welcome to Yelp Camp!');
                res.redirect('/')
            }
        })  
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
    
};

module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login');
};

module.exports.loginUser = (req,res,next)=>{
    req.flash=('success','Welcome back!!!');    
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports .logoutUser = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
};