const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postText:String,
    likes: [ {type: mongoose.Schema.Types.ObjectId, ref: 'user'} ],
    dislikes: [ {type: mongoose.Schema.Types.ObjectId, ref: 'user'}] ,
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}, {timestamps:true});

module.exports = mongoose.model('post', postSchema);