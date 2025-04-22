class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '0';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0') return;
        
        if (this.previousOperand !== '') {
            this.calculate();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Non puoi dividere per zero!');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('it-IT', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay},${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.textContent = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

// Recupera gli elementi del DOM
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const buttons = document.querySelectorAll('.btn');

// Crea una nuova istanza della calcolatrice
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Aggiungi gli event listener ai pulsanti
buttons.forEach(button => {
    button.addEventListener('click', () => {
        // Gestisce i numeri
        if (button.classList.contains('number')) {
            calculator.appendNumber(button.textContent);
            calculator.updateDisplay();
        }
        
        // Gestisce le operazioni
        if (button.classList.contains('operator')) {
            calculator.chooseOperation(button.textContent);
            calculator.updateDisplay();
        }
        
        // Gestisce altre azioni
        if (button.dataset.action === 'clear') {
            calculator.clear();
            calculator.updateDisplay();
        }
        
        if (button.dataset.action === 'delete') {
            calculator.delete();
            calculator.updateDisplay();
        }
        
        if (button.dataset.action === 'calculate') {
            calculator.calculate();
            calculator.updateDisplay();
        }
    });
});

// Supporto per input da tastiera
document.addEventListener('keydown', event => {
    if (event.key >= '0' && event.key <= '9' || event.key === '.') {
        calculator.appendNumber(event.key);
        calculator.updateDisplay();
    }
    
    if (event.key === '+' || event.key === '-') {
        calculator.chooseOperation(event.key);
        calculator.updateDisplay();
    }
    
    if (event.key === '*') {
        calculator.chooseOperation('×');
        calculator.updateDisplay();
    }
    
    if (event.key === '/') {
        calculator.chooseOperation('÷');
        calculator.updateDisplay();
    }
    
    if (event.key === 'Enter' || event.key === '=') {
        calculator.calculate();
        calculator.updateDisplay();
    }
    
    if (event.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    }
    
    if (event.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
});

// Inizializza il display
calculator.updateDisplay();