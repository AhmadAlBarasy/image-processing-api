"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notAllowedCharacters = /[\/\\?%*:|"<>]/;
const isValidFileName = (name) => {
    if (name.length === 0)
        return false;
    if (notAllowedCharacters.test(name))
        return false;
    const splittedString = name.split('.');
    if (splittedString.length < 2)
        return false;
    return true;
};
exports.default = isValidFileName;
