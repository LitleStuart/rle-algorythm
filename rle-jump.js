fs = require("fs");

let string = fs.readFileSync(process.argv[3]).toString();
let notRepeatChars = "";

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

function Encode(string) {
  let counter = 1;
  let isRepeatChars = false;
  let isNotRepeatChars = false;
  let newString = "";

  for (let i = 1; i < string.length; i++) {
    var char = string[i];
    var lastChar = string[i - 1];
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

function Decode(string) {
  const MAX_UNICODE = 127;
  let newString = "";

  for (let i = 0; i < string.length; i++) {
    let index = string.charCodeAt(i);
    if (index <= MAX_UNICODE) {
      newString += string[i + 1].repeat(index);
      i++;
    } else {
      index -= MAX_UNICODE;
      newString += string.substring(i + 1, i + index + 1);
      i += index;
    }
  }
  return newString;
}

if (process.argv[2] == "-encode") {
  fs.writeFileSync(process.argv[4], Encode(string));
}

if (process.argv[2] == "-decode") {
  fs.writeFileSync(process.argv[4], Decode(string));
}

if (process.argv[2] == "-help") {
  console.log(
    "To encode you should enter this args: -encode input_file.txt output_file.txt"
  );
  console.log(
    "To decode you should enter this args: -decode input_file.txt output_file.txt"
  );
}
