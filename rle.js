fs = require("fs");

let counter = 1;
let isRepeatChars = false;
let isNotRepeatChars = false;
let newString = "";
let notRepeatChars = "";

if (process.argv[2] == "-encode") {
  var string = fs.readFileSync(process.argv[3]).toString();
  for (let i = 1; i < string.length; i++) {
    var char = string[i];
    var lastChar = string[i - 1];
    if (char == lastChar) {
      if (isNotRepeatChars) {
        counter -= 1;
        notRepeatChars = notRepeatChars.substring(0, notRepeatChars.length - 1);
        if (counter < 129) {
          newString += String.fromCharCode(counter + 127) + notRepeatChars;
        } else {
          for (let i = 0; i <= Math.floor(counter / 128); i++) {
            let nrc = notRepeatChars.substring(
              i * 128,
              i == Math.floor(counter / 128) ? counter % 128 : i * 128 + 128
            );
            newString += String.fromCharCode(127 + nrc.length) + nrc;
          }
        }
        counter = 1;
      }
      isNotRepeatChars = false;
      isRepeatChars = true;
      notRepeatChars = "";
      counter += 1;
    } else {
      if (isRepeatChars) {
        if (counter < 128) {
          newString += String.fromCharCode(counter) + lastChar;
        } else {
          newString += String.fromCharCode(127) + lastChar;
          if (counter == 128) {
            notRepeatChars += lastChar;
          } else {
            for (let i = 1; i <= Math.floor(counter / 127); i++) {
              if (i == Math.floor(counter / 127)) {
                if (counter % 127 == 1) {
                  notRepeatChars += lastChar;
                } else {
                  newString += String.fromCharCode(counter % 127) + lastChar;
                }
              } else {
                newString += String.fromCharCode(127) + lastChar;
              }
            }
          }
        }
        isRepeatChars = false;
        notRepeatChars += char;
        counter = notRepeatChars.length;
        if (counter == 2) {
          isNotRepeatChars = true;
        }
      } else {
        isNotRepeatChars = true;
        counter += 1;
        notRepeatChars += char;
      }
    }
  }
  if (isNotRepeatChars) {
    counter = notRepeatChars.length;
    if (counter < 129) {
      newString += String.fromCharCode(counter + 127) + notRepeatChars;
    } else {
      for (let i = 0; i <= Math.floor(counter / 128); i++) {
        let nrc = notRepeatChars.substring(
          i * 128,
          i == Math.floor(counter / 128) ? counter % 128 : i * 128 + 128
        );
        newString += String.fromCharCode(127 + nrc.length) + nrc;
      }
    }
  } else if (isRepeatChars) {
    if (counter < 128) {
      newString += String.fromCharCode(counter) + lastChar;
    } else {
      for (let i = 0; i <= Math.floor(counter / 127); i++) {
        if (i < Math.floor(counter / 127)) {
          newString += String.fromCharCode(127) + lastChar;
        } else {
          newString += String.fromCharCode(counter % 127) + lastChar;
        }
      }
    }
  }

  console.log(newString);
  fs.writeFileSync(process.argv[4], newString);
}

if (process.argv[2] == "-decode") {
  var string = fs.readFileSync(process.argv[3]).toString();
  for (let i = 0; i < string.length; i++) {
    let index = string.charCodeAt(i);
    if (index < 128) {
      newString += string[i + 1].repeat(index);
      i++;
    } else {
      index -= 127;
      newString += string.substring(i + 1, i + index + 1);
      i += index;
    }
  }
  console.log(newString);
  fs.writeFileSync(process.argv[4], newString);
}

if (process.argv[2] == "-help") {
  console.log(
    "To encode you should enter this args: -encode input_file.txt output_file.txt"
  );
  console.log(
    "To decode you should enter this args: -decode input_file.txt output_file.txt"
  );
}
