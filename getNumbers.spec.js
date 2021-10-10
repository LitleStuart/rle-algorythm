const { getNumbers } = require("./getNumbers");
describe("getNumbers", () => {
  it("Returns array of numbers", () => {
    const result = getNumbers(100, 1);
    expect(result).toEqual([1]);
  });

  it("Returns array of numbers", () => {
    const result = getNumbers(100, 100);
    expect(result).toEqual([100]);
  });
});
