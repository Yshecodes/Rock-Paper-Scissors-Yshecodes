const API_KEY = "pr7UgrwwPfFm7OjcTLnKHCcAmAHwcr6A";

const possibleResults = {
  //DRAW
  rockrock: 1,
  paperpaper: 2,
  scissorsscissors: 3,
  //WIN
  scissorspaper: 4,
  rockscissors: 5,
  paperrock: 6,
  //LOSE
  scissorsrock: 7,
  rockpaper: 8,
  paperscissors: 9,
};

const soundEffect = {
  gameStart: new Audio("sounds/jankenpon.wav"),
  rematchSound: new Audio("sounds/aikodesho.wav"),
  winSound: new Audio("sounds/omedetou.wav"),
  loseSound: new Audio("sounds/zannen.wav"),
  drawSound: new Audio("sounds/shoubuda.wav"),
  pageAccess: new Audio("sounds/isshoniasobo.wav"),
};

const user = document.querySelector("#user");
const computer = document.querySelector("#computer");
const resultDisplay = document.querySelector("#result");
const choicesDisplay = document.querySelector("#choices");
const choices = ["rock", "paper", "scissors"];

let isDraw = false;

const clearDisplay = () => {
  user.innerText = "";
  computer.innerText = "";
  resultDisplay.innerText = "";
};

const handleClick = async (e) => {
  clearDisplay();
  const userChoice = e.target.textContent;
  const computerChoice = choices[Math.floor(Math.random() * choices.length)];
  await gamePlay(userChoice, computerChoice);
};

choices.forEach((choice) => {
  const button = document.createElement("button");
  button.textContent = choice;
  button.addEventListener("click", handleClick);
  choicesDisplay.append(button);
});

function displayGif(gifPath) {
  const gifContainer = document.getElementById("gif-container");
  gifContainer.src = gifPath;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const gifCache = {};

async function getRandomGif(query) {
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}&limit=1&offset=${Math.floor(
    Math.random() * 50
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.data.length > 0) {
      const gifUrl = data.data[0].images.original.url;
      return gifUrl;
    } else {
      throw new Error("No GIFs found");
    }
  } catch (error) {
    console.error("Error fetching GIF:", error);
    return null;
  }
}

async function gamePlay(userChoice, computerChoice) {
  if (!isDraw) {
    soundEffect.gameStart.play();
  } else {
    soundEffect.rematchSound.play();
  }

  user.textContent = `You chose ${userChoice.toUpperCase()}!`;

  await delay(1600);
  computer.textContent = `I chose ${computerChoice.toUpperCase()}!`;

  await delay(1160);

  const resultKey = userChoice + computerChoice;
  const gameResult = possibleResults[resultKey];

  let gifQuery = "";
  let resultMessage = "";

  if (gameResult === 4 || gameResult === 5 || gameResult === 6) {
    isDraw = false;
    gifQuery = userChoice;
    resultMessage = "YOU WIN😁!";
    soundEffect.winSound.play();
  } else if (gameResult === 7 || gameResult === 8 || gameResult === 9) {
    isDraw = false;
    gifQuery = computerChoice;
    resultMessage = "YOU LOSE🥲!";
    soundEffect.loseSound.play();
  } else {
    isDraw = true;
    gifQuery = "draw";
    resultMessage = `It's a DRAW😑\nChoose again!`;
    soundEffect.drawSound.play();
  }

  const gifUrl = await getRandomGif(gifQuery);
  if (gifUrl) {
    gifCache[gifQuery] = gifUrl;
    displayGif(gifUrl);
  }

  resultDisplay.innerText = resultMessage;
}

const modal = document.querySelector("#modal");
const yes = document.getElementById("yes");
const no = document.getElementById("no");

document.addEventListener("DOMContentLoaded", () => {
  displayGif("gif/loop.gif");
  setTimeout(() => {
    modal.showModal();
  }, 1000);
});

document.addEventListener("DOMContentLoaded", (event) => {
  const bgm = document.getElementById("bgm");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const volumeControl = document.getElementById("volumeControl");

  playPauseBtn.addEventListener("click", () => {
    if (bgm.paused) {
      bgm.play();
      playPauseBtn.textContent = "⏸";
    } else {
      bgm.pause();
      playPauseBtn.textContent = "⏯";
    }
  });

  volumeControl.addEventListener("input", (event) => {
    bgm.volume = event.target.value;
  });

  bgm.volume = volumeControl.value;

  bgm.addEventListener("error", (event) => {
    console.error("Error occurred during audio playback:", event);
    alert("There was an error playing the audio.");
  });
});

yes.addEventListener("click", () => {
  soundEffect.pageAccess.play();
  bgm.play().catch((error) => {
    console.log("An error occurred: " + error);
  });
  modal.close();
});

no.addEventListener("click", () => {
  soundEffect.pageAccess.play();
  modal.close();
});
