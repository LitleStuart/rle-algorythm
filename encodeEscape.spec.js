const { encodeEscape } = require("./encodeEscape");

describe("encodeEscape", () => {
  it("Кодирование строки, не содержащей подстроки длиной 260 и больше", () => {
    const result = encodeEscape([
      { char: "a", count: 5 },
      { char: "i", count: 2 },
    ]);
    expect(result).toBe(`#${String.fromCharCode(1)}aii`);
  });

  it("Кодирование строки, содержащей подстроку с длиной 260 и больше", () => {
    const result = encodeEscape([{ char: "a", count: 300 }]);
    expect(result).toBe(
      `#${String.fromCharCode(255)}a#${String.fromCharCode(37)}a`
    );
  });

  it("Кодирование строки, содержащей подстроку с длиной 260 и больше", () => {
    const result = encodeEscape([{ char: "#", count: 3 }]);
    expect(result).toBe(`#${String.fromCharCode(2)}#`);
  });

  it("Кодирование строки, содержащей подстроку с длиной 260 и больше", () => {
    const result = encodeEscape([{ char: "#", count: 257 }]);
    expect(result).toBe(
      `#${String.fromCharCode(255)}##${String.fromCharCode(0)}#`
    );
  });

  it("Кодирование строки, содержащей подстроку с длиной 260 и больше", () => {
    const result = encodeEscape([{ char: "a", count: 259 }]);
    expect(result).toBe(`#${String.fromCharCode(255)}a`);
  });
});
