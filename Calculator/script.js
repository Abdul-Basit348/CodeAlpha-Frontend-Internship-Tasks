class Calculator {
    constructor() {
        // DOM Elements
        this.displayElement = document.getElementById('display');
        this.previousOperationElement = document.getElementById('previousOperation');

        // Calculator State
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.lastResult = null;

        // Initialize
        this.init();
    }

    /**
     * Initialize calculator - set up event listeners
     */
    init() {
        this.attachButtonListeners();
        this.attachKeyboardListeners();
        this.updateDisplay();
    }

    /**
     * Attach click event listeners to all buttons
     */
    attachButtonListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.dataset.number);
            });
        });

        // Operator buttons
        document.querySelectorAll('[data-operator]').forEach(button => {
            button.addEventListener('click', () => {
                this.setOperator(button.dataset.operator);
            });
        });

        // Action buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                this.handleAction(button.dataset.action);
            });
        });
    }

    /**
     * Attach keyboard event listeners for keyboard input support
     */
    attachKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            // Prevent default for calculator keys to avoid page scrolling, etc.
            if (/^[0-9+\-*/=.]$/.test(e.key) || e.key === 'Enter' || e.key === 'Escape' || e.key === 'Backspace') {
                e.preventDefault();
            }

            // Number keys
            if (/^[0-9.]$/.test(e.key)) {
                this.appendNumber(e.key);
            }

            // Operator keys
            else if (['+', '-', '*', '/'].includes(e.key)) {
                this.setOperator(e.key);
            }

            // Enter or Equals
            else if (e.key === 'Enter' || e.key === '=') {
                this.handleAction('equals');
            }

            // Escape for clear
            else if (e.key === 'Escape') {
                this.handleAction('clear');
            }

            // Backspace for delete
            else if (e.key === 'Backspace') {
                this.handleAction('delete');
            }
        });
    }

    /**
     * Append a number or decimal point to the current value
     * @param {string} number - The number or decimal point to append
     */
    appendNumber(number) {
        // Reset display if needed (after operator or equals)
        if (this.shouldResetDisplay) {
            this.currentValue = '0';
            this.shouldResetDisplay = false;
        }

        // Handle decimal point
        if (number === '.') {
            // Prevent multiple decimal points
            if (this.currentValue.includes('.')) return;
            // If current value is empty or just reset, start with "0."
            if (this.currentValue === '0' || this.currentValue === '') {
                this.currentValue = '0.';
            } else {
                this.currentValue += '.';
            }
        }
        // Handle numbers
        else {
            // Replace initial zero unless it's a decimal number
            if (this.currentValue === '0') {
                this.currentValue = number;
            } else {
                // Limit input length to prevent overflow
                if (this.currentValue.length < 12) {
                    this.currentValue += number;
                }
            }
        }

        this.updateDisplay();
    }

    /**
     * Set the operator for the calculation
     * @param {string} operator - The operator (+, -, *, /)
     */
    setOperator(operator) {
        // If there's already an operator and current value, calculate first
        if (this.operator !== null && !this.shouldResetDisplay) {
            this.calculate();
        }

        // Store previous value and operator
        this.previousValue = this.currentValue;
        this.operator = operator;
        this.shouldResetDisplay = true;

        // Update previous operation display
        this.updatePreviousOperation();
    }

    /**
     * Handle action buttons (clear, delete, equals)
     * @param {string} action - The action to perform
     */
    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
            case 'equals':
                this.calculate();
                break;
        }
    }

    /**
     * Perform the calculation based on the current operator
     */
    calculate() {
        // Ensure we have all required values
        if (this.operator === null || this.previousValue === '') return;

        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);

        // Handle invalid numbers
        if (isNaN(prev) || isNaN(current)) return;

        let result;

        // Perform calculation based on operator
        switch (this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                // Handle division by zero
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Round result to avoid floating point precision issues
        result = Math.round(result * 100000000) / 100000000;

        // Update state
        this.lastResult = result;
        this.currentValue = result.toString();
        this.operator = null;
        this.previousValue = '';
        this.shouldResetDisplay = true;

        // Update display
        this.updateDisplay();
        this.updatePreviousOperation();
    }

    /**
     * Clear all calculator state
     */
    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.lastResult = null;
        this.updateDisplay();
        this.updatePreviousOperation();
    }

    /**
     * Delete the last character from current value (backspace)
     */
    delete() {
        // Don't delete if display is about to be reset
        if (this.shouldResetDisplay) return;

        // Remove last character
        this.currentValue = this.currentValue.slice(0, -1);

        // If empty, set to 0
        if (this.currentValue === '' || this.currentValue === '-') {
            this.currentValue = '0';
        }

        this.updateDisplay();
    }

    /**
     * Update the main display with current value
     */
    updateDisplay() {
        this.displayElement.textContent = this.currentValue;

        // Remove error class if present
        this.displayElement.classList.remove('error');
    }

    /**
     * Update the previous operation display
     */
    updatePreviousOperation() {
        if (this.previousValue && this.operator) {
            // Convert operator symbols for display
            const operatorSymbols = {
                '+': '+',
                '-': '−',
                '*': '×',
                '/': '÷'
            };
            this.previousOperationElement.textContent =
                `${this.previousValue} ${operatorSymbols[this.operator]}`;
        } else {
            this.previousOperationElement.textContent = '';
        }
    }

    /**
     * Show an error message on the display
     * @param {string} message - The error message to display
     */
    showError(message) {
        this.displayElement.textContent = message;
        this.displayElement.classList.add('error');

        // Reset after 2 seconds
        setTimeout(() => {
            this.clear();
        }, 2000);
    }
}

// ==================== INITIALIZE CALCULATOR ====================
// Create calculator instance when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
});