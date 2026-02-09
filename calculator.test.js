/**
 * Tests for calculator module
 */

const { calculate, isValidNumber } = require('./calculator');

describe('Calculator Module', () => {
  describe('isValidNumber', () => {
    test('should return true for valid numbers', () => {
      expect(isValidNumber('5')).toBe(true);
      expect(isValidNumber('3.14')).toBe(true);
      expect(isValidNumber('-10')).toBe(true);
      expect(isValidNumber('0')).toBe(true);
    });

    test('should return false for invalid inputs', () => {
      expect(isValidNumber('')).toBe(false);
      expect(isValidNumber(null)).toBe(false);
      expect(isValidNumber(undefined)).toBe(false);
      expect(isValidNumber('abc')).toBe(false);
      expect(isValidNumber(NaN)).toBe(false);
    });
  });

  describe('calculate', () => {
    describe('Addition', () => {
      test('should add two positive numbers', () => {
        const result = calculate('5', '3', '+');
        expect(result.success).toBe(true);
        expect(result.result).toBe(8);
      });

      test('should add negative numbers', () => {
        const result = calculate('-5', '3', '+');
        expect(result.success).toBe(true);
        expect(result.result).toBe(-2);
      });

      test('should add decimal numbers', () => {
        const result = calculate('1.5', '2.3', '+');
        expect(result.success).toBe(true);
        expect(result.result).toBeCloseTo(3.8);
      });
    });

    describe('Subtraction', () => {
      test('should subtract two numbers', () => {
        const result = calculate('10', '3', '-');
        expect(result.success).toBe(true);
        expect(result.result).toBe(7);
      });

      test('should handle negative results', () => {
        const result = calculate('3', '10', '-');
        expect(result.success).toBe(true);
        expect(result.result).toBe(-7);
      });
    });

    describe('Multiplication', () => {
      test('should multiply two numbers', () => {
        const result = calculate('5', '3', '*');
        expect(result.success).toBe(true);
        expect(result.result).toBe(15);
      });

      test('should handle multiplication by zero', () => {
        const result = calculate('5', '0', '*');
        expect(result.success).toBe(true);
        expect(result.result).toBe(0);
      });

      test('should handle negative multiplication', () => {
        const result = calculate('-5', '3', '*');
        expect(result.success).toBe(true);
        expect(result.result).toBe(-15);
      });
    });

    describe('Division', () => {
      test('should divide two numbers', () => {
        const result = calculate('10', '2', '/');
        expect(result.success).toBe(true);
        expect(result.result).toBe(5);
      });

      test('should handle decimal division', () => {
        const result = calculate('7', '2', '/');
        expect(result.success).toBe(true);
        expect(result.result).toBe(3.5);
      });

      test('should return error for division by zero', () => {
        const result = calculate('10', '0', '/');
        expect(result.success).toBe(false);
        expect(result.error).toBe('Cannot divide by zero');
      });
    });

    describe('Invalid Inputs', () => {
      test('should return error for missing num1', () => {
        const result = calculate('', '5', '+');
        expect(result.success).toBe(false);
        expect(result.error).toBe('Invalid input: Please provide valid numbers');
      });

      test('should return error for missing num2', () => {
        const result = calculate('5', '', '+');
        expect(result.success).toBe(false);
        expect(result.error).toBe('Invalid input: Please provide valid numbers');
      });

      test('should return error for non-numeric num1', () => {
        const result = calculate('abc', '5', '+');
        expect(result.success).toBe(false);
        expect(result.error).toBe('Invalid input: Please provide valid numbers');
      });

      test('should return error for non-numeric num2', () => {
        const result = calculate('5', 'xyz', '+');
        expect(result.success).toBe(false);
        expect(result.error).toBe('Invalid input: Please provide valid numbers');
      });

      test('should return error for invalid operator', () => {
        const result = calculate('5', '3', '%');
        expect(result.success).toBe(false);
        expect(result.error).toBe('Invalid operation');
      });
    });
  });
});
