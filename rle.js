const fs = require("fs");
const { decodeEscape } = require("./decodeEscape");
const { encodeEscape } = require("./encodeEscape");
const { serializeString } = require("./serializeString");

const str = fs.readFileSync(process.argv[3]).toString();

if (process.argv[2] == "encode") {
    const encodedStr = encodeEscape(serializeString(str));
    fs.writeFileSync(process.argv[4], encodedStr);
}

if (process.argv[2] == "decode") {
    const decodedStr = decodeEscape(str);
    fs.writeFileSync(process.argv[4], decodedStr);
}