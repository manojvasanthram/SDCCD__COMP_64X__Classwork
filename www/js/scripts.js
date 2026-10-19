// Keeps track of the currently player Player Troop; GLOBAL SCOPE and is set at a level
let globalOurTroopEmail;
let globalOurTroopData;

let hiScore = 0; // Define a HiScore Object and set its data to Zero (0) points
// Array to keep track of all player's emails; on first run, empty;
// Gets populated as you create players (via fnNewGame()), and load saved data (via fnLoadGame())
let arrAllEmails = [];

// ----------  App Init START ---------- //
// Read only this game's save index; leave unrelated browser storage untouched.
function fnReadSave(id) {
    try {
        const party = JSON.parse(localStorage.getItem(id));
        if (!party || !party.hPlayer01 || !party.hPlayer02 || !party.hPlayer03) return null;
        party._id = id; // Keep old email-keyed saves compatible.
        if (!Number.isFinite(party._gold)) party._gold = 0;
        if (!Array.isArray(party._inventory)) party._inventory = [];
        return party;
    } catch (error) { return null; }
}

function fnSaveParty(party) {
    localStorage.setItem(party._id, JSON.stringify(party));
    let ids;
    try { ids = JSON.parse(localStorage.getItem("lsAllPlayers")); } catch (error) { ids = []; }
    if (!Array.isArray(ids)) ids = [];
    ids = [...new Set(ids.filter(id => typeof id === "string"))];
    if (!ids.includes(party._id)) ids.push(party._id);
    localStorage.setItem("lsAllPlayers", JSON.stringify(ids));
}

function fnEscapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
}

function fnPartyTable(party) {
    return "<table class='tblCenter'><caption>Party statistics</caption><tr>" +
        [party.hPlayer01, party.hPlayer02, party.hPlayer03].map(hero =>
            "<td><strong>" + fnEscapeHTML(hero.hNAM) + "</strong><br>" +
            ["HP", "STR", "SPD", "MP", "LUK", "WEP", "CLS"].map(stat =>
                stat + ": " + fnEscapeHTML(hero["h" + stat])).join("<br>") +
            "</td>").join("") + "</tr></table>";
}

function fnAppInit() {
    let ids;
    try { ids = JSON.parse(localStorage.getItem("lsAllPlayers")); } catch (error) { ids = []; }
    if (!Array.isArray(ids)) ids = [];
    const validIds = [...new Set(ids)].filter(id => typeof id === "string" && fnReadSave(id));
    const list = document.querySelector("#pLGParty");
    list.innerHTML = "";
    validIds.forEach(id => {
        const party = fnReadSave(id);
        const row = document.createElement("p");
        const button = document.createElement("button");
        button.textContent = "Load " + party.hPlayer01.hNAM;
        button.addEventListener("click", () => fnGameLoad(id));
        row.appendChild(button);
        const detail = document.createElement("span");
        detail.textContent = " — " + party._currentScreen.slice(3) + " | Gold: " + party._gold;
        row.appendChild(detail);
        list.appendChild(row);
    });
    document.querySelector("#spnLGSaves").textContent = validIds.length;
    document.querySelector("#scWelcome main p button").disabled = validIds.length === 0;
    if (!validIds.length) list.textContent = "No saved parties yet.";
}

function fnGameLoad(id) {
    const party = fnReadSave(id);
    if (!party) { window.alert("This save could not be loaded."); fnAppInit(); return; }
    fnNavGame("#scLoadGame", party._currentScreen, id);
}
window.fnAppInit();

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
function fnResetNewGame() {
    document.querySelector("#pNGName").value = "";
    document.querySelector("#pNGEmail").value = "";
    document.querySelector("#pNGResult").innerHTML = "";
    document.querySelector("#pNGAction").style.display = "block";
}

function fnNavMenu(scHide, scShow) {
    document.querySelector("#pSaveStatus").textContent = "";
    if (scShow === "#scNewGame") fnResetNewGame();
    if (scShow === "#scLoadGame" || scShow === "#scWelcome") fnAppInit();
    document.querySelectorAll("body > section").forEach(section => section.style.display = "none");
    document.querySelector(scShow).style.display = "block";
}

function fnNavGame(scHide, scShow, ourTroop) {
    const party = fnReadSave(ourTroop);
    if (!party) { window.alert("This party could not be loaded."); return; }
    // The three destinations share a completed-chapter screen for this check-in.
    const routes = ["#scLake", "#scMountain", "#scBridge"];
    const target = routes.includes(scShow) ? "#scChapterComplete" : scShow;
    if (!["#scTavern", "#scForest", "#scChapterComplete"].includes(target)) {
        window.alert("This save points to a level that is not available.");
        return;
    }
    fnNavMenu(scHide, target);
    if (target === "#scTavern") fnLvTavern(ourTroop);
    else if (target === "#scForest") fnLvForest(ourTroop);
    else fnChapterComplete(ourTroop);
}

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
function fnNewGame() {
    const name = document.querySelector("#pNGName").value.trim();
    const email = document.querySelector("#pNGEmail").value.trim();
    if (!name || !email) { window.alert("Please enter a name and email."); return; }
    const createHero = heroName => new Heroes(heroName,
        fnGetRandomArr(arrStats), fnGetRandomArr(arrStats),
        fnGetRandomArr(arrStats), fnGetRandomArr(arrStats),
        fnGetRandomArr(arrLuck), fnGetRandomArr(arrWeapons), fnGetRandomArr(arrClasses));
    const companion1 = fnGetRandomArr(arrNamesGood);
    const companion2 = fnGetRandomArr(arrNamesGood.filter(name => name !== companion1));
    // Email is metadata. A separate ID prevents a new party overwriting an older one.
    const id = "party-" + crypto.randomUUID();
    const party = {
        _id: id, _email: email, _questCompleted: false,
        _currentScreen: "#scTavern", _gold: 0, _inventory: [],
        hPlayer01: createHero(name), hPlayer02: createHero(companion1),
        hPlayer03: createHero(companion2)
    };
    fnSaveParty(party);
    globalOurTroopEmail = id;
    globalOurTroopData = party;
    document.querySelector("#pNGAction").style.display = "none";
    document.querySelector("#pNGResult").innerHTML = fnPartyTable(party) +
        "<p>Your three heroes are saved as one party. Proceed to Drunkard's Tavern!</p>" +
        "<button id='btnNGGo'>Go!</button>";
    document.querySelector("#btnNGGo").addEventListener("click",
        () => fnNavGame("#scNewGame", "#scTavern", id));
    fnAppInit();
}

let settingsReturnScreen = "#scWelcome";
function fnGameTasks(where, which, id, party) {
    switch (which.trim()) {
        case "Save Game":
            if (!party) { window.alert("No active party to save."); return; }
            fnSaveParty(party);
            document.querySelector("#pSaveStatus").textContent = "Game saved.";
            break;
        case "Load Game":
            fnNavMenu("#" + where.id, "#scLoadGame");
            break;
        case "Quit Game":
            if (party) fnSaveParty(party);
            fnNavMenu("#" + where.id, "#scWelcome");
            break;
        case "Settings":
            settingsReturnScreen = "#" + where.id;
            fnNavMenu(settingsReturnScreen, "#scSettings");
            break;
    }
}

function fnChapterComplete(id) {
    const party = fnReadSave(id);
    party._questCompleted = true;
    globalOurTroopEmail = id;
    globalOurTroopData = party;
    fnSaveParty(party);
    const destination = party._currentScreen.slice(3);
    document.querySelector("#pCompleteMessage").textContent =
        party.hPlayer01.hNAM + "'s party reached the " + destination +
        " camp safely. The Tavern and Forest chapter is complete!";
    document.querySelector("#pCompleteParty").innerHTML = fnPartyTable(party);
    document.querySelector("#pCompleteRewards").textContent =
        "Gold: " + party._gold + " | Inventory: " + (party._inventory.join(", ") || "None");
}

// All the code of the Tavern Level
function fnLvTavern(ourTroop){
    document.querySelector("#pTvnResult").innerHTML = "";
    console.log("At the Tavern with", ourTroop);
    // Also set the GLOBAL SCOPE Player Troop (at top)
    globalOurTroopEmail  = ourTroop;
    console.log("globalOurTroop:", globalOurTroopEmail);
    // Load the data of the current party
    let tmpCurrentPlayerData = fnReadSave(ourTroop);
    globalOurTroopData = tmpCurrentPlayerData; // Also happens when you INTERACT
    // Update the Tavern Message placeholder
    document.querySelector("#pTvnMessage").innerHTML  = "Welcome, " + fnEscapeHTML(tmpCurrentPlayerData.hPlayer01.hNAM) + "! Grab some refreshments and chat with the various patrons of our fine establishement.";
    document.querySelector("#pTvnMessage").innerHTML += "<p>In this level, challenge an opponent to who has better STATS. </p>";

    /*
        <table> create the whole thing
        <tr> Table Row
        <td> Table Data (one cell)
    */
    document.querySelector("#pTvnParty").innerHTML = "<table border='1' class='tblCenter'>" +
     "<tr> <td><strong>" + fnEscapeHTML(tmpCurrentPlayerData.hPlayer01.hNAM) +
     "</strong><br>HP:" + tmpCurrentPlayerData.hPlayer01.hHP +
     "<br>STR:" +tmpCurrentPlayerData.hPlayer01.hSTR +
     "<br>SPD:" +tmpCurrentPlayerData.hPlayer01.hSPD +
     "<br>MP:" +tmpCurrentPlayerData.hPlayer01.hMP +
     "<br>LUK:" +tmpCurrentPlayerData.hPlayer01.hLUK +
     "<br>WEP:" +tmpCurrentPlayerData.hPlayer01.hWEP +
     "<br>CLS:" +tmpCurrentPlayerData.hPlayer01.hCLS +
     "</td>" + 
     
     "<td><strong>" + fnEscapeHTML(tmpCurrentPlayerData.hPlayer02.hNAM) +
     "</strong><br>HP:" + tmpCurrentPlayerData.hPlayer02.hHP +
     "<br>STR:" +tmpCurrentPlayerData.hPlayer02.hSTR +
     "<br>SPD:" +tmpCurrentPlayerData.hPlayer02.hSPD +
     "<br>MP:" +tmpCurrentPlayerData.hPlayer02.hMP +
     "<br>LUK:" +tmpCurrentPlayerData.hPlayer02.hLUK +
     "<br>WEP:" +tmpCurrentPlayerData.hPlayer02.hWEP +
     "<br>CLS:" +tmpCurrentPlayerData.hPlayer02.hCLS +
     "</td>" +  
     
    "<td><strong>" + fnEscapeHTML(tmpCurrentPlayerData.hPlayer03.hNAM) +
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
        "</strong><br>STR: " + tvnEnemy01.hSTR +
        "<br>SPD: " + tvnEnemy01.hSPD +
        "<br>MP: " + tvnEnemy01.hMP +
        "<br>CLS: " + tvnEnemy01.hCLS +
        "<br>WEP: " + tvnEnemy01.hWEP +
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
                console.log("Hero", fnEscapeHTML(tmpRndHero.hNAM), tmpRndHero[hAttrib], "vs", "Enemy", tvnEnemy01.hNAM, tvnEnemy01[eAttrib]);
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
                    fnSaveParty(tmpCurrentPlayerData);
                    // deactive buttons
                    document.querySelector("#btnTvnStr").disabled = "true";
                    document.querySelector("#btnTvnSpd").disabled = "true";
                    document.querySelector("#btnTvnMp").disabled  = "true";
                    // Update results onscreen
                    document.querySelector("#pTvnResult").innerHTML = fnEscapeHTML(tmpRndHero.hNAM) + " stepped forward to battle the " +
                        tvnEnemy01.hCLS + " and WON! Their stat went up 5 more and earned " + tmpCurrentPlayerData._gold + " gold. Now, continue your quest!";
                    document.querySelector("#pTvnResult").innerHTML += "<p><button id='btnTvnNext'>Go</button></p>";
                    // and set to globalscope
                    globalOurTroopData = tmpCurrentPlayerData;
                }else if(tmpRndHero[hAttrib] < tvnEnemy01[eAttrib]){
                    console.log("LOSE -5");
                    tmpRndHero[hAttrib] -= 5;
                    tmpCurrentPlayerData._gold = fnRandomNumRange(1, 5);
                    tmpCurrentPlayerData._currentScreen = "#scForest";
                    fnSaveParty(tmpCurrentPlayerData);
                    document.querySelector("#btnTvnStr").disabled = "true";
                    document.querySelector("#btnTvnSpd").disabled = "true";
                    document.querySelector("#btnTvnMp").disabled  = "true";
                    document.querySelector("#pTvnResult").innerHTML = fnEscapeHTML(tmpRndHero.hNAM) + " stepped forward to battle the " +
                        tvnEnemy01.hCLS + " and LOST! Their stat decreased 5 and found " + tmpCurrentPlayerData._gold + " gold on the floor. Begone!";
                    document.querySelector("#pTvnResult").innerHTML += "<p><button id='btnTvnNext'>Go</button></p>";
                    globalOurTroopData = tmpCurrentPlayerData;
                }else if(tmpRndHero[hAttrib] == tvnEnemy01[eAttrib]){
                    console.log("DRAW +LUK");
                    tmpRndHero[hAttrib] += tmpRndHero.hLUK;
                    tmpCurrentPlayerData._gold = fnRandomNumRange(10, 25);
                    tmpCurrentPlayerData._currentScreen = "#scForest";
                    fnSaveParty(tmpCurrentPlayerData);
                    document.querySelector("#btnTvnStr").disabled = "true";
                    document.querySelector("#btnTvnSpd").disabled = "true";
                    document.querySelector("#btnTvnMp").disabled  = "true";
                    document.querySelector("#pTvnResult").innerHTML = fnEscapeHTML(tmpRndHero.hNAM) + " stepped forward to battle the " +
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
            tmpCurrentPlayerData = fnReadSave(ourTroop);
            console.log("NEW DATA", tmpCurrentPlayerData);
            document.querySelector("#pTvnParty").innerHTML = "<table border='1' class='tblCenter'>" +
                "<tr> <td><strong>" + fnEscapeHTML(tmpCurrentPlayerData.hPlayer01.hNAM) +
                "</strong><br>HP:" + tmpCurrentPlayerData.hPlayer01.hHP +
                "<br><strong>STR:" +tmpCurrentPlayerData.hPlayer01.hSTR +
                "<br>SPD:" +tmpCurrentPlayerData.hPlayer01.hSPD +
                "<br>MP:" +tmpCurrentPlayerData.hPlayer01.hMP +
                "</strong><br>LUK:" +tmpCurrentPlayerData.hPlayer01.hLUK +
                "<br>WEP:" +tmpCurrentPlayerData.hPlayer01.hWEP +
                "<br>CLS:" +tmpCurrentPlayerData.hPlayer01.hCLS +
                "</td>" + 
                
                "<td><strong>" + fnEscapeHTML(tmpCurrentPlayerData.hPlayer02.hNAM) +
                "</strong><br>HP:" + tmpCurrentPlayerData.hPlayer02.hHP +
                "<br><strong>STR:" +tmpCurrentPlayerData.hPlayer02.hSTR +
                "<br>SPD:" +tmpCurrentPlayerData.hPlayer02.hSPD +
                "<br>MP:" +tmpCurrentPlayerData.hPlayer02.hMP +
                "</strong><br>LUK:" +tmpCurrentPlayerData.hPlayer02.hLUK +
                "<br>WEP:" +tmpCurrentPlayerData.hPlayer02.hWEP +
                "<br>CLS:" +tmpCurrentPlayerData.hPlayer02.hCLS +
                "</td>" +  
                
                "<td><strong>" + fnEscapeHTML(tmpCurrentPlayerData.hPlayer03.hNAM) +
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
    document.querySelector("#pFrstResult").innerHTML = "";
    console.log("At the Forest with", ourTroop);
    
    // Pass local variable to global variable
    globalOurTroopEmail  = ourTroop;
    console.log("globalOurTroop:", globalOurTroopEmail);
    
    let tmpCurrentPlayerData = fnReadSave(ourTroop);
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
        ["Power", "Wisdom", "Validation", "Insight", "Experience"]
    ]; // END Multi-dim array of Forest character

    // Genrate a Name with Item and Attribute
    let valFrstName = arrFrstChar[0][fnRandomNumRange(0,6)]; //  .length? 
    let valFrstItem = arrFrstChar[1][fnRandomNumRange(0,3)];
    let valFrstAttr = arrFrstChar[2][fnRandomNumRange(0,4)];
    console.log(valFrstName, valFrstItem, valFrstAttr);
    
    document.querySelector("#pFrstMessage").innerHTML  = "Welcome, " + fnEscapeHTML(tmpCurrentPlayerData.hPlayer01.hNAM) + "! You have reached the ghostly forest. What's that ahead?.";
    document.querySelector("#pFrstMessage").innerHTML += "<p>You meet " + valFrstName + " and their " + valFrstItem + " of " + valFrstAttr + ". </p>";

    // ID Attribute may only be used ONCE per project       <section id="scgameover">
    //              CSS: #scgamer (hashmark)
    // Class Attribute may be used MANY times per project   <img class="myresiver" src="ca.jpg">  <img class="myresiver" src="bird.jpg>
    //              CSS: .myresiver (dot)
    document.querySelector("#pFrstParty").innerHTML = "<table border='1' class='tblCenter'><tr>" + 
            "<td><strong>" + fnEscapeHTML(tmpCurrentPlayerData.hPlayer01.hNAM) + 
                     "</strong><br>HP: " + tmpCurrentPlayerData.hPlayer01.hHP +
                     "<br>MP: " + tmpCurrentPlayerData.hPlayer01.hMP + 
            "</td>" + 

            "<td><strong>" + fnEscapeHTML(tmpCurrentPlayerData.hPlayer02.hNAM) + 
                "</strong><br>HP: " + tmpCurrentPlayerData.hPlayer02.hHP +
                "<br>MP: " + tmpCurrentPlayerData.hPlayer02.hMP + 
            "</td>" + 

            "<td><strong>" + fnEscapeHTML(tmpCurrentPlayerData.hPlayer03.hNAM) + 
                "</strong><br>HP: " + tmpCurrentPlayerData.hPlayer03.hHP +
                "<br>MP: " + tmpCurrentPlayerData.hPlayer03.hMP + 
            "</td>" + 
        "</tr></table>"; // END Party Table

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
                tmpCurrentPlayerData._inventory.push(frstNPC01.hWEP);
                // Random path setup ABOVE, and used here
                tmpCurrentPlayerData._currentScreen = tmpRndPath[(Math.floor(Math.random()*tmpRndPath.length))];
                // Then save to localstoage
                fnSaveParty(tmpCurrentPlayerData);
                break;
             case "frstHP":
                console.log("Got HP", Math.round(tmpBonusHP), frstNPC01.hHP);
                tmpCurrentPlayerData.hPlayer01.hHP += (Math.round(tmpBonusHP) + frstNPC01.hLUK);
                tmpCurrentPlayerData.hPlayer02.hHP += (Math.round(tmpBonusHP) + frstNPC01.hLUK);
                tmpCurrentPlayerData.hPlayer03.hHP += (Math.round(tmpBonusHP) + frstNPC01.hLUK);
                tmpGold = fnRandomNumRange(777, 999)
                tmpCurrentPlayerData._gold += tmpGold;
                tmpCurrentPlayerData._inventory.push(frstNPC01.hWEP);
                tmpCurrentPlayerData._currentScreen = tmpRndPath[(Math.floor(Math.random()*tmpRndPath.length))];
                fnSaveParty(tmpCurrentPlayerData);
                break;
             default:
                console.log("Error", frstStat);
                break;
         }; // END switch()

        // Say message
        document.querySelector("#pFrstResult").innerHTML = "<p>Congratulations! " + frstNPC01.hNAM + 
        " has given you their " + frstNPC01.hWEP + ", " + tmpGold + " gold, and enhanced your stats thus!</p>";
        // Update Party Table NOTE: (+=) not (=)
        document.querySelector("#pFrstResult").innerHTML += "<p><table border='1' class='tblCenter'><tr>" + 
            "<td><strong>" + fnEscapeHTML(tmpCurrentPlayerData.hPlayer01.hNAM) + 
                     "</strong><br>HP: " + tmpCurrentPlayerData.hPlayer01.hHP +
                     "<br>MP: " + tmpCurrentPlayerData.hPlayer01.hMP + 
            "</td>" + 

            "<td><strong>" + fnEscapeHTML(tmpCurrentPlayerData.hPlayer02.hNAM) + 
                "</strong><br>HP: " + tmpCurrentPlayerData.hPlayer02.hHP +
                "<br>MP: " + tmpCurrentPlayerData.hPlayer02.hMP + 
            "</td>" + 

            "<td><strong>" + fnEscapeHTML(tmpCurrentPlayerData.hPlayer03.hNAM) + 
                "</strong><br>HP: " + tmpCurrentPlayerData.hPlayer03.hHP +
                "<br>MP: " + tmpCurrentPlayerData.hPlayer03.hMP + 
            "</td>" + 
        "</tr></table></p>"; // END Party Table
        // Add NEXT LEVEL BUTTON
        document.querySelector("#pFrstResult").innerHTML += "<p>Now, head to The " + (tmpCurrentPlayerData._currentScreen).slice(3, (tmpCurrentPlayerData._currentScreen).length) + " and continue your quest!</p>" + 
            "<br><button id='btnFrstNext'>Go</button>";
        document.querySelector("#btnFrstNext").addEventListener("click", function(){fnNavGame("#scForest", tmpCurrentPlayerData._currentScreen, tmpCurrentPlayerData._id);});
    }; // END fnFrstAction
}; // END fnLvForest
