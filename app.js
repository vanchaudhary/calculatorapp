const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Refactored calculation logic for testability
function calculate(num1, num2, op) {
  // Validate inputs
  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  if (isNaN(n1) || isNaN(n2)) {
    return { error: 'Invalid input: Please provide valid numbers' };
  }

  // Perform calculation
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
        return { error: 'Cannot divide by zero' };
      }
      result = n1 / n2;
      break;
    default:
      return { error: 'Invalid operation' };
  }

  return { result };
}

app.get('/', (req, res) => {
  res.send(`
    <h2>🚀 Calculator App - Azure Demo v2.0 ✨</h2>
    <form method="post" action="/calculate">
      <input name="num1" type="number" step="any" required>
      <select name="op">
        <option value="+">+</option>
        <option value="-">-</option>
        <option value="*">*</option>
        <option value="/">/</option>
      </select>
      <input name="num2" type="number" step="any" required>
      <button type="submit">Calculate</button>
    </form>
  `);
});

app.post('/calculate', (req, res) => {
  const { num1, num2, op } = req.body;
  const output = calculate(num1, num2, op);

  if (output.error) {
    res.send(`<h2>Error: ${output.error}</h2><a href="/">Try again</a>`);
  } else {
    res.send(`<h2>Result: ${output.result}</h2><a href="/">Try again</a>`);
  }
});

// Only start server if not in test mode
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Calculator app listening at http://localhost:${port}`);
  });
}

// Export for testing
module.exports = { app, calculate };
