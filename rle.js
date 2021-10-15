const fs = require("fs");
const { decodeEscape } = require("./decodeEscape");
const { encodeEscape } = require("./encodeEscape");
const { serializeString } = require("./serializeString");

try {
    const str = fs.readFileSync(process.argv[3]).toString();

    if (process.argv[2] == "code") {
        const encodedStr = encodeEscape(serializeString(str));
        fs.writeFileSync(process.argv[4], encodedStr);
    } else if (process.argv[2] == "decode") {
        const decodedStr = decodeEscape(str);
        fs.writeFileSync(process.argv[4], decodedStr);
    } else {
        console.log("Input code or decode");
    }
} catch {
    console.log("Incorrect input/output file");
}