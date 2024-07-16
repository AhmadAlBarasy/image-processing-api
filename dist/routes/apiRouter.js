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
apiRouter.route('/').get(apiController_1.listAllFiles);
apiRouter.use(errorController_1.default);
exports.default = apiRouter;
