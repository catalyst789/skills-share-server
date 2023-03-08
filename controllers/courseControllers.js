const Course = require('../model/courseSchema');
const User = require('../model/userSchema');
const { validationResult } = require('express-validator');

const upload = require('../routes/utility/multimedia').single('courseImage');


// GET / CourseHomePageController
exports.CourseHomePageController = (req, res, next) => {
    Course.find()
        .then( allCourses => {res.status(200).json({message: 'All Courses', allCourses})})
        .catch( err => res.status(500).json({error: 'Internal Server Error', err}));
};




// POST /createCourse CreateCourseController
exports.CreateCourseController = (req, res, next) => {

    const { courseName, couseDescription } = req.body;
    const newCourse = new Course({ courseName, couseDescription });
    User.findOne({username: req.user.username})
    .then( loggedInUser => {
        newCourse.author = loggedInUser;
        loggedInUser.courses.push(newCourse);
        loggedInUser.save().then( () => {
            newCourse.save()
            .then( () => res.status(201).json({message: `${loggedInUser.username} Created a New Course, Success`}))
        })
    })
};


// POST /subscribe/:id SubscribeCourseController
exports.SubscribeCourseController = (req, res, next) => {
    Course.findOne({_id:req.params.id})
        .then( courseFound => {
            User.findOne({username:req.user.username})
                .then( loggedInUser => {
                    if( loggedInUser.subscribedCourses.indexOf(courseFound._id) && courseFound.subscribers.indexOf(loggedInUser._id) === -1 ){
                        loggedInUser.subscribedCourses.push(courseFound._id);
                        courseFound.subscribers.push(loggedInUser._id);
                    } else{
                        let courseIndex = loggedInUser.subscribedCourses.indexOf(courseFound._id);
                        let userIndex =  courseFound.subscribers.indexOf(loggedInUser._id);
                        loggedInUser.subscribedCourses.splice(courseIndex, 1);
                        courseFound.subscribers.splice(userIndex, 1);
                    }
                
                        loggedInUser.save().then( (savedUser) => {
                            courseFound.save().then( (savedCourse) => res.status(200).json({message: `${savedUser.username} has subscribed a couse of ${savedCourse.courseName}`}))
                        })
                })
        })

};




