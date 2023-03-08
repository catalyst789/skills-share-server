const User = require('../model/userSchema');
const Course = require('../model/courseSchema');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const upload = require('../routes/utility/multimedia').single('avatar');


// POST / HomePageController
exports.HomePageController = (req, res, next) => {
    res.status(200).json({message: 'Hello from skill Share'})
};

// POST /signup SignUpController
exports.SignUpController = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(406).json(errors.errors);
    
    const { username, email, password } = req.body;
    const newUser = new User({username, email, password});

    User.findOne({username})
    .then( user => {
        if(user) return res.status(302).json({message: 'User already Exists'});
        bcrypt.genSalt(10, (err, salt)=> {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash; 
                newUser.save()
                .then( user => res.status(201).json({message: 'New User Created', user}))
                .catch( err => res.status(500).json({error: 'Internal Server problem', err}));
            })
        });
    })
    .catch( err => res.status(500).json({Error: 'Internal Server problem', err}));
};





// POST /signin SignInController
exports.SignInController = (req, res, next) => {    
    const { username, password } = req.body;

    User.findOne({username})
    .then( user => {

        if(!user) return res.status(401).json({message: 'User Not Exists'});

        bcrypt.compare(password, user.password)
            .then( isMatch => {
                    if(!isMatch) return res.status(501).json({message: 'Wrong Username or Password Entered'});
                    const token = jwt.sign({user}, process.env.JWT_SECRET_KEY, { expiresIn: 3600000 });
                    req.header('auth-token', token)
                    res.status(200).json({message: `Welcome, ${user.username}, you are Successfully Logged In`, token})
            })
            .catch( err => res.status(500).json({error:err}));
    })
    .catch( err => res.status(500).json({Error: 'Internal Server problem', err}));
};


// POST /editprofile EditProfileController
exports.EditProfileController = (req, res, next) => {    
    const { username, email, name, gender, address, contact, about } = req.body;
    const updatedUser = { username, email, name, gender, address, contact, about }

    User.findOneAndUpdate({username:req.user.username},
        {$set:updatedUser},
        {new:true, useFindAndModify:false}
        )
    .then( user => {
        const token = jwt.sign({user}, process.env.JWT_SECRET_KEY, { expiresIn: 3600000 });
        req.header('auth-token', token)
        res.status(200).json({message: `Welcome, ${user.username}, You have updated your Details`, token})
    })
    .catch( err => res.status(500).json({Error: 'Internal Server problem', err}));
};


// POST /changepassword EditProfileController
exports.ChangePasswordController = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(406).json(errors.errors);

    const { oldPassword, newPassword } = req.body;

    User.findOne({username:req.user.username})
    .then( user => {
        if(!user) return res.status(401).json({message: 'User Not Found'});
        bcrypt.compare(oldPassword, user.password)
            .then( isMatch => {
                    if(!isMatch) return res.status(203).json({message: 'Old Password Incorrect!'});
                    bcrypt.genSalt(10, (err, salt)=> {
                        bcrypt.hash(newPassword, salt, (err, hash) => {
                            if(err) throw err;
                            user.password = hash;
                            user.save()
                            .then( user => res.status(201).json({message: 'Successfully Changed Password', user}))
                            .catch( err => res.status(500).json({error: 'Internal Server problem', err}));
                        })
                    });
                    
            })
            .catch( err => res.status(500).json({error:err}));
    })
    .catch( err => res.status(500).json({Error: 'Internal Server problem', err}));

};




// POST /forgotpassword ForgotPasswordController
exports.ForgotPasswordController = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(406).json(errors.errors);

   let password =  Math.floor(Math.random()*(999999999-100000+1)+100000);
   
    User.findOne({email:req.body.email})
    .then( user => {
        if(!user) return res.status(401).json({message: 'User Not Found'});

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'raajk0338@gmail.com',
                pass: 'raajkumar8475949605'
            }
        });

        const mailOptions = {
            from: '"skilll share Pvt. Ltd." <skillsshare@info.com>',
            to: req.body.email.trim(),
            subject: "Auto Generated Passoword",
            text: `Your Temporary password for login is: ${password}.`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if(error) return res.status(500).json({error: 'Internal Server Problem', error});

            bcrypt.genSalt(10, (err, salt)=> {
                bcrypt.hash(password.toString(), salt, (err, hash) => {
                    if(err) throw err;
                    user.password = hash;
                    user.save()
                    .then( user => res.status(201).json({message: 'Password Recovered Sucessfuly, Check your email'}))
                    .catch( error => res.status(500).json({message: 'Internal Server problem', error}));
                })
            });
        })
    })
    .catch( err => res.status(500).json({Error: 'Internal Server problem', err}));

};

// POST /deleteaccount DeleteAccountController
exports.DeleteAccountController = (req, res, next) => {    

    User.findOneAndDelete({username:req.user.username})
    .then( deletedAccount => {
        res.status(200).json({message: `${req.user.username} account has been delted`, deletedAccount});
    })
    .catch( err => res.status(500).json({Error: 'Internal Server problem', err}));
};



// POST /uploadprofilepic UploadProfilePicController
exports.UploadProfilePicController = (req, res, next) => {    

    upload(req, res, (err) => {
        if(err) throw err;
        // if(req.body.oldavatar !== 'default.png'){
        //     fs.unlinkSync(path.join(__dirname, '..', 'public', 'images', 'uploads', req.body.oldavatar))
        // }
        User.findOne({username:req.user.username})
        .then( user => {
            user.avatar = req.file.filename;
            user.save()
                .then(savedImagedUser => {
                    const token = jwt.sign({user: savedImagedUser}, process.env.JWT_SECRET_KEY, { expiresIn: 3600000 });
                    req.header('auth-token', token)
                    res.status(200).json({message: `Hey, ${user.username}, You have updated your Profile pic`, token})
                })
                .catch(err => res.status(500).json({Error: 'Internal Server problem', err}));
        })
        .catch( err => res.status(500).json({Error: 'Internal Server problem', err}));
    })

};




