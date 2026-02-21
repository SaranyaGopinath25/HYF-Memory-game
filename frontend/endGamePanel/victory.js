const params = new URLSearchParams(window.location.search);

const playerName = params.get("playerName");
const moves     = params.get("moves");
const score     = params.get("score");
const time      = params.get("time");
const level     = params.get("level");

// Populate stats
document.getElementById("player-name").textContent  = playerName ? playerName + "!" : "Player!";
document.getElementById("stat-moves").textContent   = moves  ?? "—";
document.getElementById("stat-score").textContent   = score !== null ? score + " XP" : "—";
document.getElementById("stat-time").textContent    = time   !== null ? time + "s"   : "—";

// Update nav links to carry playerName
document.getElementById("play-again-btn").href =
    "../levels/levels.html?playerName=" + encodeURIComponent(playerName || "");

document.getElementById("leaderboard-btn").href =
    "../leaderBoard/leaderBoard.html?playerName=" + encodeURIComponent(playerName || "");