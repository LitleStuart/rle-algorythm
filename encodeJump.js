const { AddNotRepeatChars, AddRepeatChars } = require("./rle");

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
exports.encodeJump = encodeJump;
