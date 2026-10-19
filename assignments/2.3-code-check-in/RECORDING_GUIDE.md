# Assignment 2.3 — Code Check-In

Submit a video under five minutes to Canvas, not these source files. Suggested recording length: 3–4 minutes.

## Recording walkthrough

1. Show Start Game. Enter a demonstration name and a unique example email; click Roll. Explain: “My main character uses the name I entered. Two companions receive random names and attributes.”
2. Show arrNamesGood in www/js/scripts.js. Explain: “This array contains 26 names, one for each letter A through Z. fnGetRandomArr uses Math.random, Math.floor, and the array length to select an entry.”
3. Show Heroes and the three new Heroes calls in fnNewGame. Explain: “The constructor assigns each character's name, health, strength, speed, magic, luck, weapon, and class. I create three separate character objects.”
4. Show tmpParty. Explain: “The party object groups the main character and both companions under hPlayer01, hPlayer02, and hPlayer03. The email identifies the saved party.”
5. Show localStorage.setItem(tmpParty._id, JSON.stringify(tmpParty)). Explain: “JSON.stringify converts the nested object to text for localStorage. The lsAllPlayers entry holds the email list used to find saved parties.”
6. Refresh the preview, click Load Game, and choose the demonstration party. Explain: “The data survives a refresh. JSON.parse reconstructs the saved object. The Tavern displays the same three heroes and their stats.”

## Before recording

- Use a fresh example email to avoid overwriting an existing party.
- Verify 26 A–Z names, three generated heroes, and the same heroes after reload.
- Keep the demonstration focused on party creation, grouping, and saving; Tavern combat is outside this assignment.
- Older 0917 saves reference a missing level; use a newly created party.

## Optional Canvas comment

Adapt this to your actual experience: “The code generates my main character and two companions, groups them into one party, and saves the party using JSON and localStorage. I verified that the party can be loaded after refreshing. [Add what you found easy or difficult.]”
