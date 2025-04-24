class Calculator {
    constructor(previousOperandElement, currentOperandElement, memoryIndicatorElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.memoryIndicatorElement = memoryIndicatorElement;
        this.clear();
        this.specialOperation = undefined; // Inizializza specialOperation
        this.memoryValue = 0; // Inizializza memoryValue
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        // Non resettiamo la memoria con AC
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
        
        if (isNaN(prev) && this.operation === undefined) return;
        
        // Se non c'è un'operazione precedente ma solo un numero corrente
        if (isNaN(prev)) {
            switch (this.specialOperation) {
                case 'sqrt':
                    if (current < 0) {
                        alert('Non è possibile calcolare la radice quadrata di un numero negativo!');
                        return;
                    }
                    computation = Math.sqrt(current);
                    break;
                case 'square':
                    computation = current * current;
                    break;
                default:
                    return;
            }
            this.specialOperation = undefined;
        } else {
            // Operazioni standard tra due numeri
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
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }
    
    // Nuove funzioni per operazioni speciali
    sqrt() {
        const current = parseFloat(this.currentOperand);
        if (current < 0) {
            this.currentOperand = 'Errore';
            this.updateDisplay();
            return;
        }
        this.previousOperand = `√(${this.currentOperand})`;
        this.specialOperation = 'sqrt';
        this.shouldResetScreen = true;
    }
    
    square() {
        this.previousOperand = `(${this.currentOperand})²`;
        this.specialOperation = 'square';
        this.shouldResetScreen = true;
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
        
        // Aggiorna il display precedente in base all'operazione
        if (this.operation != null) {
            this.previousOperandElement.textContent = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else if (this.specialOperation != null) {
            // Mantieni il contenuto già impostato per le operazioni speciali
        } else {
            this.previousOperandElement.textContent = '';
        }
        
        // Aggiorna l'indicatore di memoria
        if (this.memoryValue !== 0 && this.memoryValue !== undefined) {
            this.memoryIndicatorElement.style.display = 'block';
        } else {
            this.memoryIndicatorElement.style.display = 'none';
        }
    }
    
    // Funzioni per la gestione della memoria
    memoryClear() {
        this.memoryValue = 0;
        this.updateDisplay();
    }
    
    memoryRecall() {
        if (this.memoryValue !== undefined) {
            this.currentOperand = this.memoryValue.toString();
            this.shouldResetScreen = true;
            this.updateDisplay();
        }
    }
    
    memoryAdd() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        if (this.memoryValue === undefined) {
            this.memoryValue = 0;
        }
        
        this.memoryValue += current;
        this.shouldResetScreen = true;
        this.updateDisplay();
    }
    
    memorySubtract() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        if (this.memoryValue === undefined) {
            this.memoryValue = 0;
        }
        
        this.memoryValue -= current;
        this.shouldResetScreen = true;
        this.updateDisplay();
    }
}

// Recupera gli elementi del DOM
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const memoryIndicatorElement = document.getElementById('memory-indicator');
const buttons = document.querySelectorAll('.btn');

// Crea una nuova istanza della calcolatrice
const calculator = new Calculator(previousOperandElement, currentOperandElement, memoryIndicatorElement);

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
            handleSpecialOperation(button.dataset.action);
            calculator.clear();
            calculator.updateDisplay();
        }
        
        if (button.dataset.action === 'delete') {
            handleSpecialOperation(button.dataset.action);
            calculator.delete();
            calculator.updateDisplay();
        }
        
        if (button.dataset.action === 'calculate') {
            handleSpecialOperation(button.dataset.action);
            calculator.calculate();
            calculator.updateDisplay();
        }
        
        // Gestisce le operazioni speciali
        if (button.dataset.action === 'sqrt') {
            handleSpecialOperation(button.dataset.action);
            calculator.sqrt();
            calculator.updateDisplay();
        }
        
        if (button.dataset.action === 'square') {
            handleSpecialOperation(button.dataset.action);
            calculator.square();
            calculator.updateDisplay();
        }
        
        // Gestisce le operazioni di memoria
        if (button.dataset.action === 'memory-clear') {
            handleSpecialOperation(button.dataset.action);
            calculator.memoryClear();
        }
        
        if (button.dataset.action === 'memory-recall') {
            handleSpecialOperation(button.dataset.action);
            calculator.memoryRecall();
        }
        
        if (button.dataset.action === 'memory-add') {
            handleSpecialOperation(button.dataset.action);
            calculator.memoryAdd();
        }
        
        if (button.dataset.action === 'memory-subtract') {
            handleSpecialOperation(button.dataset.action);
            calculator.memorySubtract();
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
    
    // Supporto per operazioni speciali con tasti
    if (event.key === 'r' || event.key === 'R') {  // r per radice quadrata
        calculator.sqrt();
        calculator.updateDisplay();
    }
    
    if (event.key === 'q' || event.key === 'x²') {  // q per quadrato
        calculator.square();
        calculator.updateDisplay();
    }
    
    // Supporto per le operazioni di memoria con tasti
    if ((event.ctrlKey || event.metaKey) && event.key === '1') {  // Ctrl+1 per MC
        calculator.memoryClear();
        event.preventDefault();
    }
    
    if ((event.ctrlKey || event.metaKey) && event.key === '2') {  // Ctrl+2 per MR
        calculator.memoryRecall();
        event.preventDefault();
    }
    
    if ((event.ctrlKey || event.metaKey) && event.key === '3') {  // Ctrl+3 per M+
        calculator.memoryAdd();
        event.preventDefault();
    }
    
    if ((event.ctrlKey || event.metaKey) && event.key === '4') {  // Ctrl+4 per M-
        calculator.memorySubtract();
        event.preventDefault();
    }
});

// Inizializza il display
calculator.updateDisplay();