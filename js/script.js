const calculator = document.querySelector(".calculator");
const display = calculator.querySelector(".calculator-display");
const previousOperandTextElement = display.querySelector("#previous-operand");
const currentOperandTextElement = display.querySelector("#current-operand");
const buttons = calculator.querySelector(".calculator-buttons");

class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
    this.memoryValue = 0;
    this.justCalculated = false; // Resettiamo il flag
    this.memoryIndicatorElement =
      document.getElementById("memory-indicator") || null;
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.shouldResetScreen = false;
    this.memoryValue = 0; // Resetta anche il valore in memoria
    this.justCalculated = false; // Resettiamo il flag
  }

  delete() {
    console.log("delete() called. Current operand:", this.currentOperand);
    this.currentOperand = this.currentOperand.toString();
    console.log("After toString():", this.currentOperand);
    this.currentOperand = this.currentOperand.slice(0, -1);
    console.log("After slice():", this.currentOperand);
    if (this.currentOperand === "") {
        this.currentOperand = "0";
        console.log("Operand set to '0'");
    }
    console.log("Final operand:", this.currentOperand);
}

  appendNumber(number) {
    if (this.shouldResetScreen || this.justCalculated) {
      // Controlliamo il flag
      this.currentOperand = number; // Visualizziamo la nuova cifra
      this.shouldResetScreen = false;
      this.justCalculated = false; // Resettiamo il flag
    } else {
      if (number === "." && this.currentOperand.includes(".")) return;
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === "" && operation !== "√" && operation !== "x²")
      return;

    if (this.operation !== null) {
      this.compute();
      this.operation = null; // Resetta l'operazione dopo il calcolo
      this.previousOperand = ""; // Resetta l'operando precedente
    }

    if (operation === "√") {
      if (this.currentOperand === "Error") return; // Impedisci radice di Error
      this.currentOperand = Math.sqrt(parseFloat(this.currentOperand));
      this.operation = null;
      this.previousOperand = "";
      this.justCalculated = true;
      this.shouldResetScreen = true; // Aggiungi questo
    } else if (operation === "x²") {
      if (this.currentOperand === "Error") return; // Impedisci quadrato di Error
      this.currentOperand = Math.pow(parseFloat(this.currentOperand), 2);
      this.operation = null;
      this.previousOperand = "";
      this.justCalculated = true;
      this.shouldResetScreen = true; // Aggiungi questo
    } else {
      this.operation = operation;
      this.previousOperand = this.currentOperand;
      this.currentOperand = "";
      this.shouldResetScreen = true;
    }
    this.updateDisplay();
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "×":
        computation = prev * current;
        break;
      case "÷":
        if (current === 0) {
          computation = "Error";
        } else {
          computation = prev / current;
        }
        break;
      default:
        return;
    }
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
    this.justCalculated = true; // Impostiamo il flag a true
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("it", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.textContent = this.getDisplayNumber(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandTextElement.textContent = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.textContent = "";
    }

    if (this.memoryValue !== 0) {
      this.memoryIndicatorElement.style.display = "block";
    } else {
      this.memoryIndicatorElement.style.display = "none";
    }
  }

  handleSpecialOperation(operation) {
    switch (operation) {
      case "M+":
        this.memoryValue =
          (parseFloat(this.currentOperand) || 0) + (this.memoryValue || 0);
        break;
      case "M-":
        this.memoryValue =
          (this.memoryValue || 0) - (parseFloat(this.currentOperand) || 0);
        break;
      case "MC":
        this.memoryValue = 0;
        break;
      case "MR":
        this.currentOperand = this.memoryValue.toString();
        break;
      default:
        return;
    }
    this.updateDisplay();
  }
}

const myCalculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

buttons.addEventListener("click", (button) => {
  if (button.target.classList.contains("number")) {
    myCalculator.appendNumber(button.target.innerText);
    myCalculator.updateDisplay();
  } else if (button.target.classList.contains("operator")) {
    const operation = button.target.innerText;
    if (
      operation === "M+" ||
      operation === "M-" ||
      operation === "MC" ||
      operation === "MR"
    ) {
      myCalculator.handleSpecialOperation(operation);
    } else {
      myCalculator.chooseOperation(operation);
    }
  } else if (button.target.classList.contains("clear")) {
    myCalculator.clear();
    myCalculator.updateDisplay();
  } else if (button.target.classList.contains("equals")) {
    myCalculator.compute();
    myCalculator.updateDisplay();
  } else if (button.target.classList.contains("delete")) {
    myCalculator.delete();
    myCalculator.updateDisplay();
  }
});
