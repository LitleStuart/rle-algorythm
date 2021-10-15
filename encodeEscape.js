const { getNumbers } = require("./getNumbers");

const MAX_UNICODE = 255;
const ENCODED_STRING_MIN_LENGTH = 4;
const SHIFT = ENCODED_STRING_MIN_LENGTH;

function encodeEscape(result) {
    return result.reduce((str, { char, count }) => {
        if (char == "#") {
            return str + encodeSharpSymbol(count);
        } else {
            return str + encodeSubstring(count, char);
        }
    }, "");
}

function encodeSubstring(count, char) {
    return getNumbers(MAX_UNICODE + SHIFT, count).reduce((res, n) => {
        if (n < SHIFT) {
            return res + char.repeat(n);
        }
        return res + `#${String.fromCharCode(n - SHIFT)}${char}`;
    }, "");
}

function encodeSharpSymbol(count) {
    return getNumbers(MAX_UNICODE + 1, count).reduce(
        (res, n) => res + `#${String.fromCharCode(n - 1)}#`,
        ""
    );
}

exports.encodeEscape = encodeEscape;