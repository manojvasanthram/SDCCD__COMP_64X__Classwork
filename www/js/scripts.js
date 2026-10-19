// Keeps track of the currently player Player Troop; GLOBAL SCOPE and is set at a level
let globalOurTroopEmail;
let globalOurTroopData;

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
        case "#scForest":
            console.log("op1");
            fnLvForest(ourTroop);
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

 let arrNamesGood = [
    "Anda",
    "Bordon",
    "Cazzi",
    "Delzorr",
    "Enyala",
    "Faelan",
    "Galen",
    "Helena",
    "Ivor",
    "Jora",
    "Kael",
    "Liora",
    "Merrin",
    "Nyra",
    "Orin",
    "Petra",
    "Quinn",
    "Ronan",
    "Selene",
    "Theron",
    "Ulric",
    "Vera",
    "Wren",
    "Xander",
    "Yara",
    "Zorin"
];
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

// General purppose function for the Footer buttons as you play the levels
// Two parameters Where we clicked [screen], What we clicked [button]
function fnGameTasks(tskWhere, tskWhich, tskWhoEmail, tskWhoData){
    console.log("Pressed where: ", "#" + tskWhere.id, "Pressed which?", tskWhich);
    console.log("Who pressed: ", tskWhoEmail);
    console.log("Their data:", tskWhoData);
    // Switch between possibilites
    switch(tskWhich){
        case "Save Game":
            console.log("Want to Save");
            localStorage.setItem(tskWhoEmail, JSON.stringify(tskWhoData));
            window.alert("You saved!");
            // todo- play a sound; vibrate
            break;
        case "Load Game":
             // If..Else condition to confirm
             if(window.confirm("Are you sure?")){
                 console.log("DO want to switch games");
                 // Load player data first
                 let tmpLsAllPlayers = JSON.parse(localStorage.getItem("lsAllPlayers"));
                 // Redraw #scLoadGame; NOTE with (=) and NOT (+=)
                 document.querySelector("#pLGParty").innerHTML = "";

                    for(let i=0; i<tmpLsAllPlayers.length; i++){
                        // Load all the data of the specific player
                        let tmpCurrentPlayerData = JSON.parse(localStorage.getItem(tmpLsAllPlayers[i]));
                        document.querySelector("#pLGParty").innerHTML += "<p>" + 
                        tmpCurrentPlayerData.hPlayer01.hNAM + " <button onclick='fnGameLoad(`" + tmpLsAllPlayers[i] + "`);'>&#9876;</button></p>";
                    }; // END for() loop to refresh scLoadGame

                 // Move to #scWelcome
                fnNavGame("#" + tskWhere.id, "#scLoadGame", tskWhoEmail);
             }else{
                 console.log("Decided not to switch games");
                 // also a pop thanks msg? a sound? 
             }; // END If..else confirm
            break;
        case "Quit Game":
             console.log("Clicked QUIT");
             // If..Else condition to confirm
             if(window.confirm("Are you sure?")){
                 console.log("DO want to quit");
                 // Load player data first
                 let tmpLsAllPlayers = JSON.parse(localStorage.getItem("lsAllPlayers"));
                 // Redraw #scLoadGame; NOTE with (=) and NOT (+=)
                 document.querySelector("#pLGParty").innerHTML = "";

                    for(let i=0; i<tmpLsAllPlayers.length; i++){
                        // Load all the data of the specific player
                        let tmpCurrentPlayerData = JSON.parse(localStorage.getItem(tmpLsAllPlayers[i]));
                        document.querySelector("#pLGParty").innerHTML += "<p>" + 
                        tmpCurrentPlayerData.hPlayer01.hNAM + " <button onclick='fnGameLoad(`" + tmpLsAllPlayers[i] + "`);'>&#9876;</button></p>";
                    }; // END for() loop to refresh scLoadGame

                 // Move to #scWelcome
                fnNavGame("#" + tskWhere.id, "#scWelcome", tskWhoEmail);
             }else{
                 console.log("Decided not to quit");
                 // also a pop thanks msg? a sound? 
             }; // END If..else confirm
            break;
        case "Settings":
            console.log("Want to edit Settings");
            fnNavGame("#" + tskWhere.id, "#scSettings", tskWhoEmail);
            // TO BE CONTINUED!
            break;
        default:
            console.log(tskWhich);
            break;
    }; // END switch()
}; // END fnGametasks

// All the code of the Tavern Level
function fnLvTavern(ourTroop){
    console.log("At the Tavern with", ourTroop);
    // Also set the GLOBAL SCOPE Player Troop (at top)
    globalOurTroopEmail  = ourTroop;
    console.log("globalOurTroop:", globalOurTroopEmail);
    // Load the data of the current party
    let tmpCurrentPlayerData = JSON.parse(localStorage.getItem(ourTroop));
    globalOurTroopData = tmpCurrentPlayerData; // Also happens when you INTERACT
    // Update the Tavern Message placeholder
    document.querySelector("#pTvnMessage").innerHTML  = "Welcome, " + tmpCurrentPlayerData.hPlayer01.hNAM + "! Grab some refreshments and chat with the various patrons of our fine establishement.";
    document.querySelector("#pTvnMessage").innerHTML += "<p>In this level, challenge an opponent to who has better STATS. </p>";

    /*
        <table> create the whole thing
        <tr> Table Row
        <td> Table Data (one cell)
    */
    document.querySelector("#pTvnParty").innerHTML = "<table border='1' class='tblCenter'>" +
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

    document.querySelector("#pTvnEnemy").innerHTML = "<p style='text-align: center;'><table border='1' class='tblCenter'><tr>" +
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
            // thing1 = "cat";
            // 1 == 1 - true
            // 1 === 1 
            // A == 64 - true
            // A === 64 - false
            // fnTvnBattle() 
            function fnTvnBattle(hAttrib, eAttrib){
                console.log("Hero", tmpRndHero.hNAM, tmpRndHero[hAttrib], "vs", "Enemy", tvnEnemy01.hNAM, tvnEnemy01[eAttrib]);
                // Conditional statement for a WIN, LOSE, DRAW: If Else If
                // The hero that stepped forward will gain (or lose) the boon
                if(tmpRndHero[hAttrib] > tvnEnemy01[eAttrib]){
                    console.log("WIN +5"); 
                    tmpRndHero[hAttrib] += 5;
                    // and give the party gold; create a new Property on the spot
                    // since no previous _gold property, we ASSIGN (=) not accumulate (+=) !!
                    tmpCurrentPlayerData._gold = fnRandomNumRange(50, 100);
                    // Add Next level
                    tmpCurrentPlayerData._currentScreen = "#scForest";
                    // save to localstorage
                    localStorage.setItem(tmpCurrentPlayerData._id, JSON.stringify(tmpCurrentPlayerData));
                    // deactive buttons
                    document.querySelector("#btnTvnStr").disabled = "true";
                    document.querySelector("#btnTvnSpd").disabled = "true";
                    document.querySelector("#btnTvnMp").disabled  = "true";
                    // Update results onscreen
                    document.querySelector("#pTvnResult").innerHTML = tmpRndHero.hNAM + " stepped forward to battle the " +
                        tvnEnemy01.hCLS + " and WON! Their stat went up 5 more and earned " + tmpCurrentPlayerData._gold + " gold. Now, continue your quest!";
                    document.querySelector("#pTvnResult").innerHTML += "<p><button id='btnTvnNext'>Go</button></p>";
                    // and set to globalscope
                    globalOurTroopData = tmpCurrentPlayerData;
                }else if(tmpRndHero[hAttrib] < tvnEnemy01[eAttrib]){
                    console.log("LOSE -5");
                    tmpRndHero[hAttrib] -= 5;
                    tmpCurrentPlayerData._gold = fnRandomNumRange(1, 5);
                    tmpCurrentPlayerData._currentScreen = "#scForest";
                    localStorage.setItem(tmpCurrentPlayerData._id, JSON.stringify(tmpCurrentPlayerData));
                    document.querySelector("#btnTvnStr").disabled = "true";
                    document.querySelector("#btnTvnSpd").disabled = "true";
                    document.querySelector("#btnTvnMp").disabled  = "true";
                    document.querySelector("#pTvnResult").innerHTML = tmpRndHero.hNAM + " stepped forward to battle the " +
                        tvnEnemy01.hCLS + " and LOST! Their stat decreased 5 and found " + tmpCurrentPlayerData._gold + " gold on the floor. Begone!";
                    document.querySelector("#pTvnResult").innerHTML += "<p><button id='btnTvnNext'>Go</button></p>";
                    globalOurTroopData = tmpCurrentPlayerData;
                }else if(tmpRndHero[hAttrib] == tvnEnemy01[eAttrib]){
                    console.log("DRAW +LUK");
                    tmpRndHero[hAttrib] += tmpRndHero.hLUK;
                    tmpCurrentPlayerData._gold = fnRandomNumRange(10, 25);
                    tmpCurrentPlayerData._currentScreen = "#scForest";
                    localStorage.setItem(tmpCurrentPlayerData._id, JSON.stringify(tmpCurrentPlayerData));
                    document.querySelector("#btnTvnStr").disabled = "true";
                    document.querySelector("#btnTvnSpd").disabled = "true";
                    document.querySelector("#btnTvnMp").disabled  = "true";
                    document.querySelector("#pTvnResult").innerHTML = tmpRndHero.hNAM + " stepped forward to battle the " +
                        tvnEnemy01.hCLS + " and it was a DRAW! By luck, their stat increased and gained " + tmpCurrentPlayerData._gold + " gold Keep going!";
                    document.querySelector("#pTvnResult").innerHTML += "<p><button id='btnTvnNext'>Go</button></p>";
                    // Event Listener for that button, after If..Else If and fnTvnbattle
                    globalOurTroopData = tmpCurrentPlayerData;
                }else{
                    console.log("Error??");
                }; // END If..Else.If checker
            }; // END fnTvnBattle()
            // Even Listener for each of the three btnTvnNext <button>
            document.querySelector("#btnTvnNext").addEventListener("click", function(){fnNavGame("#scTavern", "#scForest", tmpCurrentPlayerData._id);});
            
            // ReLoad the data of the current party
            // Reload the stats onscreen
            // NOTE: Don't sue let here because we are REASSIGNING the data, not loading first time
            tmpCurrentPlayerData = JSON.parse(localStorage.getItem(ourTroop));
            console.log("NEW DATA", tmpCurrentPlayerData);
            document.querySelector("#pTvnParty").innerHTML = "<table border='1'>" +
                "<tr> <td><strong>" + tmpCurrentPlayerData.hPlayer01.hNAM +
                "</strong><br>HP:" + tmpCurrentPlayerData.hPlayer01.hHP +
                "<br><strong>STR:" +tmpCurrentPlayerData.hPlayer01.hSTR +
                "<br>SPD:" +tmpCurrentPlayerData.hPlayer01.hSPD +
                "<br>MP:" +tmpCurrentPlayerData.hPlayer01.hMP +
                "</strong><br>LUK:" +tmpCurrentPlayerData.hPlayer01.hLUK +
                "<br>WEP:" +tmpCurrentPlayerData.hPlayer01.hWEP +
                "<br>CLS:" +tmpCurrentPlayerData.hPlayer01.hCLS +
                "</td>" + 
                
                "<td><strong>" + tmpCurrentPlayerData.hPlayer02.hNAM +
                "</strong><br>HP:" + tmpCurrentPlayerData.hPlayer02.hHP +
                "<br><strong>STR:" +tmpCurrentPlayerData.hPlayer02.hSTR +
                "<br>SPD:" +tmpCurrentPlayerData.hPlayer02.hSPD +
                "<br>MP:" +tmpCurrentPlayerData.hPlayer02.hMP +
                "</strong><br>LUK:" +tmpCurrentPlayerData.hPlayer02.hLUK +
                "<br>WEP:" +tmpCurrentPlayerData.hPlayer02.hWEP +
                "<br>CLS:" +tmpCurrentPlayerData.hPlayer02.hCLS +
                "</td>" +  
                
                "<td><strong>" + tmpCurrentPlayerData.hPlayer03.hNAM +
                "</strong><br>HP:" + tmpCurrentPlayerData.hPlayer03.hHP +
                "<br><strong>STR:" +tmpCurrentPlayerData.hPlayer03.hSTR +
                "<br>SPD:" +tmpCurrentPlayerData.hPlayer03.hSPD +
                "<br>MP:" +tmpCurrentPlayerData.hPlayer03.hMP +
                "</strong><br>LUK:" +tmpCurrentPlayerData.hPlayer03.hLUK +
                "<br>WEP:" +tmpCurrentPlayerData.hPlayer03.hWEP +
                "<br>CLS:" +tmpCurrentPlayerData.hPlayer03.hCLS +
                "</td>" +  
                
                "</tr></table>"; // END of <table> of our party
        }; // END fnTvnAction()
}; // END fnLvTavern()

// Function for the Forest level
function fnLvForest(ourTroop){
    console.log("At the Forest with", ourTroop);
    
    // Pass local variable to global variable
    globalOurTroopEmail  = ourTroop;
    console.log("globalOurTroop:", globalOurTroopEmail);
    
    let tmpCurrentPlayerData = JSON.parse(localStorage.getItem(ourTroop));
    globalOurTroopData = tmpCurrentPlayerData;  // Pass local variable to global variable

    // Hide the pFrstEnemy (unused) Element
    document.querySelector("#pFrstEnemy").style.display = "none";

    // let multiarray = [ [cat, dog, bird], [black, white, stripped, yellow], [male, female] ];
    // multiarray[0][2]; = bird
    
    // Lookup Table as Multidimensional Array (3 in one) <- good for grouping
    // NAME, ITEM, ATTRIBUTE
    let arrFrstChar = [
        ["Adabor", "Bentrax", "Celiz", "Danitark", "Xullix", "Yizzoro", "Zana"],
        ["Secret Book", "Holy Codex", "Lost Parchment", "Gothic Scroll"],
        ["Power", "Wisdon", "Validation", "Insight", "Experience"]
    ]; // END Multi-dim array of Forest character

    // Genrate a Name with Item and Attribute
    let valFrstName = arrFrstChar[0][fnRandomNumRange(0,6)]; //  .length? 
    let valFrstItem = arrFrstChar[1][fnRandomNumRange(0,3)];
    let valFrstAttr = arrFrstChar[2][fnRandomNumRange(0,4)];
    console.log(valFrstName, valFrstItem, valFrstAttr);
    
    document.querySelector("#pFrstMessage").innerHTML  = "Welcome, " + tmpCurrentPlayerData.hPlayer01.hNAM + "! You have reached the ghostly forest. What's that ahead?.";
    document.querySelector("#pFrstMessage").innerHTML += "<p>You meet " + valFrstName + " and their " + valFrstItem + " of " + valFrstAttr + ". </p>";

    // ID Attribute may only be used ONCE per project       <section id="scgameover">
    //              CSS: #scgamer (hashmark)
    // Class Attribute may be used MANY times per project   <img class="myresiver" src="ca.jpg">  <img class="myresiver" src="bird.jpg>
    //              CSS: .myresiver (dot)
    document.querySelector("#pFrstParty").innerHTML = "<table border='1' class='tblCenter'><tr>" + 
            "<td><strong>" + tmpCurrentPlayerData.hPlayer01.hNAM + 
                     "</strong><br>HP: " + tmpCurrentPlayerData.hPlayer01.hHP +
                     "<br>MP: " + tmpCurrentPlayerData.hPlayer01.hMP + 
            "</td>" + 

            "<td><strong>" + tmpCurrentPlayerData.hPlayer02.hNAM + 
                "</strong><br>HP: " + tmpCurrentPlayerData.hPlayer02.hHP +
                "<br>MP: " + tmpCurrentPlayerData.hPlayer02.hMP + 
            "</td>" + 

            "<td><strong>" + tmpCurrentPlayerData.hPlayer03.hNAM + 
                "</strong><br>HP: " + tmpCurrentPlayerData.hPlayer03.hHP +
                "<br>MP: " + tmpCurrentPlayerData.hPlayer03.hMP + 
            "</td>" + 
        "<tr></table>"; // END Party Table

    document.querySelector("#pFrstAction").innerHTML = "<p>You will ask " + valFrstName + " to help your quest by granting you some of their " + valFrstAttr + " from their " + valFrstItem + "!</p>";
    document.querySelector("#pFrstAction").innerHTML += "<p><button id='btnFrstMP'>Ask for MP</button> | <button id='btnFrstHP'>Ask for HP</button></p>";

    document.querySelector("#btnFrstMP").addEventListener("click", function(){fnFrstAction("frstMP")});
    document.querySelector("#btnFrstHP").addEventListener("click", function(){fnFrstAction("frstHP")});

    function fnFrstAction(frstStat){
        console.log("Stat:", frstStat);

        document.querySelector("#btnFrstMP").disabled = "true";
        document.querySelector("#btnFrstHP").disabled = "true";
        // Get a bonus of MP/HP, get a Gold bonus, get a new ITEM, then random NEXT level

        // Fully define this level's Chracter
        let frstNPC01 = new Heroes(
            valFrstName, 
            fnRandomNumRange(10,20),
            null,
            null,
            fnRandomNumRange(20,30),
            fnGetRandomArr(arrLuck),
            valFrstItem,
            valFrstAttr
         ); // END Forest character

         // Generate a fraction so that we can X amount of a bonus; "random" + "random"
         let tmpRndFrac = Math.random();
         console.log(tmpRndFrac);
         let tmpBonusHP = frstNPC01.hHP * tmpRndFrac;
         let tmpBonusMP = frstNPC01.hMP * tmpRndFrac;
         // Random path Array
         let tmpRndPath = ["#scLake", "#scMountain", "#scBridge"];
         // Keep track of gold later; now is undefined
         let tmpGold;

         // Depending on MP or HP, switch
         switch(frstStat){
             case "frstMP":
                console.log("Got MP", Math.round(tmpBonusMP), frstNPC01.hMP);
                // Add the MP to all players + LUK
                tmpCurrentPlayerData.hPlayer01.hMP += (Math.round(tmpBonusMP) + frstNPC01.hLUK);
                tmpCurrentPlayerData.hPlayer02.hMP += (Math.round(tmpBonusMP) + frstNPC01.hLUK);
                tmpCurrentPlayerData.hPlayer03.hMP += (Math.round(tmpBonusMP) + frstNPC01.hLUK);
                // Add gold
                tmpGold = fnRandomNumRange(999, 1234)
                tmpCurrentPlayerData._gold += tmpGold;
                // Create an Inventory system and add a new item; NOTE (=) and not (+=)
                tmpCurrentPlayerData._inventory = [frstNPC01.hWEP];
                // Random path setup ABOVE, and used here
                tmpCurrentPlayerData._currentScreen = tmpRndPath[(Math.floor(Math.random()*tmpRndPath.length))];
                // Then save to localstoage
                localStorage.setItem(tmpCurrentPlayerData._id, JSON.stringify(tmpCurrentPlayerData));
                break;
             case "frstHP":
                console.log("Got HP", Math.round(tmpBonusHP), frstNPC01.hHP);
                tmpCurrentPlayerData.hPlayer01.hHP += (Math.round(tmpBonusHP) + frstNPC01.hLUK);
                tmpCurrentPlayerData.hPlayer02.hHP += (Math.round(tmpBonusHP) + frstNPC01.hLUK);
                tmpCurrentPlayerData.hPlayer03.hHP += (Math.round(tmpBonusHP) + frstNPC01.hLUK);
                tmpGold = fnRandomNumRange(777, 999)
                tmpCurrentPlayerData._gold += tmpGold;
                tmpCurrentPlayerData._inventory = [frstNPC01.hWEP];
                tmpCurrentPlayerData._currentScreen = tmpRndPath[(Math.floor(Math.random()*tmpRndPath.length))];
                localStorage.setItem(tmpCurrentPlayerData._id, JSON.stringify(tmpCurrentPlayerData));
                break;
             default:
                console.log("Error", frstStat);
                break;
         }; // END switch()

        // Say message
        document.querySelector("#pFrstResult").innerHTML = "<p>Congratulations! " + frstNPC01.hNAM + 
        " has given you their " + frstNPC01.hWEP + ", " + tmpGold + "GOLD, and enhanced your stats thus!</p>";
        // Update Party Table NOTE: (+=) not (=)
        document.querySelector("#pFrstResult").innerHTML += "<p><table border='1' class='tblCenter'><tr>" + 
            "<td><strong>" + tmpCurrentPlayerData.hPlayer01.hNAM + 
                     "</strong><br>HP: " + tmpCurrentPlayerData.hPlayer01.hHP +
                     "<br>MP: " + tmpCurrentPlayerData.hPlayer01.hMP + 
            "</td>" + 

            "<td><strong>" + tmpCurrentPlayerData.hPlayer02.hNAM + 
                "</strong><br>HP: " + tmpCurrentPlayerData.hPlayer02.hHP +
                "<br>MP: " + tmpCurrentPlayerData.hPlayer02.hMP + 
            "</td>" + 

            "<td><strong>" + tmpCurrentPlayerData.hPlayer03.hNAM + 
                "</strong><br>HP: " + tmpCurrentPlayerData.hPlayer03.hHP +
                "<br>MP: " + tmpCurrentPlayerData.hPlayer03.hMP + 
            "</td>" + 
        "<tr></table></p>"; // END Party Table
        // Add NEXT LEVEL BUTTON
        document.querySelector("#pFrstResult").innerHTML += "<p>Now, head to The " + (tmpCurrentPlayerData._currentScreen).slice(3, (tmpCurrentPlayerData._currentScreen).length) + " and continue your quest!</p>" + 
            "<br><button id='btnFrstNext'>Go</button>";
        document.querySelector("#btnFrstNext").addEventListener("click", function(){fnNavGame("#scForest", tmpCurrentPlayerData._currentScreen, tmpCurrentPlayerData._id);});
    }; // END fnFrstAction
}; // END fnLvForest