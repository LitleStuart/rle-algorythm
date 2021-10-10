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

exports.serializeString = serializeString;
