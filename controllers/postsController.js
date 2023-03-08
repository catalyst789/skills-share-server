const Post = require('../model/postSchema');
const User = require('../model/userSchema');
const { validationResult } = require('express-validator');

// const upload = require('../routes/utility/multimedia').single('avatar');


// POST / PostsHomePageController
exports.PostsHomePageController = (req, res, next) => {
    res.status(200).json({message: 'Hello from skill Share posts'})
};

// POST /createpost CreatePostController
exports.CreatePostController = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(406).json(errors.errors);

    const { postText } = req.body;
    const newPost = new Post({ postText });
    User.findOne({username: req.user.username})
    .then( loggedInUser => {
        newPost.postedBy = loggedInUser;
        loggedInUser.posts.push(newPost);
        loggedInUser.save().then( () => {
            newPost.save()
            .then( () => res.status(201).json({message: 'New Post Created'}))
            .catch( err => res.status(500).json({error:"Internal server Error", err}));
        })
    }).catch( err => res.status(500).json({error:"Internal server Error", err}))

};


// GET /profile ProfileController
exports.ProfileController = (req, res, next) => {
    User.findOne({username: req.user.username})
    .populate('posts')
    .exec( (err, user) => {
        res.status(200).json({message: ` ${user.username}'s Recent Posts` ,posts: user.posts});
    })

};


// GET /timeline TimelineController
exports.TimelineController = (req, res, next) => {
    console.log("TimelineController");
    Post.find()
    .populate("postedBy")
    .exec( (err, posts) => {
        res.status(200).json({message: "All Recent Posts", posts});
    })

};

// POST //like/:id LikePostController
exports.LikePostController = (req, res, next) => {
    Post.findOne({_id:req.params.id})
        .then( postToBeLiked => {
            User.findOne({username:req.user.username})
                .then( loggedInUser => {
                    if(postToBeLiked.likes.indexOf(loggedInUser._id) === -1){
                        postToBeLiked.likes.push(loggedInUser._id);
                        if(postToBeLiked.dislikes.indexOf(loggedInUser._id) !== -1){
                            let userIndex = postToBeLiked.dislikes.indexOf(loggedInUser._id);
                            postToBeLiked.dislikes.splice(userIndex, 1);
                        }
                    } else{
                        let userIndex = postToBeLiked.likes.indexOf(loggedInUser._id);
                        postToBeLiked.likes.splice(userIndex, 1);
                    }
                    postToBeLiked.save()
                        .then( () => res.status(200).json({message: `${loggedInUser.username} liked a Post`}))
                        .catch( err => res.status(500).json({error:"Internal server Error", err}))
                })
                .catch( err => res.status(500).json({error:"Internal server Error", err}))
        })
        .catch( err => res.status(500).json({error:"Internal server Error", err}))

};

// POST //dislike/:id TimelineController
exports.DislikePostController = (req, res, next) => {
    Post.findOne({_id:req.params.id})
    .then( postToBeDisliked => {
        User.findOne({username:req.user.username})
            .then( loggedInUser => {
                if(postToBeDisliked.dislikes.indexOf(loggedInUser._id) === -1){
                    postToBeDisliked.dislikes.push(loggedInUser._id);
                    if(postToBeDisliked.likes.indexOf(loggedInUser._id) !== -1){
                        let userIndex = postToBeDisliked.likes.indexOf(loggedInUser._id);
                        postToBeDisliked.likes.splice(userIndex, 1);
                    }
                } else{
                    let userIndex = postToBeDisliked.dislikes.indexOf(loggedInUser._id);
                    postToBeDisliked.dislikes.splice(userIndex, 1);
                }
                postToBeDisliked.save()
                    .then( () => res.status(200).json({message: `${loggedInUser.username} disliked a Post`}))
            })
    })
};



// POST //deletePost/:id DeletePostController
exports.DeletePostController = (req, res, next) => {
    Post.findOneAndDelete({_id:req.params.id})
        .then( (updation) => {
            User.findOne({username: req.user.username})
                .then( loggedInUser => {
                    loggedInUser.posts.splice(indexOf(req.params.id), 1);
                })
                loggedInUser.save(savedLoggedUser => {
                    const token = jwt.sign({user:savedLoggedUser}, process.env.JWT_SECRET_KEY, { expiresIn: 3600000 });
                    req.header('auth-token', token)
                    res.status(200).json({message: `Welcome, ${savedLoggedUser.username}, Your Post Deleted, User Referesed`, token})
                })
        })
        .catch( err => res.status(500).json({error:"Internal server Error", err}))

};

// POST //updatePost/:id UpdatePostController
exports.UpdatePostController = (req, res, next) => {
    Post.findOne({_id:req.params.id})
    .then( postToBeUpdated => {
        User.findOne({username:req.user.username})
            .then( loggedInUser => {
                if(loggedInUser.posts.indexOf(postToBeUpdated._id) === -1) return res.status(401).json({message:"Yeah na tere na tere baap ki post hai bc"});

                postToBeUpdated.postText = req.body.postText;
                postToBeUpdated.save()
                    .then( () => res.status(200).json({message: `${loggedInUser.username} updated their Post`}))
            })
    })

};
