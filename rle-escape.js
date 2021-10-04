let fs = require("fs");

function serializeString(str) {
  const result = [];
  let char;
  let lastChar;
  let counter = 1;
  for (let i = 1; i < str.length; i++) {
    char = str[i];
    lastChar = str[i - 1];
    if (char == lastChar) {
      counter += 1;
    } else {
      result.push({ char: lastChar, count: counter });
      counter = 1;
    }
  }
  result.push({ char: char, count: counter });
  return result;
}

function encode(str) {
  const result = serializeString(str);
  const MAX_UNICODE = 255;
  const SHIFT = 4;
  let newString = "";

  result.forEach((element) => {
    let count = element.count;
    let char = element.char;
    if (char == "#") {
      for (let i = 0; i < Math.floor(count / (MAX_UNICODE + 1)); i++) {
        newString += "#" + String.fromCharCode(MAX_UNICODE) + "#";
        count -= MAX_UNICODE + 1;
      }
      if (count != 0) {
        newString += "#" + String.fromCharCode(count - 1) + "#";
      }
    } else {
      for (let i = 0; i < Math.floor(count / (MAX_UNICODE + SHIFT)); i++) {
        newString += "#" + String.fromCharCode(MAX_UNICODE) + char;
        count -= 259;
      }
      if (count < SHIFT) {
        newString += char.repeat(count);
      } else {
        newString += "#" + String.fromCharCode(count - SHIFT) + char;
      }
    }
  });
  return newString;
}

function decode(str) {
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

const str = fs.readFileSync(process.argv[3]).toString();

if (process.argv[2] == "encode") {
  const encodedStr = encode(str);
  fs.writeFileSync(process.argv[4], encodedStr);
}
if (process.argv[2] == "decode") {
  const decodedStr = decode(str);
  fs.writeFileSync(process.argv[4], decodedStr);
}
