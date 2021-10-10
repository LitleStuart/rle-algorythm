function getNumbers(base, n) {
  let result = [];
  for (let i = 0; i < Math.floor(n / base); i++) {
    result.push(base);
  }
  if (n % base != 0) {
    result.push(n % base);
  }
  return result;
}

exports.getNumbers = getNumbers;
