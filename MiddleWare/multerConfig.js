const multer=require('multer');
const path=require('path');
const fs=require('fs');


const storage=multer.diskStorage({
    destination:function (req,file,cb)
    {
        const dir="./uploads";
        if(!fs.existsSync(dir))
        {
            fs.mkdirSync(dir);
        }
        cb(null,dir);
    },
    filename:function (req,file,cb)
    {
        const uniquename=Date.now +'-'+ file.originalname;
        cb(null,uniquename);
    }
});
const fileFilter=function (req,file,cb)
{
    if (file.mimetype === 'application/pdf' && path.extname(file.originalname).toLowerCase() === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
}
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024*1024 },
  fileFilter
});

module.exports = upload;
