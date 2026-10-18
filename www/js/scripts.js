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
    ];
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
 let aRandomNumber = Math.floor(Math.random() * 49);
 console.log("Random num is: " + aRandomNumber);
 console.log("Your luck is: " + arrLuck[aRandomNumber]);
 
// window.alert("Your fifth stat is: " + arrStats[4]);
// In the Console (F12) view the Array item
// This code runs w/o interaction. Automatic code
//console.log("Your 3rd stat is: " + arrStats[2]);
// ------ Lookup Tables END ------//