var express = require('express');
var router = express.Router();
const { check } = require('express-validator');
const { isLoggedIn } = require('./utility/verifyToken');
const {
    PostsHomePageController,
    TimelineController,
    ProfileController,
    CreatePostController,
    LikePostController,
    DislikePostController,
    UpdatePostController,
    DeletePostController
} = require('../controllers/postsController');

/**
 * @route POST /
 * @desc Testing route
 * @access Private
 */
router.post('/', isLoggedIn, PostsHomePageController);


/**
 * @route POST /createpost
 * @desc user can see their profile
 * @access Private
 */
router.post('/createpost',[ check('postText', 'Posts must have at least 10 characters').isLength({min: 10})], isLoggedIn, CreatePostController);



/**
 * @route GET /profile
 * @desc user can see their profile
 * @access Private
 */
 router.get('/profile', isLoggedIn, ProfileController);


/**
 * @route GET /timeline
 * @desc view all the Posts
 * @access Private
 */
 router.get('/timeline', isLoggedIn, TimelineController);


/**
 * @route POST /like/:id
 * @desc let user like any Posts
 * @access Private
 */
 router.post('/like/:id', isLoggedIn, LikePostController);


/**
 * @route POST /dislike/:id
 * @desc let user dislike any Posts
 * @access Private
 */
 router.post('/dislike/:id', isLoggedIn, DislikePostController);

/**
 * @route POST /updatePost/:id
 * @desc let user update their Posts
 * @access Private
 */
 router.post('/updatePost/:id', isLoggedIn, UpdatePostController);

 /**
 * @route POST /deletePost/:id
 * @desc let user delete their Posts
 * @access Private
 */
  router.post('/deletePost/:id', isLoggedIn, DeletePostController);


module.exports = router;
