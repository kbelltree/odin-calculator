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

// Avoid overflow by rounding answers with long decimals 
// Remove redundant zero display after decimals
const trimDecimals = function (number) {
    let trimmedToTenDigits = number.toPrecision(10);
    return parseFloat(trimmedToTenDigits);
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
    if (typeof result !== "number"){
        return result; 
    } else {
    return trimDecimals(result);
    }
}

// Create an eventLister for "digit" buttons that calls event.target and displays numbers as user enters them 
const displayNumEntry = function (target) {
    console.log("displayNumEntry called");
    // Edge: IF digit entry is made right after equals passed, refresh to start a new calculation 
    if (isDigitEntry && isEqualsPassed && isOperatorSelected && userInputNumbers.length === 1) {
        enterClear();
    }
    // Overwrite with new entry and reset isOperatorSelected to push new operator entry, also switch isEqualPassed from true to false to continue calculation
    if (numbers.textContent === "0" || isOperatorSelected || isEqualsPassed) {
        numbers.textContent = target.textContent;
        isOperatorSelected = false;
        // isEqualsPassed = false; // Reset the flag when a number button is clicked
        isDigitEntry = true;
        // Continue to enter digit if equals is not clicked 
    } else {
        numbers.textContent += target.textContent;
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

// Create an eventListener for "equals" button that stores operand2, run operate, and display result
const enterEquals = function () {
    // IF operand1 is filled and operand2 is ready, start calculation upon equals click
    if (!isEqualsPassed && userInputNumbers.length === 1 && isDigitEntry) {
        // Edge: IF operator button is clicked after equals passed, ignore the following actions to avoid bug calculation
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
// Create an eventListener for "operate" buttons that calls event.target 
// stores operator choice
const prepareCalculation = function (target) {
    console.log("selectOperator called");
    // Edge: only update operatorChosen when operator button is clicked more than once 
    if (isOperatorSelected) {
        operatorChosen = target.dataset.operator;
        isEqualsPassed = false; // Edge: Continue calculation after "equals" is passed 
        // IF this is the first operator button click update operatorChosen &  userInputNumbers 
    } else {
        isOperatorSelected = true;
        isDigitEntry = false;
        switch (userInputNumbers.length) {
            case 0:
                operatorChosen = target.dataset.operator;
                storeOperand();
                break;
            case 1:
                storeOperand();
                numbers.textContent = operate(userInputNumbers, operatorChosen);
                userInputNumbers = [];
                storeOperand();
                operatorChosen = target.dataset.operator;
                break;
            default:
                return;
        }
    }
}

// Chat GPT 4 advises using delegation on eventHandler that handle digit buttons and operator buttons all in one
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
// Attach eventListener to equal button 
equals.addEventListener("click", enterEquals);

// Create an eventListener that clears the display on click 
const enterClear = function () {
    // Restore all the dynamically filled variables back to the initial state
    // userEntryValue = "";
    numbers.textContent = "0";
    userInputNumbers = [];
    operatorChosen = "";
    isEqualsPassed = false;
    isOperatorSelected = false;
}
// Attach the eventListener to clear button 
clear.addEventListener("click", enterClear);

// BONUS
// Create an eventListener that adds floating point for decimals
const addDecimalPoint = function () {
    if (!numbers.textContent.includes(".")) {
        numbers.textContent += ".";
    }
}
// Attach the eventListener to decimal button
decimal.addEventListener("click", addDecimalPoint);

// Create an eventListener that undo entries
const deleteEntry = function () {
    if (numbers.textContent.length > 0) {
        numbers.textContent = numbers.textContent.slice(0, -1);
    } else {
        numbers.textContent = "error";
    }
}
// Attach the eventListener to del button
backspace.addEventListener("click", deleteEntry);

// PERSONALLY Added

// Create an eventLister that checks if the entry is only numeric or operator and equals when keydown event fired 

// Adjust size of digits in display as the digits increase


