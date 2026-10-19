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
// Array to keep track of all player's emails; on first run, empty;
// Gets populated as you create players (via fnNewGame()), and load saved data (via fnLoadGame())
let arrAllEmails = [];

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
    // updat\e high score
    // play a sound
    // change color
};

// Code to move from level to level, taking a screen we leave, a screen we go to, and WHO is questing
function fnNavGame(scHide, scShow, ourTroop){
    console.log("Leaving: " + scHide, "Entering: " + scShow, "Who: " + ourTroop);
}; // END fnNavGame()

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

     // Conditional Statement is a way to check for possibilities and act upon them
     // If..Else (Conditional Statement) used to check if all boxes are filled or not
     // if(ARE BOTH BOXES FILLED IN?) {TRUE.....} else {FALSE...};
     // Check if there is data in BOTH variables, made from those <input>
     // Use && (meaning AND) when checking that many things are TRUE
     // Use || (meaning OR) when checking that any things are TRUE
    if(valNGEmail && valNGName){
        // TRUE, all main code goes here
        console.log("TRUE: both boxes filled");

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

        // A characteris: constructor(hNAM, hHP, hSTR, hSPD, hMP, hLUK, hWEP, hCLS)
        // Next code: Display results on-screen; and store the new party in the database; play the 1st level
        // Access the placeholder <p> with the id of pNGResult and write new HTML/CSS there
        // NOTE: We use plain Assignment Operator (=) to set the name for the FIRST TIME
        document.querySelector("#pNGResult").innerHTML = "Name: <strong>" + tmpMainChar.hNAM;
        // NOTE: Use the Concatenation Assignment Operator (+=) to FURTHER add data
        document.querySelector("#pNGResult").innerHTML += "</strong><br>HP: " + tmpMainChar.hHP;
        document.querySelector("#pNGResult").innerHTML += "<br>STR: " + tmpMainChar.hSTR;
        document.querySelector("#pNGResult").innerHTML += "<br>SPD: " + tmpMainChar.hSPD;
        document.querySelector("#pNGResult").innerHTML += "<br>MP: " + tmpMainChar.hMP;
        document.querySelector("#pNGResult").innerHTML += "<br>LUK: " + tmpMainChar.hLUK;
        document.querySelector("#pNGResult").innerHTML += "<br>WEP: " + tmpMainChar.hWEP;
        document.querySelector("#pNGResult").innerHTML += "<br>CLS: " + tmpMainChar.hCLS;
        // Add the 2nd player, note we continue the += and build upon wha'ts prev there
        document.querySelector("#pNGResult").innerHTML += "<br><br>Name: <strong>" + tmpChar02.hNAM;
        document.querySelector("#pNGResult").innerHTML += "</strong><br>HP: " + tmpChar02.hHP;
        document.querySelector("#pNGResult").innerHTML += "<br>STR: " + tmpChar02.hSTR;
        document.querySelector("#pNGResult").innerHTML += "<br>SPD: " + tmpChar02.hSPD;
        document.querySelector("#pNGResult").innerHTML += "<br>MP: " + tmpChar02.hMP;
        document.querySelector("#pNGResult").innerHTML += "<br>LUK: " + tmpChar02.hLUK;
        document.querySelector("#pNGResult").innerHTML += "<br>WEP: " + tmpChar02.hWEP;
        document.querySelector("#pNGResult").innerHTML += "<br>CLS: " + tmpChar02.hCLS;
        // Character 3
        document.querySelector("#pNGResult").innerHTML += "<br><br>Name: <strong>" + tmpChar03.hNAM;
        document.querySelector("#pNGResult").innerHTML += "</strong><br>HP: " + tmpChar03.hHP;
        document.querySelector("#pNGResult").innerHTML += "<br>STR: " + tmpChar03.hSTR;
        document.querySelector("#pNGResult").innerHTML += "<br>SPD: " + tmpChar03.hSPD;
        document.querySelector("#pNGResult").innerHTML += "<br>MP: " + tmpChar03.hMP;
        document.querySelector("#pNGResult").innerHTML += "<br>LUK: " + tmpChar03.hLUK;
        document.querySelector("#pNGResult").innerHTML += "<br>WEP: " + tmpChar03.hWEP;
        document.querySelector("#pNGResult").innerHTML += "<br>CLS: " + tmpChar03.hCLS;

        // After rolling one party, stop. TO-DO: add up to 3 re-rolls
        document.querySelector("#pNGAction").style.display = "none";

        // Next, add a LEVEL ONE button to proceed to the first level; add to the previous placholder
        document.querySelector("#pNGResult").innerHTML += "<p>Excellent! Such a mighty party." + 
            " No, go! Proceed to XYZ LEVEL!</p> " + 
            "<p><button onclick='fnNavGame(`#scNewGame`, `#scLevelOne`, `" + valNGEmail + "`);'>Go!</button></p>";
        // NEXT: create the JSON formatted Object of the PLayer1/2/3/gold/path/weapns/secrets...
        /* {
             "LastName":"Campos",
             "FirstName":"Victor",
             "DOB":[1978, 01, 04],
             "fave_num":32768,
             "top-movies":{
                            "horror":"Halloween",
                            "comedy":"The Goonies",
                            "Adventure":"Raider of the Lost Ark"
                            }
           }; // END of JSON data
        */
        /*
            {
                "player1":{"hName":"Vik", "hSPD":99},
                "player2":{"hName":"Jan", "hSPD":22},
                "player3":{"hName":"Rob", "hSPD":33},
                "highest_level":[7, "Mad Mountain"]
            }; // END
        */
        // Create an Object that is in JSON format, storing all our Party data
        let tmpParty = {
            "_id":valNGEmail,
            "_questCompleted":false,
            "_currentScreen":"#scLevel01",
            "hPlayer01": tmpMainChar,
            "hPlayer02": tmpChar02,
            "hPlayer03": tmpChar03
        }; // END JSON data of tmpParty
        console.log("tmpParty JSON Object:" + tmpParty);
        // Display the Properties (Keys) of JSON Object: Object.keys(zyx)
        //console.log("tmpParty JSON Object:" + Object.keys(tmpParty));
        console.log("tmpParty JSON Object ID: " + tmpParty._id);
        console.log("tmpParty JSON Object NAME of Hero 1: " + tmpParty.hPlayer02.hNAM, tmpParty.hPlayer02.hWEP);
        // Now store, "permanantly" this Party on the hard drive of your device
        localStorage.setItem("lala","My amazing data!!");

        // Before storing this data, check if any previously existed
        // Take a peek at localStorage.getItem("lsAllPlayers") FIRST before proceeding
        // localStorage saves String data by default, unless we convert back and forth
        // JSON.stringify() > converts complex data to a simple string
        // JSON.parse() > converts simple string to a complex data object
        let tmpAllPlayers = JSON.parse(localStorage.getItem("lsAllPlayers"));
        if(tmpAllPlayers){
            // TRUE data, so add a new entry; Add [.push()] to the arrAllEmails
            console.log("TRUE; yes prev data. Add a NEW time");

            tmpAllPlayers.push(tmpParty._id);
            localStorage.setItem("lsAllPlayers", JSON.stringify(tmpAllPlayers));     
            localStorage.setItem(tmpParty._id, JSON.stringify(tmpParty));
        }else{
            // FALSE no data, so add entry for the first time; Add to the EMPTY arrAllEmails
                console.log("FALSE; no prev data. Save for the FIRST time.");
                // We need to store all player data, and each player data
                // Add this player's email to the gloabl list of emails
                arrAllEmails.push(tmpParty._id);
                // Store all Players (all emails) - NOTE: arrAllEmails defined at top, Global Variable
                localStorage.setItem("lsAllPlayers", JSON.stringify(arrAllEmails)); // ONE more thing...
                // Store this Player's data, based on their email
                localStorage.setItem(tmpParty._id, JSON.stringify(tmpParty)); // ONE MORE THING
        }; // END If..Else checker to see if previous data or not

    }else{
        // FALSE
        console.log("FALSE: not all boxes filled");
        // Tell the player to fill in all boxes; TO-DO: play a sound; vibrate
        window.alert("Please enter ALL fields!");
    }; // END If..Else checking BOTH boxes are filled

 }; // END fnNewGame()