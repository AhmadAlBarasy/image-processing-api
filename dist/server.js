"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const apiRouter_1 = __importDefault(require("./routes/apiRouter"));
const PORT = process.env.PORT || 80;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
app.use('/api', apiRouter_1.default);
