"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const APIError_1 = __importDefault(require("../utils/APIError"));
const fileNameValidator_1 = __importDefault(require("../utils/fileNameValidator"));
const supportedFile = (fileName) => {
    const supportedTypes = /\.(png|jpeg)$/i;
    return supportedTypes.test(fileName);
};
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public');
    },
    filename: function (req, file, cb) {
        if (!supportedFile(path_1.default.extname(file.originalname))) // checking for file type, if it's not supported, return an error.
            return cb(new APIError_1.default("Image type not supported", 400), '');
        if (!(0, fileNameValidator_1.default)(file.originalname))
            return cb(new APIError_1.default('Invalid file name', 400), '');
        cb(null, `${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 4000000 // 4 MB limit for file size.
    }
});
const uploadFile = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (!req.file) {
            next(new APIError_1.default('no file provided', 400));
        }
        if (err instanceof multer_1.default.MulterError) {
            next(err);
        }
        else if (err) {
            next(err);
        }
        else {
            next();
        }
    });
};
exports.default = uploadFile;
