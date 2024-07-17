"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileUpload_1 = __importDefault(require("../middlewares/fileUpload"));
const errorController_1 = __importDefault(require("../controllers/errorController"));
const apiController_1 = require("../controllers/apiController");
const apiRouter = express_1.default.Router();
apiRouter.route('/upload').post(fileUpload_1.default, apiController_1.imageUploadedSuccessfully);
apiRouter.route('/crop').post(apiController_1.imageCropController);
apiRouter.route('/resize').post(apiController_1.imageResizeController);
apiRouter.route('/blur').post(apiController_1.imageBlurController);
apiRouter.route('/download').get(apiController_1.downloadImage);
apiRouter.route('/delete').delete(apiController_1.deleteImage);
apiRouter.route('/').get(apiController_1.listAllFiles);
apiRouter.route('*').all(apiController_1.methodNotSupported);
apiRouter.use(errorController_1.default);
exports.default = apiRouter;
