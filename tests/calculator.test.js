"use strict";

const { calc, processUserInput } = require("../calculator");

describe("calculator module", () => {
  test("should add two numbers when operation is add", () => {
    expect(calc(2, 3, "add")).toBe(5);
  });

  test("should subtract two numbers when operation is sub", () => {
    expect(calc(5, 3, "sub")).toBe(2);
  });

  test("should multiply two numbers when operation is mul", () => {
    expect(calc(4, 3, "mul")).toBe(12);
  });

  test("should divide two numbers when operation is div", () => {
    expect(calc(10, 2, "div")).toBe(5);
  });

  test("should return NO when dividing by zero", () => {
    expect(calc(10, 0, "div")).toBe("NO");
  });

  test("should return null for unsupported operation", () => {
    expect(calc(10, 5, "pow")).toBeNull();
  });

  test("should process user input and return calculation result", () => {
    expect(processUserInput({ n1: "7", n2: "5", operation: "add" })).toEqual({ r: 12 });
  });
});
