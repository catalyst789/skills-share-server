const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: String,
    courseImage:String,
    couseDescription:String,
    subscribers:[{type: mongoose.Schema.Types.ObjectId, ref:'user'}],
    author:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
}, {timeStamps:true});

module.exports = mongoose.model('course', courseSchema);