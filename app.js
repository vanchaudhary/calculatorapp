const express = require('express');
const { calculate } = require('./calculator');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res,) => {
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
  const num1 = req.body.num1;
  const num2 = req.body.num2;
  const op = req.body.op;
  
  const result = calculate(num1, num2, op);
  
  if (result.success) {
    res.send(`<h2>Result: ${result.result}</h2><a href="/">Try again</a>`);
  } else {
    res.send(`<h2>Error: ${result.error}</h2><a href="/">Try again</a>`);
  }
});

app.listen(port, () => {
  console.log(`Calculator app listening at http://localhost:${port}`);
});

module.exports = app;
