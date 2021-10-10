const fs = require("fs");
const { encodeEscape } = require("./encodeEscape");
const { encodeJump } = require("./encodeJump");

function AddNotRepeatChars(notRepeatChars, newString) {
  const MAX_UNICODE = 128;
  let counter = notRepeatChars.length;

  if (counter <= MAX_UNICODE) {
    newString +=
      String.fromCharCode(counter + MAX_UNICODE - 1) + notRepeatChars;
  } else {
    for (let i = 0; i <= Math.floor(counter / MAX_UNICODE); i++) {
      let nrc = notRepeatChars.substring(
        i * MAX_UNICODE,
        i == Math.floor(counter / MAX_UNICODE)
          ? (counter % MAX_UNICODE) + MAX_UNICODE * i
          : i * MAX_UNICODE + MAX_UNICODE
      );
      newString += String.fromCharCode(MAX_UNICODE - 1 + nrc.length) + nrc;
    }
  }
  return newString;
}
exports.AddNotRepeatChars = AddNotRepeatChars;

function AddRepeatChars(newString, lastChar, counter) {
  const MAX_UNICODE = 127;

  for (let i = 0; i <= Math.floor(counter / MAX_UNICODE); i++) {
    if (i == Math.floor(counter / MAX_UNICODE)) {
      if (counter % MAX_UNICODE == 1) {
        notRepeatChars += lastChar;
      } else {
        newString += String.fromCharCode(counter % MAX_UNICODE) + lastChar;
      }
    } else {
      newString += String.fromCharCode(MAX_UNICODE) + lastChar;
    }
  }
  return newString;
}
exports.AddRepeatChars = AddRepeatChars;

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

function decodeJump(str) {
  const MAX_UNICODE = 127;
  let newString = "";

  for (let i = 0; i < str.length; i++) {
    let index = str.charCodeAt(i);
    if (index <= MAX_UNICODE) {
      newString += str[i + 1].repeat(index);
      i++;
    } else {
      index -= MAX_UNICODE;
      newString += str.substring(i + 1, i + index + 1);
      i += index;
    }
  }
  return newString;
}

const str = fs.readFileSync(process.argv[4]).toString();

if (process.argv[2] == "encode") {
  let encodedStr;
  if (process.argv[3] == "escape") {
    encodedStr = encodeEscape(serializeString(str));
  }
  if (process.argv[3] == "jump") {
    encodedStr = encodeJump(str);
  }
  fs.writeFileSync(process.argv[5], encodedStr);
}

if (process.argv[2] == "decode") {
  let decodedStr;
  if (process.argv[3] == "escape") {
    decodedStr = decodeEscape(str);
  }
  if (process.argv[3] == "jump") {
    decodedStr = decodeJump(str);
  }
  fs.writeFileSync(process.argv[5], decodedStr);
}
