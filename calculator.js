/**
 * Calculator module - contains core calculation logic
 */

/**
 * Validates if a value is a valid number
 * @param {any} value - The value to validate
 * @returns {boolean} - True if valid number, false otherwise
 */
function isValidNumber(value) {
  return value !== '' && value !== null && value !== undefined && !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
}

/**
 * Performs calculation based on operator and operands
 * @param {string} num1 - First number as string
 * @param {string} num2 - Second number as string
 * @param {string} op - Operator (+, -, *, /)
 * @returns {Object} - Object with success flag and result or error message
 */
function calculate(num1, num2, op) {
  // Validate inputs
  if (!isValidNumber(num1) || !isValidNumber(num2)) {
    return {
      success: false,
      error: 'Invalid input: Please provide valid numbers'
    };
  }

  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  let result;
  switch (op) {
    case '+':
      result = n1 + n2;
      break;
    case '-':
      result = n1 - n2;
      break;
    case '*':
      result = n1 * n2;
      break;
    case '/':
      if (n2 === 0) {
        return {
          success: false,
          error: 'Cannot divide by zero'
        };
      }
      result = n1 / n2;
      break;
    default:
      return {
        success: false,
        error: 'Invalid operation'
      };
  }

  return {
    success: true,
    result: result
  };
}

module.exports = {
  calculate,
  isValidNumber
};
