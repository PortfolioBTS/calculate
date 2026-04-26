const display = document.querySelector('.display input');
const keys = document.querySelector('.keys');

let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

keys.addEventListener('click', (event) => {
    const target = event.target;
    if (!target.matches('button')) {
        return;
    }

    const key = target.textContent;

    if (key === 'C') {
        clearCalculator();
        return;
    }

    if (key === '±') {
        toggleSign();
        return;
    }

    if (key === '%') {
        applyPercent();
        return;
    }

    if (key === '=') {
        calculate();
        return;
    }

    if (['+', '−', '×', '÷'].includes(key)) {
        setOperator(key);
        return;
    }

    if (key === '.') {
        inputDecimal();
        return;
    }

    if (/^[0-9]$/.test(key)) {
        inputDigit(key);
    }
});

function inputDigit(digit) {
    if (display.value === 'Ошибка') {
        clearCalculator();
    }

    if (waitingForSecondValue) {
        display.value = digit;
        waitingForSecondValue = false;
        return;
    }

    display.value = display.value === '0' ? digit : display.value + digit;
}

function inputDecimal() {
    if (waitingForSecondValue) {
        display.value = '0.';
        waitingForSecondValue = false;
        return;
    }

    if (!display.value.includes('.')) {
        display.value += '.';
    }
}

function clearCalculator() {
    display.value = '0';
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
}

function toggleSign() {
    if (display.value === '0' || display.value === 'Ошибка') {
        return;
    }

    display.value = display.value.startsWith('-')
        ? display.value.slice(1)
        : '-' + display.value;
}

function applyPercent() {
    if (display.value === 'Ошибка') {
        return;
    }

    display.value = String(parseFloat(display.value) / 100);
}

function setOperator(nextOperator) {
    const inputValue = parseFloat(display.value);

    if (operator && waitingForSecondValue) {
        operator = nextOperator;
        return;
    }

    if (firstValue === null) {
        firstValue = inputValue;
    } else if (operator) {
        const result = calculateResult(firstValue, inputValue, operator);
        display.value = String(result);
        firstValue = result;
    }

    operator = nextOperator;
    waitingForSecondValue = true;
}

function calculate() {
    if (operator === null || waitingForSecondValue) {
        return;
    }

    const secondValue = parseFloat(display.value);
    const result = calculateResult(firstValue, secondValue, operator);
    display.value = String(result);
    firstValue = result;
    operator = null;
    waitingForSecondValue = false;
}

function calculateResult(a, b, operator) {
    switch (operator) {
        case '+':
            return a + b;
        case '−':
            return a - b;
        case '×':
            return a * b;
        case '÷':
            return b === 0 ? 'Ошибка' : a / b;
        default:
            return b;
    }
}
