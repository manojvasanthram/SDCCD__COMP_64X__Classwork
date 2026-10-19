# Assignment 4.3 — recording guide
Target: 4 minutes 30 seconds. Submit the video only, under five minutes.

This project extends the lecture code. Explain the portions you understand in your own words.
The Lake, Mountain and Bridge destinations are end-of-chapter camps, not additional combat levels.

| Time | Show | Explain |
| --- | --- | --- |
| 0:00–0:30 | www/index.html: scWelcome, scTavern, scForest, scChapterComplete | Sections are screens. IDs let JavaScript update specific elements. |
| 0:30–1:10 | Start Game; enter name/email; Roll. Then www/js/scripts.js: Heroes and fnNewGame | One main hero and two random companions become one party object. Arrays supply stats, weapons and 26 possible names. Each party has an independent save ID. |
| 1:10–2:00 | Go to Tavern; choose STR, SPD or MP; show result. Code: fnLvTavern, fnTvnAction, fnTvnBattle | A random hero compares the chosen stat with the enemy. Win/loss/draw changes stats and awards gold. Buttons disable after the challenge and progress saves. |
| 2:00–2:50 | Go to Forest; note HP/MP; choose a bonus; compare values. Code: fnLvForest, fnFrstAction | A multidimensional array supplies the NPC, item and attribute. Random bonuses apply to every hero. Gold accumulates and the item appends to inventory. |
| 2:50–3:15 | Go to destination camp | The random route reaches a valid completion screen showing the whole party, total gold and inventory. |
| 3:15–4:15 | Save Game; Quit Game; refresh; Load Game; select the same party. Code: fnSaveParty, fnReadSave, fnGameLoad, fnGameTasks | JSON.stringify stores object data as text in browser localStorage. JSON.parse reconstructs it. Show that names, stats, gold and inventory match. No server database is used. |
| 4:15–4:30 | www/css/style.css: .tblCenter; finish on game | CSS makes tables and controls readable in the mobile preview. |

## Before recording
- Use a fresh party so all stages are available.
- Record the browser window only.
- Keep saved stats visible long enough to compare after loading.
- Do not clear browser storage; older parties can coexist.
- New parties using an existing email have separate IDs. Older saves overwritten before this change cannot be reconstructed.
- Settings opens the game guide and returns without restarting a level.

## Validation
Run from repository root: `node tests/game.test.cjs`.
The regression test checks independent saves, legacy duplicate indexes, corrupt entries,
all Tavern outcomes, both Forest bonuses, inventory preservation, all three destination camps,
and reloading without granting rewards again.

## Suggested Canvas comment
I extended the lecture-based game with Tavern challenges, Forest rewards, and a completed-chapter screen.
I tested creating separate parties and saving and loading their progress with JSON and localStorage.
The most challenging part was keeping navigation, saved data, and the displayed party state consistent.
