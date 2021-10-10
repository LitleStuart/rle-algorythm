const { serializeString } = require("./serializeString");

describe("serializeString", () => {
  it("aabccc", () => {
    const result = serializeString("aabccc");
    expect(result).toEqual([
      { char: "a", count: 2 },
      { char: "b", count: 1 },
      { char: "c", count: 3 },
    ]);
  });
});
