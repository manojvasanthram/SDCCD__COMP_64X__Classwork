// COMP647: shared turn-based algorithm, adapted from the 1029 lecture branches.
// Configuration keeps the three levels consistent without copying battle logic.
const miniBossLevels = {
    "#scLake": { title: "Lake Laughlin", next: "#scMountain", stat: "hSTR",
        gold: [999, 1234], luck: null },
    "#scMountain": { title: "Mountain Pass", next: "#scBridge", stat: "hSPD",
        gold: [111, 222], luck: [50, 60] },
    "#scBridge": { title: "Bridge of Peril", next: "#scChapterComplete", stat: "hMP",
        gold: [55, 67], luck: [10, 15] }
};

function fnPartyHeroes(party) {
    return [party.hPlayer01, party.hPlayer02, party.hPlayer03];
}

// Persist the enemy and round state once. Returning to this level resumes it.
function fnLvMiniBoss(id, screen) {
    const party = fnReadSave(id);
    if (!party || !miniBossLevels[screen]) return;
    party._gameVersion = 647;
    party._questCompleted = false;
    party._currentScreen = screen;
    if (!party._battles) party._battles = {};
    if (!party._battles[screen]) {
        const boss = new Heroes(fnGetRandomArr(arrNamesBad), fnRandomNumRange(11, 101),
            fnGetRandomArr(arrStats), fnGetRandomArr(arrStats), fnGetRandomArr(arrStats),
            fnGetRandomArr(arrLuck), "Evil " + fnGetRandomArr(arrWeapons),
            "Dark " + fnGetRandomArr(arrClasses));
        party._battles[screen] = {
            screen, boss, maxHP: boss.hHP, round: 1, roundsLeft: fnRandomNumRange(1, 3),
            used: [false, false, false], status: "active", log: [], reward: null
        };
    }
    const battle = party._battles[screen];
    if (battle.status === "active" && fnPartyHeroes(party).every(hero => hero.hHP <= 0))
        fnFinishBattle(party, battle, "lost");
    globalOurTroopEmail = id;
    globalOurTroopData = party;
    fnSaveParty(party);
    fnRenderBattle(party, battle);
}

// One button click means one hero's attack and, if needed, one counterattack.
function fnMiniBossAttack(id, screen, index) {
    const party = globalOurTroopData;
    if (!party || party._id !== id || party._currentScreen !== screen) return;
    const battle = party._battles[screen];
    const heroes = fnPartyHeroes(party);
    const hero = heroes[index];
    // Guard the data as well as disabling buttons; prevent repeat turns/rewards.
    if (!battle || battle.status !== "active" || !hero || battle.used[index] || hero.hHP <= 0) return;
    battle.used[index] = true;
    const damage = Math.max(0, hero.hSTR);
    battle.boss.hHP = Math.max(0, battle.boss.hHP - damage);
    battle.log.push(hero.hNAM + " attacks for " + damage + ". Boss HP: " + battle.boss.hHP + ".");
    if (battle.boss.hHP === 0) {
        fnFinishBattle(party, battle, "won");
    } else {
        const hit = Math.ceil(hero.hHP / 10);
        hero.hHP = Math.max(0, hero.hHP - hit);
        battle.log.push(battle.boss.hNAM + " counters: " + hero.hNAM + " loses " + hit + " HP.");
        if (heroes.every(member => member.hHP <= 0)) {
            fnFinishBattle(party, battle, "lost");
        } else if (heroes.every((member, i) => battle.used[i] || member.hHP <= 0)) {
            battle.roundsLeft--;
            if (battle.roundsLeft === 0) {
                fnFinishBattle(party, battle, "lost");
            } else {
                battle.round++;
                battle.used = [false, false, false];
                battle.log.push("Round " + battle.round + ": surviving heroes can attack again.");
            }
        }
    }
    fnSaveParty(party); // Includes boss HP, used turns, remaining rounds and hero HP.
    fnRenderBattle(party, battle);
}

function fnFinishBattle(party, battle, outcome) {
    if (battle.status !== "active") return;
    battle.status = outcome;
    const config = miniBossLevels[battle.screen];
    if (outcome === "won") {
        const gold = fnRandomNumRange(...config.gold);
        party._gold += gold;
        const sharedLuck = config.luck ? fnRandomNumRange(...config.luck) / 100 : null;
        fnPartyHeroes(party).forEach(hero => {
            const luck = sharedLuck === null ? fnGetRandomArr(arrStats) / 100 : sharedLuck;
            hero.hLUK = Math.round((hero.hLUK + luck) * 100) / 100;
            hero[config.stat] += fnRandomNumRange(10, 25);
        });
        battle.reward = { gold, stat: config.stat.slice(1) };
        battle.log.push("Victory! +" + gold + " gold; every hero gains " +
            config.stat.slice(1) + " and luck.");
    } else {
        battle.log.push("Defeat. No battle rewards; your party may continue.");
    }
}

// Render actual HP/STR rather than the mismatched class/weapon labels in the sample.
function fnRenderBattle(party, battle) {
    const key = battle.screen.slice(3);
    const config = miniBossLevels[battle.screen];
    const heroes = fnPartyHeroes(party);
    document.querySelector("#p" + key + "Message").textContent =
        "Join forces at " + config.title + ". Each hero attacks once per round.";
    document.querySelector("#p" + key + "Party").innerHTML = fnPartyTable(party);
    document.querySelector("#p" + key + "Enemy").textContent =
        battle.boss.hNAM + " — " + battle.boss.hCLS + ", " + battle.boss.hWEP +
        " | Boss HP: " + battle.boss.hHP + " / " + battle.maxHP;
    document.querySelector("#p" + key + "Round").textContent =
        "Round " + battle.round + " | Rounds remaining (including this round): " + battle.roundsLeft;
    const action = document.querySelector("#p" + key + "Action");
    action.innerHTML = "";
    heroes.forEach((hero, index) => {
        const button = document.createElement("button");
        button.id = "btn" + key + "Hero" + index;
        button.textContent = "ATK: " + hero.hNAM + " (STR " + hero.hSTR + ")";
        button.disabled = battle.status !== "active" || battle.used[index] || hero.hHP <= 0;
        button.addEventListener("click", () => fnMiniBossAttack(party._id, battle.screen, index));
        action.appendChild(button);
    });
    const message = battle.status === "active" ? "Choose a hero whose attack is still available."
        : battle.status === "won" ? "Victory! Earned " + battle.reward.gold + " gold, " +
            battle.reward.stat + " and luck bonuses. Total gold: " + party._gold + "."
        : "Defeat: the party could not finish the fight. No reward; continue to the next area.";
    document.querySelector("#p" + key + "Result").textContent = message;
    const log = document.querySelector("#p" + key + "Log");
    log.innerHTML = "";
    battle.log.forEach(entry => {
        const item = document.createElement("li");
        item.textContent = entry;
        log.appendChild(item);
    });
    const next = document.querySelector("#p" + key + "Next");
    next.innerHTML = "";
    if (battle.status !== "active") {
        const button = document.createElement("button");
        button.textContent = config.next === "#scChapterComplete"
            ? "Continue to Dungeon entrance" : "Continue to " + config.next.slice(3);
        button.addEventListener("click", () => fnContinueBattle(party._id, battle.screen));
        next.appendChild(button);
    }
}

function fnContinueBattle(id, screen) {
    const party = globalOurTroopData;
    if (!party || party._id !== id || party._currentScreen !== screen) return;
    const battle = party._battles[screen];
    if (!battle || battle.status === "active") return;
    party._currentScreen = miniBossLevels[screen].next;
    fnSaveParty(party);
    fnNavGame(screen, party._currentScreen, id);
}
