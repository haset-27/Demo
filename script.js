
const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let currentInput = "0";
let previousValue = null;
let operator = null;
let waitingForNumber = false;

function updateDisplay() {
  display.value = currentInput;
}

function inputNumber(number) {
  if (currentInput === "Error" || waitingForNumber) {
    currentInput = number;
    waitingForNumber = false;
  } else if (currentInput === "0") {
    currentInput = number;
  } else {
    currentInput += number;
  }

  updateDisplay();
}

function inputDecimal() {
  if (currentInput === "Error" || waitingForNumber) {
    currentInput = "0.";
    waitingForNumber = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }

  updateDisplay();
}

function calculate(first, second, operation) {
  switch (operation) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "*":
      return first * second;
    case "/":
      if (second === 0) {
        throw new Error("Cannot divide by zero");
      }
      return first / second;
    default:
      return second;
  }
}

function formatResult(number) {
  if (!Number.isFinite(number)) {
    throw new Error("Invalid result");
  }

  return String(Number(number.toPrecision(12)));
}

function chooseOperator(nextOperator) {
  if (currentInput === "Error") return;

  const inputValue = Number(currentInput);

  if (operator && !waitingForNumber) {
    try {
      const result = calculate(
        previousValue,
        inputValue,
        operator
      );

      currentInput = formatResult(result);
      previousValue = result;
      updateDisplay();
    } catch (error) {
      currentInput = "Error";
      previousValue = null;
      operator = null;
      waitingForNumber = true;
      updateDisplay();
      return;
    }
  } else {
    previousValue = inputValue;
  }

  operator = nextOperator;
  waitingForNumber = true;
}

function showResult() {
  if (
    operator === null ||
    previousValue === null ||
    waitingForNumber ||
    currentInput === "Error"
  ) {
    return;
  }

  try {
    const result = calculate(
      previousValue,
      Number(currentInput),
      operator
    );

    currentInput = formatResult(result);
  } catch (error) {
    currentInput = "Error";
  }

  previousValue = null;
  operator = null;
  waitingForNumber = true;
  updateDisplay();
}

function clearCalculator() {
  currentInput = "0";
  previousValue = null;
  operator = null;
  waitingForNumber = false;
  updateDisplay();
}

function deleteLastDigit() {
  if (currentInput === "Error" || waitingForNumber) {
    clearCalculator();
    return;
  }

  currentInput = currentInput.slice(0, -1) || "0";
  updateDisplay();
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) return;

  if (button.dataset.number !== undefined) {
    inputNumber(button.dataset.number);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else {
    switch (button.dataset.action) {
      case "clear":
        clearCalculator();
        break;
      case "delete":
        deleteLastDigit();
        break;
      case "decimal":
        inputDecimal();
        break;
      case "equals":
        showResult();
        break;
    }
  }
});
