const numbers = document.getElementById("numbers");
const equals = document.getElementById("equals");
const clear = document.getElementById("clear");
const decimal = document.getElementById("decimal");
const backspace = document.getElementById("delete");
const container = document.querySelector(".container");
let userInputNumbers = [];
let operatorChosen = "";
let isEqualsPassed = false;
let isOperatorSelected = false;
let isDigitEntry = false;

const add = function (initialValue, currentValue) {
    return initialValue + currentValue;
}

const subtract = function (initialValue, currentValue) {
    return initialValue - currentValue;
}

const multiply = function (initialValue, currentValue) {
    return initialValue * currentValue;
}

const divide = function (initialValue, currentValue) {
    // IF num1 is zero return 0;
    if (initialValue === 0) {
        return 0;
        // ELSE IF num2 is zero return error otherwise return solution
    } else if (currentValue === 0) {
        return "error";
        // ELSE return solution
    } else {
        return initialValue / currentValue;
    }
}

/* Avoid overflow by rounding answers with long decimals 
   Remove redundant zero display in the bottom of decimal place */
const trimDecimals = function (number) {
    let trimmedToTenDigits = number.toPrecision(10);
    let trimmedDecimalPlace = parseFloat(trimmedToTenDigits);

    // IF the entire digits are more than 11 digits, use exponential symbols
    if (trimmedDecimalPlace.toString().length > 11) {
        return trimmedDecimalPlace.toExponential(5);
    } else {
        return trimmedDecimalPlace;
    }
}

// Create an eventListener that takes two numbers and one operator, then run an appropriate function 
const operate = function (array, operator) {
    let result = 0;
    switch (operator) {
        case "add":
            result = array.reduce(add);
            break;
        case "subtract":
            result = array.reduce(subtract);
            break;
        case "multiply":
            result = array.reduce(multiply);
            break;
        case "divide":
            result = array.reduce(divide);
            break;
        default:
            return;
    }
    // IF result contains error message, return the message
    return typeof result !== "number" ? result : trimDecimals(result);
}

/* Create an eventLister for "digit" buttons that calls event.target and displays numbers as user enters them. Extra Credit: Make this function also work with digit keydown event */
const displayNumEntry = function (target, isFromKeydown = false) {

    // IF digit entry is from key, use value from key, otherwise from textContent 
    const valueEntered = isFromKeydown ? target.key : target.textContent;

    // Edge: IF digit entry is made right after equals passed, refresh to start a new calculation 
    if (isDigitEntry && isEqualsPassed && isOperatorSelected && userInputNumbers.length === 1) {
        enterClear();
    }

    /* Overwrite with new entry and reset isOperatorSelected to push new operator entry. Also switch isEqualPassed from true to false to continue calculation */
    if (numbers.textContent === "0" || isOperatorSelected || isEqualsPassed) {
        numbers.textContent = valueEntered;
        isOperatorSelected = false;
        isDigitEntry = true;

        // Continue to enter digit if equals is not clicked up to length of 11
    } else if (numbers.textContent.length < 11) {
        numbers.textContent += valueEntered;
    }
}

// Create a function that changes the textContent entry to number type and store it 
const storeOperand = function () {
    let stringToNumber = parseFloat(numbers.textContent);
    if (typeof stringToNumber === "number") {
        userInputNumbers.push(stringToNumber);
    } else {
        return;
    }
}

/* Create an eventListener for "equals" button that stores operand2, run operate, and display result. Extra Credit: Make this function also work with digit keydown event */
const enterEquals = function () {
    // IF operand1 is filled and operand2 is ready, start calculation upon equals click
    if (!isEqualsPassed && userInputNumbers.length === 1 && isDigitEntry) {

        // Edge: IF operator button is clicked after equals passed, skip rest of the actions 
        if (isOperatorSelected) {
            return;
        }
        storeOperand();
        numbers.textContent = operate(userInputNumbers, operatorChosen);
        userInputNumbers = [];
        storeOperand();
        isEqualsPassed = true;
        isOperatorSelected = true;
    } else {
        return;
    }
}

// Attach eventListener to equal button 
equals.addEventListener("click", enterEquals);

/* Create an eventListener for "operate" buttons that calls event.target and stores operator choice. Extra Credit: Make this function also work with operator keydown event */
const prepareCalculation = function (target, isFromKeydown = false) {

    // IF the digit entry is from key, use value from key, otherwise from textContent 
    const operatorEntered = isFromKeydown ? stringifyOperator(target.key) : target.dataset.operator;

    // Edge: only update operatorChosen when operator button is clicked more than once 
    if (isOperatorSelected) {
        operatorChosen = operatorEntered;

        // Edge: Continue calculation after "equals" is passed 
        isEqualsPassed = false;

        // IF this is the first operator button click update operatorChosen &  userInputNumbers 
    } else {
        isOperatorSelected = true;
        isDigitEntry = false;
        switch (userInputNumbers.length) {
            case 0:
                operatorChosen = operatorEntered;
                storeOperand();
                break;
            case 1:
                storeOperand();
                numbers.textContent = operate(userInputNumbers, operatorChosen);
                userInputNumbers = [];
                storeOperand();
                operatorChosen = operatorEntered;
                break;
            default:
                return;
        }
    }
}

// Use delegation on eventHandler that handle digit buttons and operator buttons all in one 
const handleDigitOperatorClick = function (e) {
    const digitButton = e.target.closest(".digit");
    const operatorButton = e.target.closest('button[data-operator]');

    // IF digit button is clicked
    if (digitButton) {
        displayNumEntry(digitButton);
    }

    // IF operator button is clicked
    if (operatorButton) {
        prepareCalculation(operatorButton);
    }
}

// Attach eventListener to all the digit buttons & operator buttons (attached to the parent node)
container.addEventListener("click", handleDigitOperatorClick);

// Create an eventListener that clears the display on click 
const enterClear = function () {
    // Restore all the dynamically filled variables back to the initial state
    numbers.textContent = "0";
    userInputNumbers = [];
    operatorChosen = "";
    isEqualsPassed = false;
    isOperatorSelected = false;
    isDigitEntry = false;
}

// Attach the eventListener to clear button 
clear.addEventListener("click", enterClear);

// EXTRA CREDIT Features

// Create an eventListener that adds floating point for decimals
const addDecimalPoint = function () {
    if (!numbers.textContent.includes(".")) {
        numbers.textContent += ".";
    }
}

// Attach the eventListener to decimal button
decimal.addEventListener("click", addDecimalPoint);

// Create an eventListener that undoes entries
const deleteEntry = function () {
    if (numbers.textContent.length > 0) {
        numbers.textContent = numbers.textContent.slice(0, -1); // Remove from right to left
    } else {
        numbers.textContent = "error";
    }
}

// Attach the eventListener to del button
backspace.addEventListener("click", deleteEntry);

// Create an eventListener that checks if the entry is digit on keydown 
const handleDigitKeydown = function (e) {
    if (e.key >= 0 && e.key <= 9) {
        displayNumEntry(e, true);
    }
}

// Attach the eventListener to digit keys
document.addEventListener("keydown", handleDigitKeydown);

// Create an eventListener that checks if the entry is operator on keydown
const handleOperatorKeydown = function (e) {
    const operatorKeys = ["+", "-", "*", "/"];
    if (operatorKeys.includes(e.key)) {
        prepareCalculation(e, true);
    }
}

// Declare a function for logical flow to stringify the arithmetic operator value passed from e.key 
function stringifyOperator(symbol) {
    const operatorMap = {
        "/": "divide",
        "*": "multiply",
        "-": "subtract",
        "+": "add",
    };
    return operatorMap[symbol] || null;
}

// Attach the eventListener to operator keys
document.addEventListener("keydown", handleOperatorKeydown);

// Create an eventListener that checks if the entry is equals on keydown
const handleEqualsKeydown = function (e) {
    if (e.key === "=") {
        enterEquals();
    }
}

// Attach the eventListener to equals key
document.addEventListener("keydown", handleEqualsKeydown);

// Create an eventListener that checks if the entry is decimal on keydown
const handleDecimalKeydown = function (e) {
    if (e.key === ".") {
        addDecimalPoint();
    }
}

// Attach the eventListener to decimal key
document.addEventListener("keydown", handleDecimalKeydown);

// Create an eventListener that checks if the entry is delete on keydown
const handleDeleteKeydown = function (e) {
    if (e.key === "Backspace") {
        deleteEntry();
    }
}

// Attach the eventListener to delete key
document.addEventListener("keydown", handleDeleteKeydown);




