function calculate(num1Input, num2Input, op) {
  const num1 = Number.parseFloat(num1Input);
  const num2 = Number.parseFloat(num2Input);

  if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
    return { error: 'Please enter valid numbers for both inputs.' };
  }

  switch (op) {
    case '+':
      return { result: num1 + num2 };
    case '-':
      return { result: num1 - num2 };
    case '*':
      return { result: num1 * num2 };
    case '/':
      return num2 === 0
        ? { error: 'Cannot divide by zero' }
        : { result: num1 / num2 };
    default:
      return { error: 'Invalid operation' };
  }
}

module.exports = { calculate };
