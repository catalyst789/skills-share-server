const path = require('path');
const multer = require('multer');
const { extname } = require('path');

let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images/uploads');
    },
    filename: function(req, file, cb){
        let modifiedName = `skilllshareuserdp- ${Date.now() + path.extname(file.originalname)}`
        cb(null, modifiedName);
    }
});

let upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
        let fileType = /png|jpg|jpeg|gif|svg/;
        let mimeType = fileType.test(file.mimetype);
        let extName = fileType.test(path.extname(file.originalname).toLowerCase());
        if(mimeType && extName ) return cb(null, true);
        cb(`only ${fileType} are accepted!`);
    }
});

module.exports = upload;