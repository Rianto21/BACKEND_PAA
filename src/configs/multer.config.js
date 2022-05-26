const multer = require("multer");
const path = require("path");
const imageStorage = multer.diskStorage({
    destination: "./.temp",
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + path.extname(file.originalname));
    },
});

const env = process.env;
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1024 * 1024 * 10, // 1mb * 10,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error("Invalid Image"));
        }
        cb(null, true);
    },
}).array(env.IMAGE_FIELD);

module.exports = {
    imageUpload,
};
