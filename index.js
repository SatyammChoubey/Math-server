const express = require("express");
const app = express();
const PORT = 3000;

// Array to store history
const history = [];

// Helper function to calculate the result of a mathematical operation
function calculate(operation, a, b) {
  switch (operation) {
    case "plus":
      return a + b;
    case "minus":
      return a - b;
    case "into":
      return a * b;
    case "by":
      return a / b;
    case "power":
      return Math.pow(a, b);
    case "modulo":
      return a % b;
    case "sqrt":
      return Math.sqrt(a);
    case "sin":
      return Math.sin(a);
    case "cos":
      return Math.cos(a);
    case "tan":
      return Math.tan(a);
    default:
      return null;
  }
}

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// input validation

function validateOperator(operation) {
    const allowedOperators = ["plus", "minus", "multiply", "divide", "power", "modulo", "sqrt", "sin", "cos", "tan"];
    return allowedOperators.includes(operation);
}

function validateNumber(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
}

// Endpoint to perform calculations and return JSON response
app.get("/:num1/:operator/:num2/:operator2?/:num3?/:operator3?", (req, res) => {
  const { num1, operator, num2, operator2, num3, operator3 } = req.params;
  if (!validateOperator(operator) || !validateNumber(num1) || !validateNumber(num2)) {
    return res.status(400).json({ error: "Invalid input" });
}

if (operator2 && (!validateOperator(operator2) || !validateNumber(num3))) {
    return res.status(400).json({ error: "Invalid input" });
}

if (operator3 && (!validateOperator(operator3) || !validateNumber(num4))) {
    return res.status(400).json({ error: "Invalid input" });
}


  const op1 = parseFloat(num1);
  const op2 = parseFloat(num2);
  const op3 = parseFloat(num3);

  const result1 = calculate(operator, op1, op2);
  const result2 = operator2 ? calculate(operator2, result1, op3) : result1;

  const question = operator3
    ? `${num1} ${operator} ${num2} ${operator2} ${num3} ${operator3}`
    : `${num1} ${operator} ${num2} ${operator2 || ""} ${num3 || ""}`;

  const answer = result2;

  // Add the operation to history
  history.push({ question, answer });
  if (history.length > 20) {
    history.shift();
  }

  res.json({ question, answer });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
});


// Endpoint to view history
app.get("/history", (req, res) => {
  res.json(history);
});

app.get("/", (req, res) => {
  const endpoints = [
    { endpoint: "/", description: "Lists all the available endpoint samples" },
    {
      endpoint: "/history",
      description:
        "Lists the last 20 operations performed on the server, and the answers.",
    },
    { endpoint: "/5/plus/3", description: "Calculate 5 + 3" },
    { endpoint: "/3/minus/5", description: "Calculate 3 - 5" },
    { endpoint: "/3/minus/5/plus/8", description: "Calculate 3 - 5 + 8" },
    {
      endpoint: "/3/into/5/plus/8/into/6",
      description: "Calculate 3 * 5 + 8 * 6",
    },
    { endpoint: "/10/by/2", description: "Calculate 10/2" },
    { endpoint: "/2/power/3", description: "Calculate 2^3" },
    { endpoint: "/4/sqrt/2", description: "Calculate 4 root 2 " },
    { endpoint: "/2/sin/4", description: "Calculate 2 sin 4 " },
    { endpoint: "/2/cos/4", description: "Calculate 2 cos 4 " },
    { endpoint: "/2/tan/4", description: "Calculate 2 tan 4 " },
  ];

  const endpointList = endpoints
    .map(
      (e) =>
        `<li><a href="${e.endpoint}">${e.endpoint}</a>: ${e.description}</li>`
    )
    .join("");

  const htmlResponse = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Math Operations API</title>
    </head>
    <body>
    <h1>Math Operations API</h1>
    <ul>${endpointList}</ul>
    </body>
    </html>
    `;

  res.send(htmlResponse);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
