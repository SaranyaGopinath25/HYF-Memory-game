

const playerName = new URLSearchParams(window.location.search).get("playerName");
console.log("PLAYER NAME: ", playerName);

const playerNameElement = document.getElementById("player-name");
playerNameElement.textContent = playerName ? playerName+"!" : "Player!";

const links = document.querySelectorAll(".level a");

links.forEach(link => { 
    const level = link.getAttribute("href").split("level=")[1];
    console.log("Setting link for level: ", level);
    link.href = `../game/game.html?level=${level}&playerName=${(playerName)}`;
})

