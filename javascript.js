const numbers = document.getElementById("numbers");
const equals = document.getElementById("equals");
const userEntry = document.getElementById("user-entry");
const container = document.querySelector(".container");
let userEntryValue = userEntry.value; 
let userInputNumbers = []; 
let operatorChosen = "";  
let isEqualsPassed = false;
let isOperatorSelected = false; 

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
    if (initialValue === 0) return 0;
    // ELSE IF num2 is zero return error otherwise return solution
    else if (currentValue === 0) return  "error";
    // ELSE return solution
    else return initialValue / currentValue; 
}

// Create an eventListener that takes two numbers and one operator run an appropriate function and attached to "=" 
const operate = function (array, operator) {
    switch (operator) {
        case "add":
            // return array.reduce(add); 
            numbers.textContent = array.reduce(add);
            break; 
        case "subtract": 
            // return array.reduce(subtract); 
            numbers.textContent = array.reduce(subtract);
            break; 
        case "multiply":
            // return array.reduce(multiply); 
            numbers.textContent = array.reduce(multiply);
            break; 
        case "divide":
            // return array.reduce(divide); 
            numbers.textContent = array.reduce(divide);
            break; 
        default: 
            return "error";
    }
    // IF returned solution (numbers.textContent) is more than 10 digits, round up

    // Pass the solution to userEntry.value
        userEntryValue = numbers.textContent;
        console.log("operator's solution passed to userEntryValue: " + userEntryValue);
        // empty userInputNumbers and push the solution
        userInputNumbers = [];
        userInputNumbers.push(userEntryValue);
} 

// Create an eventLister that displays numbers as user enters them upto 10 digits 
const displayNumEntry = function (e) {
    // IF any digit button is clicked and it is an first input, add to userEntry.value
    if (e.target.closest(".digit") && !isEqualsPassed && 
    userEntryValue.length <= 10) {
            userEntryValue += e.target.textContent;
            numbers.textContent = userEntryValue; 
            console.log("this is displayNumEntry function: isEqualsPassed-" +  isEqualsPassed)
    } 
}
// Attach the eventListener to all the number buttons (attached to the parent node)
container.addEventListener("click", displayNumEntry);

// Create a function that store the user's number input in the userInputNumbers
const storeNumbers = function () {
// Change the value stored in userEntryValue from string to decimal numbers 
    const strToNum = parseFloat(userEntryValue);
// IF userInputNumbers has less than 2 values stored
    if (userInputNumbers.length < 2) {
// Push it to fill in array[0]
        userInputNumbers.push(strToNum);
// ELSE maintain the values stored in the array up to 2 values 
    } else {
// remove the value in array[0] and push the new value 
        userInputNumbers.shift();
        userInputNumbers.push(strToNum);
    } 
}
// Create a function that displays the previously entered numbers UNTIL a new number is entered
const displayNumbers = function () {
    // IF this is the initial number entry, display value of userInputNumbers[0] 
    if (userInputNumbers.length <= 1) {
        numbers.textContent = userInputNumbers[0];
    // Else IF this is not the initial entry, display value of userInputNumbers[1];
    } else if (userInputNumbers.length === 2){
        numbers.textContent = userInputNumbers[1];
    // Otherwise show error message
    } else {
        numbers.textContent = "error";
    }
    // Assign empty string to userEntry.value to refresh while keeping the numbers in textContent
    userEntryValue = "";  
}
// Create an eventListener that stores the user's selected operator in operatorChosen, store numbers, and display numbers
const selectOperator = function (e) { 
    const operatorButton = e.target.closest('button[data-operator]');
    if (operatorButton && !isOperatorSelected){
        // Store the selected operator in operatorChosen
        operatorChosen = operatorButton.dataset.operator;
        // IF the user pressed the operator multiple times, prevent from updating the value on textContent and userEntryValue from updating
        isOperatorSelected = true;
        storeNumbers();
        displayNumbers();
        console.log("This is selectOperator IF case: " + operatorChosen + "isOperatorSelected-" + isOperatorSelected);    
       // ELSE when the user pressed operator multiple times AND the new digits are not entered yet, update operatorChosen
    } else if (operatorButton) {
        operatorChosen = operatorButton.dataset.operator;
        console.log("This is selectOperator test ELSE case: userInputNumbers-" + userInputNumbers);
    }
}
// Attach the eventListener to operator buttons to respond on click 
container.addEventListener("click", selectOperator);

// Create an eventListener to run operate function 
const enterEquals = function () {
    storeNumbers();
    displayNumbers();
    // IF "=" has already been clicked and solution is finalized, keep the final solution in the textContent
    if (userInputNumbers.length === 2 && !isEqualsPassed){
        operate(userInputNumbers, operatorChosen); 
        isEqualsPassed = true; 
    } 
}
// Attach the eventListener to equals button 
equals.addEventListener("click", enterEquals);

// Avoid overflow by rounding answers with long decimals


// BONUS
// Add floating point for decimals
// The decimal need to be disabled once it is entered to avoid extra points entries
// Add a backspace button to undo entries

// PERSONALLY Added
// IF equals is pressed but want to do calculation after that,
// Activate the digit buttons to continue on calculation

// Create an eventLister that checks if the entry is only numeric or operator and equals when keydown event fired 
// ChatGPT answer:   

