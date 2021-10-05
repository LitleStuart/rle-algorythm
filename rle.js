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

function encodeEscape(str) {
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

function encodeJump(str) {
  let counter = 1;
  let isRepeatChars = false;
  let isNotRepeatChars = false;
  let newString = "";
  let notRepeatChars = "";

  for (let i = 1; i < str.length; i++) {
    var char = str[i];
    var lastChar = str[i - 1];
    if (char == lastChar) {
      if (isNotRepeatChars) {
        notRepeatChars = notRepeatChars.substring(0, notRepeatChars.length - 1);
        newString = AddNotRepeatChars(notRepeatChars, newString);
        counter = 1;
      }
      isNotRepeatChars = false;
      isRepeatChars = true;
      notRepeatChars = "";
      counter += 1;
    } else {
      if (isRepeatChars) {
        newString = AddRepeatChars(newString, lastChar, counter);
        notRepeatChars += char;
        counter = notRepeatChars.length;
        if (counter == 2) {
          isNotRepeatChars = true;
        } else {
          isRepeatChars = false;
        }
      } else {
        isNotRepeatChars = true;
        if (i == 1) {
          notRepeatChars += lastChar;
        }
        notRepeatChars += char;
      }
    }
  }
  if (isRepeatChars) {
    newString = AddRepeatChars(newString, lastChar, counter);
  }
  if (notRepeatChars != "") {
    newString = AddNotRepeatChars(notRepeatChars, newString);
  }
  return newString;
}

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
    encodedStr = encodeEscape(str);
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
