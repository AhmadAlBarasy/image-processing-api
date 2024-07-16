const notAllowedCharacters: RegExp = /[\/\\?%*:|"<>]/;

const isValidFileName = (name: string): boolean => {
    if (name.length === 0) return false;
    if (notAllowedCharacters.test(name)) return false;
    const splittedString: string[] = name.split('.');
    if (splittedString.length < 2) return false;
    return true;
};

export default isValidFileName;
