const numbers = document.getElementById("numbers");
const equals = document.getElementById("equals");
const clear = document.getElementById("clear");
// const userEntry = document.getElementById("user-entry");
const container = document.querySelector(".container");
// let userEntryValue = userEntry.value; 
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
        return  "error";
    // ELSE return solution
    } else {
        return initialValue / currentValue; 
    }
}

// Create an eventListener that takes two numbers and one operator run an appropriate function 
const operate = function (array, operator) {
    switch (operator) {
        case "add":
            // numbers.textContent = array.reduce(add);
            return array.reduce(add);
            break; 
        case "subtract": 
            // numbers.textContent = array.reduce(subtract);
            return array.reduce(subtract);
            break; 
        case "multiply":
            // numbers.textContent = array.reduce(multiply);
            return array.reduce(multiply);
            break; 
        case "divide":
            // numbers.textContent = array.reduce(divide);
            return array.reduce(divide);
            break; 
        default: 
            return;
    }
// IF returned solution (numbers.textContent) is more than 10 digits, round up
}    
// Create an eventLister for "digit" buttons that calls event.target and displays numbers as user enters them upto 10 digits 
const displayNumEntry = function(target) {
    console.log("displayNumEntry called");
        // Edge: IF digit entry is made right after equals passed, refresh to start a new calculation 
        if (isDigitEntry && isEqualsPassed && isOperatorSelected && userInputNumbers.length === 1){
            enterClear();
        }
        // Overwrite with new entry and reset isOperatorSelected to push new operator entry, also change isEqualPassed true to false to continue calculation
        if (numbers.textContent === "0" || isOperatorSelected || isEqualsPassed){
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
const storeOperand = function() {
    let stringToNumber = parseFloat(numbers.textContent);
    if (typeof stringToNumber === "number"){
        userInputNumbers.push(stringToNumber);
    } else {
        return;
    }
}

// Create an eventListener for "equals" button that stores operand2, run operate, and display result
const enterEquals = function() {
    // Edge: equals button is pressed without a new digit entry after the last calculation, clear the display
    // if (isEqualsPassed && !isDigitEntry) {
    //     enterClear();
    //     return;
    // }
    // IF operand1 is filled and operand2 is ready, start calculation upon equals click
    if (!isEqualsPassed && userInputNumbers.length === 1 && isDigitEntry){
        // Edge: operator button is clicked after equals passed, ignore the following actions to avoid bug calculation
        if (isOperatorSelected){
            return;
        } 
        storeOperand();
        numbers.textContent = operate(userInputNumbers, operatorChosen);
        userInputNumbers =[];
        storeOperand();
        isEqualsPassed = true;
        isOperatorSelected = true; 
    } else {
        return;
    }
}
// Create an eventListener for "operate" buttons that calls event.target 
// stores operator choice
const prepareCalculation = function(target) {
    console.log("selectOperator called");
    // Edge: only update operatorChosen when operator button is clicked more than once 
        if (isOperatorSelected) {
            operatorChosen = target.dataset.operator;
            isEqualsPassed = false; // Edge: Continue calculation after "equals" is passed 
    // IF this is the first operator button click update operatorChosen &  userInputNumbers 
        } else { 
            isOperatorSelected = true;
            isDigitEntry = false;
            switch(userInputNumbers.length) {
                case 0:
                    operatorChosen = target.dataset.operator;
                    storeOperand();
                    break; 
                case 1: 
                    storeOperand();
                    numbers.textContent = operate(userInputNumbers, operatorChosen);
                    userInputNumbers =[];
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
    if (digitButton && numbers.textContent.length <= 10) {
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

// Avoid overflow by rounding answers with long decimals

// Equal Gotchas
// Clear operatorChosen and userInputNumbers to stop recycling previous result and operator that results in buggy calculation
// const resetOpOpd = function () {
//     operatorChosen = "";
//     userInputNumbers = [];
//     isOperatorSelected = false; 
// }

// BONUS
// Add floating point for decimals
// The decimal need to be disabled once it is entered to avoid extra points entries
// Add a backspace button to undo entries

// PERSONALLY Added
// Add "ON" button and add eventListener that activate all the eventListeners to accommodate "equals" function that removes all the eventListeners
// IF equals is pressed but want to do calculation after that,
// Activate the digit buttons to continue on calculation

// Create an eventLister that checks if the entry is only numeric or operator and equals when keydown event fired 



