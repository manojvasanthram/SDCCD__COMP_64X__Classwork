
let hiScore = 0; // Define a HiScore Object and set its data to Zero (0) points
// Array to keep track of all player's emails; on first run, empty;
// Gets populated as you create players (via fnNewGame()), and load saved data (via fnLoadGame())
let arrAllEmails = [];

// ----------  App Init START ---------- //
function fnAppInit(){
    console.log("fnAppInit() is running");

    // Set up a check to see if any saved games exist or not
    let tmpLsAllPlayers = JSON.parse(localStorage.getItem("lsAllPlayers"));

    // CONDITIONAL STATEMENT TO MAKE DECISIONS ON FIRST RUN, OR NOT
    // Using ! means NOT (opposite) of what we're checking
    if(!tmpLsAllPlayers){
        console.log("TRUE we do NOT have any saved gaems");
        // ffffff (auto-load)...........................................................<<<<<<<<<<<<<<<<<<<<<<<<<

        // Display that we have no saved games yet
        document.querySelector("#spnLGSaves").innerHTML = "0";

        // Since no saved games, don't even have the option to load a game
        // document.querySelector().style.display = "none";
        // via the path of <secton> to <main> to <p> to <button> (1st button)
        document.querySelector("#scWelcome main p button").disabled = "true";
    }else{
        console.log("FALSE we DO have at least one saved game");
        
        // Display nmber of saved games so far
        document.querySelector("#spnLGSaves").innerHTML = tmpLsAllPlayers.length;

        // So, reactivate the Load button. Note: how we removed the Attribute
        document.querySelector("#scWelcome main p button").removeAttribute("disabled");

        // Start populating the placeholder of saved games
        // first blank out anything that might be there (note "" NO SPACE)
        document.querySelector("#pLGParty").innerHTML = "";
        // Conditional Statement to "loop" for X number of times and populate the screen
        // for(START, END, LOOP){};  For a certain number of times, loop
        for(let i=0; i<tmpLsAllPlayers.length; i++){
            // console.log("Loop #", i);
            console.log("Loop #", i, tmpLsAllPlayers[i]);
            // Load all the data of the specific player
            let tmpCurrentPlayerData = JSON.parse(localStorage.getItem(tmpLsAllPlayers[i]));
            // NOTE += to ADD a line to the placeholder
            // It's better to spell out a button, but Icons are fun!
            document.querySelector("#pLGParty").innerHTML += "<p>" + 
            tmpCurrentPlayerData.hPlayer01.hNAM + " <button onclick='fnGameLoad(`" + tmpLsAllPlayers[i] + "`);'>&#9876;</button></p>";
            // Use fnGameLoad() to load the player stats/progress/gold/etc ofthis party
            // NOTE THE VERY IMPORTANT USE OF " ' ` above
            // to their last level 
        }; // END for() loop
    }; // END If..Else saved game checker
}; // END fnAppInit()
// And then run this Init
window.fnAppInit();
// ----------  App Init END  ---------- //

// ---- Fucntion to Load a Game START ---- ///
function fnGameLoad(gameData){
    console.log("fnGameLoad() is running with", gameData);
    // Load the data of this Party
    let tmpCurrentPlayerData = JSON.parse(localStorage.getItem(gameData));
    console.log("PlayerData", tmpCurrentPlayerData);
    console.log("The current screeen", tmpCurrentPlayerData._currentScreen);
    console.log("Player 2's Class:", tmpCurrentPlayerData.hPlayer02.hCLS);

    // So send them back to their most recent level
    fnNavGame("#scLoadGame", tmpCurrentPlayerData._currentScreen, tmpCurrentPlayerData._id);
    // Also play a sound
    // Check the time of day to add an easter egg
}; // END fnGameLoad()
// ---- Fucntion to Load a Game END ---- ///

// ----------  Startup Messages START ---------- //
// Move this to App Init Function eventually...
let pWelcomeMsg = document.querySelector("#kittycat"); // Keep track of that paragraph
 pWelcomeMsg.innerHTML = "Hello travellers. Start a new game or return to an old one. ";
let pLoadGameMsg = document.querySelector("#pLGMsg");
 pLoadGameMsg.innerHTML = "Hello traveller, return to your party!";
let pNewGameMsg = document.querySelector("#pNGMsg");
 pNewGameMsg.innerHTML = "Have the Sage gather your party!";
// ----------  Startup Messages END ---------- //

// Navigate between menus (welcome, load, new, settings, etc)
function fnNavMenu(scHide, scShow){
    /* scHide {display:none;} scShow {display:block;} */
    document.querySelector(scHide).style.display = "none";
    document.querySelector(scShow).style.display = "block";
    // update high score,     // play a sound,     // change color
}; // END fnNavMenu()

// Code to move from level to level, taking a screen we leave, a screen we go to, and WHO is questing
function fnNavGame(scHide, scShow, ourTroop){
    console.log("Leaving: " + scHide, "Entering: " + scShow, "Who: " + ourTroop);

    // Hide the screen to leave and Show the screen to enter 
    document.querySelector(scHide).style.display = "none";
    document.querySelector(scShow).style.display = "block";
    // Conditional Statement to the run the code of the level
    // switch(){};  "switch" between possibilities 
    switch(scShow){
        case "#scTavern":
            console.log("OPTION1");
            fnLvTavern(ourTroop);
            break;
        case "#scLevel02":
            console.log("op1");
            fnLvLevel02(ourTroop);
            break;
        case "#scLevel03":
            console.log("opption3");
            fnLvLevel03(ourTroop);
            break;
        default:
            console.log("error?", scShow);
            break
    }; // END of level switcher
    ///
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
     ]; // END arrWeapons

 // List of character classes
 let arrClasses = [
     "Knight", 
     "Healer", 
     "Bard",
     "Archer"
    ]; // END arrClasses
 
 // Luck generator
 let arrLuck = [
     1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
     1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
     1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
     1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
     2, 2, 2, 2, 2, 3, 3, 3, 3, 10
 ]; // END arrLuck

 let arrNamesGood = ["Anda", "Bordon", "Cazzi", "Delzorr", "Enyala"];
 let arrNamesBad  = ["Zech", "Yara", "Xerk", "Winza", "Vixtorr"];
 let arrEnemyTypes = ["Goblin", "Troll", "Skeleton", "Pixie", "Nixie", "Dryad", "Unicorn"];
// ------ Lookup Tables END ------//

// Fuction (action/command) to pick (get) a value from any Array
function fnGetRandomArr(anArray){
    console.log("Array items: " + anArray);
    // Generate a random number, based on the .length of the chosen array
    let aRandomNumber = Math.floor(Math.random() * anArray.length);
    // Then return to the rest of the app, the selected data
    return anArray[aRandomNumber];
 }; // END fnGetRandommArr()

  // Function to pick a number from a range (inclusive)
 function fnRandomNumRange(minNum, maxNum){
     console.log("fnRandomNumRange() is running");
     return Math.floor(Math.random() * (maxNum - minNum + 1) ) + minNum ;
 }; // END fnRandomNumRange()
 
 // Define the meaning of what a Main Character/Player is
 class Heroes{
     constructor(hNAM, hHP, hSTR, hSPD, hMP, hLUK, hWEP, hCLS){
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

 // Generate New Game / New Party in #scNewGame
 function fnNewGame(){
     console.log("fnNewGame() is running");
     // Read the data (values) of the two <input> in the pNGAction
     let valNGName = document.querySelector("#pNGName").value;
     let valNGEmail = document.querySelector("#pNGEmail").value;
     console.log(valNGName, valNGEmail);

     // If..Else (Conditional Statement) used to check if all boxes are filled or not
    if(valNGEmail && valNGName){
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

            // Generate 2nd player
            let tmpChar02 = new Heroes(fnGetRandomArr(arrNamesGood), 
                fnGetRandomArr(arrStats), 
                fnGetRandomArr(arrStats),
                fnGetRandomArr(arrStats),
                fnGetRandomArr(arrStats),
                fnGetRandomArr(arrLuck),
                fnGetRandomArr(arrWeapons),
                fnGetRandomArr(arrClasses));

            // Generate 3rd player
            let tmpChar03 = new Heroes(fnGetRandomArr(arrNamesGood), 
                fnGetRandomArr(arrStats), 
                fnGetRandomArr(arrStats),
                fnGetRandomArr(arrStats),
                fnGetRandomArr(arrStats),
                fnGetRandomArr(arrLuck),
                fnGetRandomArr(arrWeapons),
                fnGetRandomArr(arrClasses));

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
            " Now, go! Proceed to Drunkard's Tavern!</p> " + 
            "<p><button onclick='fnNavGame(`#scNewGame`, `#scTavern`, `" + valNGEmail + "`);'>Go!</button></p>";

        // Create an Object that is in JSON format, storing all our Party data
        let tmpParty = {
            "_id":             valNGEmail,
            "_questCompleted": false,
            "_currentScreen":  "#scTavern",
            "hPlayer01":       tmpMainChar,
            "hPlayer02":       tmpChar02,
            "hPlayer03":       tmpChar03
        }; // END JSON data of tmpParty
        
        // Display the Properties (Keys) of JSON Object and more: 
        console.log("tmpParty JSON Object ID: " + Object.keys(tmpParty));
        console.log("tmpParty JSON Object ID: " + tmpParty._id);
        console.log("tmpParty JSON Object NAME of Hero 1: " + tmpParty.hPlayer01.hNAM, tmpParty.hPlayer01.hWEP);

        // Before storing this data, check if any previously existed
        // Take a peek at localStorage.getItem("lsAllPlayers") FIRST before proceeding
        // localStorage saves String data by default, unless we convert back and forth
        // JSON.stringify() > converts complex data to a simple string
        // JSON.parse() > converts simple string to a complex data object
        let tmpAllPlayers = JSON.parse(localStorage.getItem("lsAllPlayers"));
        if(tmpAllPlayers){
            console.log("TRUE; yes prev data. Add a NEW time");

            tmpAllPlayers.push(tmpParty._id);
            localStorage.setItem("lsAllPlayers", JSON.stringify(tmpAllPlayers));     
            localStorage.setItem(tmpParty._id, JSON.stringify(tmpParty));
        }else{
            console.log("FALSE; no prev data. Save for the FIRST time.");
            // Add this player's email to the gloabl list of emails
            arrAllEmails.push(tmpParty._id);
            // Store all Players (all emails) - NOTE: arrAllEmails defined at top, Global Variable
            localStorage.setItem("lsAllPlayers", JSON.stringify(arrAllEmails));
            // Store this Player's data, based on their email
            localStorage.setItem(tmpParty._id, JSON.stringify(tmpParty));
        }; // END If..Else checker to see if previous data or not
    }else{
        console.log("FALSE: not all boxes filled");
        // Tell the player to fill in all boxes; TO-DO: play a sound; vibrate
        window.alert("Please enter ALL fields!");
    }; // END If..Else checking BOTH boxes are filled
 }; // END fnNewGame()

// OOPS delete this one........ we did it right with fnGameLoad()!!!
// Function to load (existing) saved games, based on our first App Initialization (above)
//  function fnLoadGame(gameDatazz){
//      console.log("fnLoadGame() is about to load:", gameDatazz);
//  }; // END fnLoadGame()

// All the code of the Tavern Level
function fnLvTavern(ourTroop){
    console.log("At the Tavern with", ourTroop);
    // Load the data of the current party
    let tmpCurrentPlayerData = JSON.parse(localStorage.getItem(ourTroop));

    // Update the Tavern Message placeholder
    document.querySelector("#pTvnMessage").innerHTML  = "Welcome, " + tmpCurrentPlayerData.hPlayer01.hNAM + "! Grab some refreshments and chat with the various patrons of our fine establishement.";
    document.querySelector("#pTvnMessage").innerHTML += "<p>In this level, challenge an opponent to who has better STATS. </p>";

    /*
        <table> create the whole thing
        <tr> Table Row
        <td> Table Data (one cell)
    */
    document.querySelector("#pTvnParty").innerHTML = "<table border='1'>" +
     "<tr> <td><strong>" + tmpCurrentPlayerData.hPlayer01.hNAM +
     "</strong><br>HP:" + tmpCurrentPlayerData.hPlayer01.hHP +
     "<br>STR:" +tmpCurrentPlayerData.hPlayer01.hSTR +
     "<br>SPD:" +tmpCurrentPlayerData.hPlayer01.hSPD +
     "<br>MP:" +tmpCurrentPlayerData.hPlayer01.hMP +
     "<br>LUK:" +tmpCurrentPlayerData.hPlayer01.hLUK +
     "<br>WEP:" +tmpCurrentPlayerData.hPlayer01.hWEP +
     "<br>CLS:" +tmpCurrentPlayerData.hPlayer01.hCLS +
     "</td>" + 
     
     "<td><strong>" + tmpCurrentPlayerData.hPlayer02.hNAM +
     "</strong><br>HP:" + tmpCurrentPlayerData.hPlayer02.hHP +
     "<br>STR:" +tmpCurrentPlayerData.hPlayer02.hSTR +
     "<br>SPD:" +tmpCurrentPlayerData.hPlayer02.hSPD +
     "<br>MP:" +tmpCurrentPlayerData.hPlayer02.hMP +
     "<br>LUK:" +tmpCurrentPlayerData.hPlayer02.hLUK +
     "<br>WEP:" +tmpCurrentPlayerData.hPlayer02.hWEP +
     "<br>CLS:" +tmpCurrentPlayerData.hPlayer02.hCLS +
     "</td>" +  
     
    "<td><strong>" + tmpCurrentPlayerData.hPlayer03.hNAM +
     "</strong><br>HP:" + tmpCurrentPlayerData.hPlayer03.hHP +
     "<br>STR:" +tmpCurrentPlayerData.hPlayer03.hSTR +
     "<br>SPD:" +tmpCurrentPlayerData.hPlayer03.hSPD +
     "<br>MP:" +tmpCurrentPlayerData.hPlayer03.hMP +
     "<br>LUK:" +tmpCurrentPlayerData.hPlayer03.hLUK +
     "<br>WEP:" +tmpCurrentPlayerData.hPlayer03.hWEP +
     "<br>CLS:" +tmpCurrentPlayerData.hPlayer03.hCLS +
     "</td>" +  

     "</tr></table>"; // END of <table> of our party

     // Create a enemy
     let tvnEnemy01 = new Heroes(
         fnGetRandomArr(arrNamesBad),
         fnGetRandomArr(arrStats),
         fnGetRandomArr(arrStats),
         fnGetRandomArr(arrStats),
         fnGetRandomArr(arrStats),
         fnGetRandomArr(arrLuck),
         fnGetRandomArr(arrWeapons),
        fnGetRandomArr(arrEnemyTypes),
        ); // END tvnEnemy01
    console.log("evenmy1", tvnEnemy01);

    document.querySelector("#pTvnEnemy").innerHTML = "<p style='text-align: center;'><table border='1'><tr>" +
        "<td><strong>" + tvnEnemy01.hNAM + 
        "</strong><br>WEP: " + tvnEnemy01.hCLS +
        "<br>CLS: " + tvnEnemy01.hWEP +
        "</td>" +
        "</tr></table></p>";

    document.querySelector("#pTvnAction").innerHTML = "<p><button id='btnTvnStr'>STR</button> <button id='btnTvnSpd'>SPD</button> <button id='btnTvnMp'>MP</button></p>";

    // Note the different way of making the buttons clickable, because it doesn't exist until now...
    document.querySelector("#btnTvnStr").addEventListener("click", function(){ fnTvnAction("#btnTvnStr");});
    document.querySelector("#btnTvnSpd").addEventListener("click", function(){ fnTvnAction("#btnTvnSpd");});
    document.querySelector("#btnTvnMp").addEventListener("click", function(){  fnTvnAction("#btnTvnMp");});

        // Define the function tha runs after clicking any of the 3 buttons
        // A general purpose function deals with the three buttons
        function fnTvnAction(tvnBtn){
            console.log("fntvnaction is running, clicked:", tvnBtn);
            // An array holding our three players
            let tmpArrHeroes = [tmpCurrentPlayerData.hPlayer01, tmpCurrentPlayerData.hPlayer02, tmpCurrentPlayerData.hPlayer03];
            // Pick a hero to step forward with that challenge
            let tmpRndHero = tmpArrHeroes[Math.floor(Math.random() * tmpArrHeroes.length)];
            console.log("Player ", tmpRndHero, "will battle enemy", tvnEnemy01);
            // Conditional statement to pick between the 3 actions
            switch(tvnBtn){
                case "#btnTvnStr":
                    // Hero Str vs Enemy Str
                    fnTvnBattle("hSTR", "hSTR");
                    break;
                case "#btnTvnSpd":
                    fnTvnBattle("hSPD", "hSPD");
                    break;
                case "#btnTvnMp":
                    fnTvnBattle("hMP", "hMP");
                    break;
                default: 
                    console.log("Erro??", tvnBtn);
                    break;
            }; // END switch()
            
            // fnTvnBattle() 
            function fnTvnBattle(hAttrib, eAttrib){
                console.log("Hero", tmpRndHero.hNAM, tmpRndHero[hAttrib], "vs", "Enemy", tvnEnemy01.hNAM, tvnEnemy01[eAttrib]);
                // to be continued! 
            }; // END fnTvnBattle()

        }; // END fnTvnAction()


//Constructor(hNAM, hHP, hSTR, hSPD, hMP, hLUK, hWEP, hCLS){
    //   <p id="pTvnMessage">&nbsp;</p><!-- Lore-building, hints for the level, etc -->
    //       <p id="pTvnParty">&nbsp;</p><!-- Current party important stuff -->
    //       <p id="pTvnEnemy">&nbsp;</p><!-- This level's challenge -->
    //       <p id="pTvnAction">&nbsp;</p><!-- Actions to surmout that challenge -->
    //       <p id="pTvnResult">
}; // END fnLvTavern()