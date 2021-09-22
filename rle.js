fs = require("fs");

let counter = 1;
let isRepeatChars = false;
let isNotRepeatChars = false;
let newString = "";
let notRepeatChars = "";
var string = fs.readFileSync(process.argv[3]).toString();

if (process.argv[2] == "-encode"){
    for (let i = 1; i < string.length; i++) {
        var char = string[i];
        var lastChar = string[i-1];
        if (char == lastChar) {
            if (isNotRepeatChars) {
                counter -= 1;
                if (counter == 1){
                    notRepeatChars = notRepeatChars[0];
                } else {
                    notRepeatChars = notRepeatChars.substring(0, notRepeatChars.length - 2);
                }
                if (counter < 129) {
                    newString += String.fromCharCode(counter + 127) + notRepeatChars;
                } else {
                    newString += String.fromCharCode(255) + notRepeatChars.substring(0, 127) +
                                 String.fromCharCode(counter - 1);
                    if (counter == 129) {
                        newString += notRepeatChars[128];
                    } else {
                        newString += notRepeatChars.substring(128, counter - 1);
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
                if (counter < 128){
                    newString += String.fromCharCode(counter) + lastChar;
                } else {
                    newString += String.fromCharCode(127) + lastChar;
                    if (counter == 128) {
                        notRepeatChars += lastChar;
                    } else {
                        newString += String.fromCharCode(counter - 127) + lastChar;
                    }
                }
                isRepeatChars = false;
                notRepeatChars += char;
                counter = notRepeatChars.length;
            } else {
                isNotRepeatChars = true;
                counter += 1;
                notRepeatChars += char;
            }
        }
    }
    if (isRepeatChars) {
        if (counter < 128){
            newString += String.fromCharCode(counter) + lastChar;
        } else {
            newString += String.fromCharCode(127) + lastChar;
            if (counter == 128) {
                newString += String.fromCharCode(1) + lastChar;
            } else {
                newString += String.fromCharCode(counter - 127) + lastChar
            }
        }
    } else {
        if (isNotRepeatChars) {
            if (counter == 1) {
                notRepeatChars = notRepeatChars[0]
            }
            if (counter < 129) {
                newString += String.fromCharCode(counter + 127) + notRepeatChars;
            } else {
                newString += String.fromCharCode(255) + notRepeatChars.substring(0, 127) +
                             String.fromCharCode(counter - 1)
                if (counter == 129) {
                    newString += notRepeatChars[128];
                } else {
                    newString += notRepeatChars.substring(128, counter - 1);
                }
            }
        }
    }
    console.log(newString);
    fs.writeFileSync(process.argv[4], newString);
}

if (process.argv[2] == "-decode") {
    for (let i = 0; i < string.length; i++) {
        let index = string.charCodeAt(i);
        if (index < 128) {
            newString += string[i+1].repeat(index);
            i++;
        } else {
            index -= 127;
            newString += string.substring(i + 1, i + 1 + index);
            i += index;
        }
    }
    console.log(newString);
    fs.writeFileSync(process.argv[4], newString);
}

if (process.argv[2] == "-help") {
    console.log('To encode you should enter this args: -encode input_file.txt output_file.txt');
    console.log('To decode you should enter this args: -decode input_file.txt output_file.txt');
}