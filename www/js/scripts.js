// This is a JavaScript Comment - Single Line
/* This is also a JS Comment - Multi Line Comment 
    JS is an Object Oriented Programming Language (OOP)
    Meaning: JS works with Objects that represent
        Names, Numbers, Groups Data, Actions, Abstract Concepts
    car = Tires, Paint Color, MPG, Seats  <-- We define it
    window <-- PREDEFINED
    Syntax for Built-in Objects and Methods and Parameter
    Object.Method("Parameter");
    ThingToWorkWith.ThingToDo("DetailsOfTheThing");
    Object - also known as Variable
    Method - alsko known as Function
    Parameter - Arguement
    We have hundreds of built in JS to work with,
        and we will often create our own
    var OBJECT = DATA; // create a Variable v1.0
    let OBJECT = DATA; // (let me create) a Variable v2.0
    const OBJECT = DATA; // create a Constant v2.0
    Purpose: define our own Objects to work with them
*/

// Make a simple popup
// window.alert("Hello!");
let hiScore = 0; // Define a HiScore Object and set its data to Zero (0) points

// ----------  Startup Messages START ---------- //
let pWelcomeMsg = document.querySelector("#kittycat"); // Keep track of that paragraph
 pWelcomeMsg.innerHTML = "Hello travellers. Start a new game or return to an old one. ";
let pLoadGameMsg = document.querySelector("#pLGMsg");
 pLoadGameMsg.innerHTML = "Hello traveller, return to your party!";
let pNewGameMsg = document.querySelector("#pNGMsg");
 pNewGameMsg.innerHTML = "Have the Sage gather your party!";
// ----------  Startup Messages END ---------- //

// This code runs after interaction (press a button onlick)
function fnNavMenu(scHide, scShow){
    /*
        scHide {display:none;}
        scShow {display:block;}
    */
    document.querySelector(scHide).style.display = "none";
    document.querySelector(scShow).style.display = "block";
    // update high score
    // play a sound
    // change color
};

// ------ Lookup Tables START ------//
 /* A collection of all possible values, items, enemies, levels */
 // Create an Array of 5 possible stats to lookup as needed
 let arrStats = [10, 25, 50, 75, 100];
 let arrStatsBadGuys = [20, 50, 100, 150, 200];
 // All possible Weapons our characters have
 let arrWeapons = [
      "Sword", 
      "Staff", 
      "Bow & Arrows", 
      "Magic Wand", 
      "Flail", 
      "Throwing Knives"
     ];
 let arrClasses = [
     "Knight", 
     "Healer", 
     "Bard",
     "Archer"
    ]; // END arrClasses()
 // Luck generator: 40 out 50 times = 1 (standard luck)
                    // 5 out of 50 times = 2 double luck
                    // 4 out of 50 times = 3 triple luck
                    // 1 out of 50 times = massive luck 10x
 let arrLuck = [
     1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
     1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
     1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
     1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
     2, 2, 2, 2, 2, 3, 3, 3, 3, 10
 ];

 // .length Property of an Array outputs (gets) how man items in an Array
//  console.log("Tell me how many items in this array: " + arrLuck.length);
//  let aRandomNumber = Math.floor(Math.random() * arrLuck.length);
//  console.log("Random num is: " + aRandomNumber);
//  console.log("Your luck is: " + arrLuck[aRandomNumber]);

 let arrNamesGood = ["Anda", "Bordon", "Cazzi", "Delzorr", "Enyala"];
 let arrNamesBad  = ["Zech", "Yara", "Xerk", "Winza", "Vixtorr"];
 
// window.alert("Your fifth stat is: " + arrStats[4]);
// In the Console (F12) view the Array item
// This code runs w/o interaction. Automatic code
//console.log("Your 3rd stat is: " + arrStats[2]);
// ------ Lookup Tables END ------//

// Fuction (action/command) to pick (get) a value from any Array
function fnGetRandomArr(anArray){
    console.log("fnGetRandomArr() is running");
    console.log("Array name: " + " + 'anArray' + "); // come back and fix later!!!!!
    console.log("Array items: " + anArray);

    // Generate a random number, based on the .length of the chosen array
    let aRandomNumber = Math.floor(Math.random() * anArray.length);
    // Note, this Object has the SAME name as Line 107. That's okay because
    // this is a Local Scope Variable (Only exists as the function runs)
    // The one above is a Global Scope Variable (Always exists)

    // Then return to the rest of the app, the selected data
    return anArray[aRandomNumber];
    // return anArray[Math.floor(Math.random() * anArray.length)];
 }; // END fnGetRandommArr()

 console.log(window.fnGetRandomArr(arrWeapons));

 // Function to pick a number from a range (inclusive)
 function fnRandomNumRange(minNum, maxNum){
     console.log("fnRandomNumRange() is running");
     return Math.floor(Math.random() * (maxNum - minNum + 1) ) + minNum ;
 }; // END fnRandomNumRange()
 console.log(window.fnRandomNumRange(1, 100));

 // Define the meaning of what a Main Character/Player is
 class Heroes{
     constructor(hNAM, hHP, hSTR, hSPD, hMP, hLUK, hWEP, hCLS){
         // Assign the input values to these Properties
         this.hNAM = hNAM;
         this.hHP = hHP;
         this.hSTR = hSTR;
         this.hSPD = hSPD;
         this.hMP = hMP;
         this.hLUK = hLUK;
         this.hWEP = hWEP;
         this.hCLS = hCLS;
     }; // END Constructor of Properties
 }; // END of Heroes{} Class definition

 // Generate New Game / New Party 
 function fnNewGame(){
     console.log("fnNewGame() is running");
     // Read the data (values) of the two <input> in the pNGAction
     let valNGName = document.querySelector("#pNGName").value;
     let valNGEmail = document.querySelector("#pNGEmail").value;
     console.log(valNGName, valNGEmail);

     // To-do: confirm no empty inputs and "real" data

     // Generate Main Character (you)
     let tmpMainChar = new Heroes(valNGName, 
        fnGetRandomArr(arrStats), 
        fnGetRandomArr(arrStats),
        fnGetRandomArr(arrStats),
        fnGetRandomArr(arrStats),
        fnGetRandomArr(arrLuck),
        fnGetRandomArr(arrWeapons),
        fnGetRandomArr(arrClasses));
     console.log(tmpMainChar);

     // Generate 2nd player
     let tmpChar02 = new Heroes(fnGetRandomArr(arrNamesGood), 
        fnGetRandomArr(arrStats), 
        fnGetRandomArr(arrStats),
        fnGetRandomArr(arrStats),
        fnGetRandomArr(arrStats),
        fnGetRandomArr(arrLuck),
        fnGetRandomArr(arrWeapons),
        fnGetRandomArr(arrClasses));
     console.log(tmpChar02);

     // Generate 3rd player
     let tmpChar03 = new Heroes(fnGetRandomArr(arrNamesGood), 
        fnGetRandomArr(arrStats), 
        fnGetRandomArr(arrStats),
        fnGetRandomArr(arrStats),
        fnGetRandomArr(arrStats),
        fnGetRandomArr(arrLuck),
        fnGetRandomArr(arrWeapons),
        fnGetRandomArr(arrClasses));
     console.log(tmpChar03);
 }; // END fnNewGame()