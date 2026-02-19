const playerName = new URLSearchParams(window.location.search).get(
  "playerName"
);
console.log("PLAYER NAME: ", playerName);

const link = document.getElementById("level-page");

link.href = `../levels/levels.html?playerName=${playerName}`;
