var express = require('express');
var router = express.Router();
const { check } = require('express-validator');
const { isLoggedIn } = require('./utility/verifyToken');
const {
    HomePageController,
    SignUpController,
    SignInController,
    EditProfileController,
    ChangePasswordController,
    ForgotPasswordController,
    DeleteAccountController,
    UploadProfilePicController,
    ViewSubscribtionsController
} = require('../controllers/userControllers');

/**
 * @route POST /usesr
 * @desc Testing route
 * @access Public
 */
router.post('/', isLoggedIn, HomePageController);

/**
 * @route POST /signup
 * @desc let the user Register
 * @access Public
 */
router.post('/signup', [
     check('username', 'Username must have at least 4 Characters, spaces are not allowed').isLength({min: 4}).matches(/^[\S]+$/),
     check('email', 'Invalid Email Address').isEmail(),
     check('password', 'Password must have at least 6 characters').isLength({min: 6})
 ], SignUpController);



/**
 * @route POST /signin
 * @desc let the user login
 * @access Public
 */
router.post('/signin', SignInController);


/**
 * @route POST /editProfile
 * @desc let the user edit his/her profile
 * @access Private
 */
router.post('/editprofile',[
    check('username', 'Username must have at least 4 Characters, spaces are not allowed').isLength({min: 4}).matches(/^[\S]+$/),
    check('email', 'Invalid Email Address').isEmail(),
    check('name', 'Name must be at least 4 characters').isLength({min: 4}),
    check('address', 'Address must be at least 8 characters').isLength({min: 8}),
    check('about', 'About must be at least 15 characters').isLength({min: 15}),
    check('contact', 'Enter a valid Mobile Number').isMobilePhone(),
    ], isLoggedIn, EditProfileController);




/**
 * @route POST /changepassword
 * @desc let the user Change their password
 * @access Private
 */
router.post('/changepassword',[ check('newPassword', 'Password must have at least 6 characters').isLength({min: 6})], isLoggedIn, ChangePasswordController);


/**
 * @route POST /forgotpassword
 * @desc if user forgot his/her password, then it can be recovered in this route
 * @access Public
 */
router.post('/forgotpassword',[check('email', 'Invalid Email Address').isEmail(),
], ForgotPasswordController);


/**
 * @route POST /deleteaccount
 * @desc if user wants to delte his/her account
 * @access Private
 */
router.post('/deleteaccount', isLoggedIn, DeleteAccountController);


 /**
 * @route POST /uploadprofilepic
 * @desc User can change their profile picture in this route
 * @access Private
 */
router.post('/uploadprofilepic', isLoggedIn, UploadProfilePicController);




 


module.exports = router;
