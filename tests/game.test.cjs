// Regression tests for persistence and rewards, with a minimal DOM adapter.
const assert = require("node:assert/strict");
const vm = require("node:vm");
const fs = require("node:fs");
const elements = new Map();
function element(id = "") {
    return { id: id.replace(/^#/, ""), value: "", textContent: "", _html: "",
        get innerHTML() { return this._html; },
        set innerHTML(value) { this._html = value; this.children = []; },
        style: {}, disabled: false, children: [], listeners: {},
        addEventListener(event, fn) { this.listeners[event] = fn; },
        appendChild(child) { this.children.push(child); },
        removeAttribute(name) { if (name === "disabled") this.disabled = false; }
    };
}
function get(id) { if (!elements.has(id)) elements.set(id, element(id)); return elements.get(id); }
const values = new Map();
const alerts = [];
const context = {
    console: { log() {} }, crypto: require("node:crypto").webcrypto,
    document: { querySelector: get, querySelectorAll: () => [...elements.values()],
        createElement: () => element() },
    localStorage: { getItem: key => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, String(value)) },
    alert: message => alerts.push(message), Math: Object.create(Math)
};
context.window = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(process.argv[2] || __dirname + "/../www/js/scripts.js", "utf8"), context);
vm.runInContext(fs.readFileSync(__dirname + "/../www/js/battles.js", "utf8"), context);
const run = code => vm.runInContext(code, context);
const read = id => JSON.parse(values.get(id));
function create(name) {
    get("#pNGName").value = name;
    get("#pNGEmail").value = "same@example.com";
    run("fnNewGame()");
    return run("globalOurTroopEmail");
}
const first = create("Alpha"), second = create("Beta");
assert.notEqual(first, second);
assert.equal(read(first).hPlayer01.hNAM, "Alpha");
assert.equal(read(second).hPlayer01.hNAM, "Beta");
assert.equal(JSON.parse(values.get("lsAllPlayers")).length, 2);
assert.notEqual(read(first).hPlayer02.hNAM, read(first).hPlayer03.hNAM);
assert.equal(read(first)._gold, 0);
// Old duplicate email-keyed entries are displayed once; malformed saves are skipped.
values.set("old@example.com", JSON.stringify({...read(first), _id:"old@example.com"}));
values.set("bad", "{broken");
values.set("lsAllPlayers", JSON.stringify([first, second, first, "old@example.com", "bad", "missing"]));
run("fnAppInit()");
assert.equal(get("#spnLGSaves").textContent, 3);
run("fnSaveParty(fnReadSave(" + JSON.stringify(first) + "))");
assert.equal(JSON.parse(values.get("lsAllPlayers")).filter(id => id === first).length, 1);
// Run all Tavern outcomes, then both Forest reward choices.
for (const [stat, expected] of [[5,0], [10,11], [100,105]]) {
    const id = create("Contest" + stat);
    const data = read(id);
    for (const key of ["hPlayer01","hPlayer02","hPlayer03"]) { data[key].hSTR = stat; data[key].hLUK = 1; }
    values.set(id, JSON.stringify(data));
    context.Math.random = () => 0; // First hero, enemy STR 10, luck 1.
    run("fnNavGame('#scNewGame', '#scTavern'," + JSON.stringify(id) + ")");
    get("#btnTvnStr").listeners.click();
    assert.equal(read(id).hPlayer01.hSTR, expected);
    assert.equal(read(id)._currentScreen, "#scForest");
    assert.equal(Boolean(get("#btnTvnStr").disabled), true);
}
for (const choice of ["HP","MP"]) {
    const id = create("Forest" + choice);
    let data = read(id);
    data._currentScreen = "#scForest"; data._gold = 42; data._inventory = ["Old item"];
    values.set(id, JSON.stringify(data));
    run("fnGameLoad(" + JSON.stringify(id) + ")");
    get("#btnFrst" + choice).listeners.click();
    const after = read(id);
    for (const key of ["hPlayer01","hPlayer02","hPlayer03"])
        assert.equal(after[key]["h" + choice], data[key]["h" + choice] + 1);
    assert.equal(after._gold, 42 + (choice === "HP" ? 777 : 999));
    assert.equal(after._inventory.length, 2);
    assert.equal(after._inventory[0], "Old item");
    get("#btnFrstNext").listeners.click();
    assert.equal(read(id)._questCompleted, false);
    assert.equal(read(id)._battles[read(id)._currentScreen].status, "active");
    const snapshot = values.get(id);
    run("fnGameLoad(" + JSON.stringify(id) + ")");
    assert.equal(values.get(id), snapshot); // Loading cannot award another reward.
    run("fnGameTasks(document.querySelector('#scChapterComplete'), 'Save Game', globalOurTroopEmail, globalOurTroopData)");
    assert.equal(values.get(id), snapshot);
}
for (const route of ["#scLake","#scMountain","#scBridge"]) {
    const data = read(first); data._currentScreen = route; values.set(first, JSON.stringify(data));
    run("fnGameLoad(" + JSON.stringify(first) + ")");
    assert.equal(read(first)._battles[route].status, "active");
    assert.equal(get(route).style.display, "block");
}
// Fresh page load restores the same serialized party.
const saved = values.get(first);
const reloaded = {...context}; reloaded.window = reloaded;
vm.createContext(reloaded);
vm.runInContext(fs.readFileSync(process.argv[2] || __dirname + "/../www/js/scripts.js", "utf8"), reloaded);
vm.runInContext(fs.readFileSync(__dirname + "/../www/js/battles.js", "utf8"), reloaded);
reloaded.fnGameLoad(first);
assert.equal(values.get(first), saved);
console.log("PASS: independent saves, legacy saves, Tavern outcomes, HP/MP rewards, inventory, all routes, reload.");


// Deterministic combat fixtures exercise branches without relying on random rolls.
function fight(hp = 100, rounds = 2, heroHP = 100, strength = 10, screen = "#scLake") {
    const id = create("Battle");
    const party = read(id);
    for (const key of ["hPlayer01", "hPlayer02", "hPlayer03"]) {
        party[key].hHP = heroHP; party[key].hSTR = strength;
    }
    party._currentScreen = screen;
    party._battles[screen] = {screen, boss:{hNAM:"Boss",hHP:hp,hCLS:"Dark",hWEP:"Sword"},
        maxHP:hp,round:1,roundsLeft:rounds,used:[false,false,false],status:"active",log:[],reward:null};
    values.set(id, JSON.stringify(party));
    run(`fnGameLoad(${JSON.stringify(id)})`);
    return id;
}
function attack(id, index, screen = "#scLake") {
    run(`fnMiniBossAttack(${JSON.stringify(id)},${JSON.stringify(screen)},${index})`);
}
let battleId = fight();
attack(battleId,0);
assert.equal(read(battleId)._battles["#scLake"].boss.hHP,90);
assert.equal(read(battleId).hPlayer01.hHP,90);
const midTurn = values.get(battleId);
attack(battleId,0);
assert.equal(values.get(battleId),midTurn);
run(`fnGameLoad(${JSON.stringify(battleId)})`);
assert.equal(values.get(battleId),midTurn);
assert.equal(get("#pLakeAction").children[0].disabled,true);
attack(battleId,1); attack(battleId,2);
assert.equal(read(battleId)._battles["#scLake"].round,2);
assert.equal(get("#pLakeAction").children.every(button => !button.disabled),true);
attack(battleId,0); attack(battleId,1); attack(battleId,2);
assert.equal(read(battleId)._battles["#scLake"].status,"lost");
assert.equal(read(battleId)._gold,0);
assert.equal(get("#pLakeNext").children.length,1);
for (const screen of ["#scLake","#scMountain","#scBridge"]) {
    battleId = fight(10,1,100,10,screen);
    attack(battleId,0,screen);
    const won = read(battleId);
    assert.equal(won._battles[screen].status,"won");
    assert.equal(won.hPlayer01.hHP,100); // Lethal hit prevents retaliation.
    assert.ok(won._gold > 0);
    const snapshot = values.get(battleId);
    attack(battleId,1,screen);
    run(`fnGameLoad(${JSON.stringify(battleId)})`);
    assert.equal(values.get(battleId),snapshot); // No duplicate reward on load/click.
    run(`fnContinueBattle(${JSON.stringify(battleId)},${JSON.stringify(screen)})`);
    assert.equal(read(battleId)._currentScreen,
        screen === "#scLake" ? "#scMountain" : screen === "#scMountain" ? "#scBridge" : "#scChapterComplete");
}
battleId = fight(5,1,100,10); attack(battleId,0);
assert.equal(read(battleId)._battles["#scLake"].boss.hHP,0); // Overkill clamps HP.
battleId = fight(100,3,1,0);
attack(battleId,0); attack(battleId,1); attack(battleId,2);
assert.equal(read(battleId)._battles["#scLake"].status,"lost");
run("fnGameTasks(document.querySelector('#scLake'), 'Quit Game', globalOurTroopEmail, globalOurTroopData)");
assert.equal(get("#scWelcome").style.display,"block");
const legacy = read(first); delete legacy._gameVersion; delete legacy._battles;
legacy._questCompleted = true; legacy._currentScreen = "#scMountain";
values.set(first,JSON.stringify(legacy)); run(`fnGameLoad(${JSON.stringify(first)})`);
assert.equal(get("#scChapterComplete").style.display,"block");
assert.match(get("#pCompleteMessage").textContent,/Mountain/);
console.log("PASS: turn guards, counterattacks, rounds, defeat, all branch rewards, exact/overkill victory, mid-battle reload, quit, legacy completion.");
