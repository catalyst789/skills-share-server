var express = require('express');
var router = express.Router();
const { check } = require('express-validator');
const { isLoggedIn } = require('./utility/verifyToken');
const {
    CourseHomePageController,
    CreateCourseController,
    SubscribeCourseController
} = require('../controllers/courseControllers');

/**
 * @route GET /
 * @desc Testing route
 * @access Private
 */
router.get('/', isLoggedIn, CourseHomePageController);


/**
 * @route POST /createCourse
 * @desc Let user create a course, so that other people can subscribe it
 * @access Private
 */
 router.post('/createCourse', isLoggedIn, CreateCourseController);


/**
 * @route POST /subscribe/:id
 * @desc Let user create a subscribe course, so that other people can Learn it.
 * @access Private
 */
 router.post('/subscribe/:id', isLoggedIn, SubscribeCourseController); 


 

module.exports = router;
