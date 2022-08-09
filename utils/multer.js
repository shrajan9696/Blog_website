

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });

const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req,file,cb)=>{
    let ext = path.extname(file.originalname);
    if(ext!==".jpg" && ext!==".png"){
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null , true);
  },
});
