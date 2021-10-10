exports.encodeEscape = encodeEscape;

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
  let result = "";
  for (let i = 0; i < Math.floor(count / (MAX_UNICODE + SHIFT)); i++) {
    result += "#" + String.fromCharCode(MAX_UNICODE) + char;
  }
  if (count % (MAX_UNICODE + SHIFT) < SHIFT) {
    result += char.repeat(count % (MAX_UNICODE + SHIFT));
  } else {
    result +=
      "#" + String.fromCharCode((count % (MAX_UNICODE + SHIFT)) - SHIFT) + char;
  }
  return result;
}

function encodeSharpSymbol(count) {
  let result = "";
  for (let i = 0; i < Math.floor(count / (MAX_UNICODE + 1)); i++) {
    result += "#" + String.fromCharCode(MAX_UNICODE) + "#";
  }
  if (count % (MAX_UNICODE + 1) != 0) {
    result += "#" + String.fromCharCode((count % (MAX_UNICODE + 1)) - 1) + "#";
  }
  return result;
}

function encodeSharpSymbol2(count) {
  return `#${String.fromCharCode(count)}#`;
}
