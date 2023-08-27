const express = require("express");
const app = express();
const PORT = 3000;



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
    // Add more operators as needed
    default:
      return null;
  }
}

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Endpoint to perform calculations and return JSON response
app.get("/:num1/:operator/:num2/:operator2?/:num3?/:operator3?", (req, res) => {
  const { num1, operator, num2, operator2, num3, operator3 } = req.params;

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


  res.json({ question, answer });
});

// Add  Endpoint to view history


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
    // Add more endpoints as needed
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
