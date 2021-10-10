function decodeEscape(str) {
  const SHIFT = 4;
  let newString = "";
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (char == "#") {
      let nextChar = str[i + 2];
      let count = str.charCodeAt(i + 1);
      if (nextChar == "#") {
        newString += nextChar.repeat(count + 1);
      } else {
        newString += nextChar.repeat(count + SHIFT);
      }
      i += 2;
    } else {
      newString += char;
    }
  }
  return newString;
}
exports.decodeEscape = decodeEscape;
