# COMP647 — Assignment 2.3 recording guide

Submit only a video under five minutes. This update extends the COMP646 game; it is not a rewrite. It adapts the 1029 lecture's three mini-boss branches. The separate 1027 Dungeon timer is not included in this check-in.

## Before recording

Pull main into Monaca and refresh the preview. Start a NEW party: previously completed COMP646 saves remain viewable as completed games. Do not clear existing storage. Test the buttons in your actual Monaca preview before recording; automated tests do not replace visual testing there.

## Gameplay

Create a main character with your chosen name and two randomized companions. Go to the Tavern, choose a stat contest, and continue to the Forest. Choose HP or MP, then Go. The Forest randomly starts you at Lake, Mountain, or Bridge; starting at Mountain or Bridge intentionally skips earlier branches. Subsequent progression is Lake → Mountain → Bridge → Dungeon entrance.

Each living hero can attack once per round, in any chosen order. STR determines damage. If the boss survives, the attacking hero loses 10% of current HP, rounded up. A fight has one to three rounds. When all available heroes have attacked, a new round starts or the party loses if no rounds remain. Zero boss HP means victory. If every hero reaches zero HP, the party loses. Victory grants gold and stat/luck bonuses once. Defeat grants no battle reward; either outcome allows continuing, following the lecture. Dungeon entrance is this chapter's endpoint, not a playable Dungeon level.

## Suggested recording (4 minutes 40 seconds)

| Time | Demonstrate | Explain in your own words |
|---|---|---|
| 0:00–0:40 | Create a named party; show all three heroes. | Character objects store names and randomized stats. A party groups them and has its own save ID. |
| 0:40–1:15 | Tavern contest, Forest HP/MP choice, Go. | Conditions compare stats; choices update the party; randomness selects a branch. |
| 1:15–2:15 | Boss HP, available rounds, hero attacks and result. | Each hero gets one attack per round. STR reduces boss HP; a surviving boss counterattacks. A lethal hit may end the fight before all three heroes act. |
| 2:15–2:45 | Save, Quit, Load the same party. Prefer doing this mid-fight. | The enemy HP, hero HP, used turns and remaining rounds are saved together. Loading resumes that state. |
| 2:45–4:30 | Show the code locations below. | Focus on turn guards, damage, conditions, rewards and JSON persistence. |
| 4:30–4:40 | Return to game and show the result/Continue. | Briefly state what you tested. |

For a short fight, demonstrate saving before attacking or in another branch. Do not change stats to manufacture an outcome for the recording.

## Code to show (line numbers for this update)

| File | Starting line / function | What happens |
|---|---|---|
| `www/js/scripts.js` | 217, `fnNewGame` | Creates the main hero and two companions; groups them into an independently saved party. |
| `www/js/scripts.js` | 12, `fnReadSave`; 23, `fnSaveParty` | Converts between JSON strings and objects with localStorage. No server database is used. |
| `www/js/scripts.js` | 105, `fnNavGame` | Routes to existing scenes or the new battle handler; preserves old completed games. |
| `www/js/battles.js` | 3, `miniBossLevels` | Defines each branch's next scene and reward rules. |
| `www/js/battles.js` | 17, `fnLvMiniBoss` | Creates a randomized boss only once, or restores the existing saved fight. |
| `www/js/battles.js` | 44, `fnMiniBossAttack` | Rejects repeated turns; applies STR damage, retaliation, round limits, and win/loss conditions; saves the resulting state. |
| `www/js/battles.js` | 79, `fnFinishBattle` | Sets the outcome and grants victory rewards once. |
| `www/js/battles.js` | 101, `fnRenderBattle` | Displays stats and battle log; disables used hero buttons and shows Continue after the outcome. |
| `www/js/battles.js` | 146, `fnContinueBattle` | Saves the next location and navigates there. |
| `www/index.html` | 139 / 161 / 183 | Lake, Mountain and Bridge screen containers that JavaScript updates. |

## Implementation changes

- Added one shared battle algorithm and three branch screens instead of copying the lecture's battle code three times.
- Stored enemy, turns, rounds, result and reward in the party's `_battles` property.
- Added active/used-turn guards to prevent duplicate attacks and rewards.
- Corrected displayed battle stats and branch-specific rewards: Lake STR, Mountain SPD, Bridge MP.
- Preserved unique party IDs, legacy saves, JSON persistence, Tavern/Forest rewards and navigation controls.
- Added a safe Dungeon entrance completion screen in place of navigating to a missing level.

## Verification

Run `node tests/game.test.cjs`. The test harness uses a minimal DOM adapter and in-memory storage. It checks independent and legacy saves, Tavern outcomes, Forest rewards, all branch routes, mid-fight reload, repeated-turn rejection, counterattacks, round reset/exhaustion, exact and overkill victories, reward deduplication, all-heroes defeat, Quit, and completed legacy parties.

JavaScript syntax checks: `node --check www/js/scripts.js` and `node --check www/js/battles.js`.

Monaca visual validation and the final student recording must still be completed. No video has been submitted to Canvas by this update.
