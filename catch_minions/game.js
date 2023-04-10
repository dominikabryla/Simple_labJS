const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let happyMinion = new Image(90, 120);
happyMinion.src = "minion.png";
let crazyMinion = new Image(140, 150);
crazyMinion.src = "crazy.png";

let maxMinions = 3;
let amountMinions = 0;
let points = 0;
let misses = 0;
let startTime = 0;
let endTime = 0;
let timeLeft = 60;
let drawInterval;
let clickedHappyMinions = 0;
let allHappyMinions = 0;
let allMinions = [];

let backgroundImage = new Image();
backgroundImage.src = "lab2.png";
backgroundImage.onload = function () {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
};

function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

function checkClickOnCanvasObject(canvas, object, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return (
    x >= object.x &&
    x <= object.x + object.width &&
    y >= object.y &&
    y <= object.y + object.height
  );
}

function createMinion(x, y, type) {
  let height, width, image;
  if (type === "happy") {
    height = 120;
    width = 90;
    image = happyMinion;
    allHappyMinions++;
  } else if (type === "crazy") {
    height = 150;
    width = 140;
    image = crazyMinion;
  }
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  ctx.drawImage(image, x, y, width, height);

  let minion = {
    appearingTime: new Date(),
    disappearingTime: null,
    clickingTime: null,
    isClicked: false,
    height,
    width,
    x,
    y,
    centerX,
    centerY,
    type,
  };

  canvas.addEventListener("click", function (event) {
    if (checkClickOnCanvasObject(canvas, minion, event) && !minion.isClicked) {
      minion.isClicked = true;
      minion.clickingTime = new Date();
      minion.disappearingTime = new Date();
      if (minion.type === "crazy") {
        points++;
        document.getElementById("points").innerHTML = "PENALTY: " + points;
      } else if (minion.type === "happy") {
        clickedHappyMinions++;
      }
      ctx.clearRect(minion.x, minion.y, minion.width, minion.height);
    }
  });

  return minion;
}

function createMinions() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const randomNumber = getRandomNumber(10);
  let minions = [];

  if (randomNumber === 0) {
    const happy = createMinion(
      getRandomNumber(canvas.width - happyMinion.width),
      getRandomNumber(canvas.height - happyMinion.height),
      "happy"
    );
    const crazy = createMinion(
      getRandomNumber(canvas.width - crazyMinion.width),
      getRandomNumber(canvas.height - crazyMinion.height),
      "crazy"
    );
    minions.push(happy);
    minions.push(crazy);
  } else if (randomNumber === 1) {
    const crazy = createMinion(
      getRandomNumber(canvas.width - crazyMinion.width),
      getRandomNumber(canvas.height - crazyMinion.height),
      "crazy"
    );
    minions.push(crazy);
  } else {
    const randomMinions = getRandomNumber(maxMinions) + 1;
    for (let i = 0; i < randomMinions; i++) {
      const happy = createMinion(
        getRandomNumber(canvas.width - happyMinion.width),
        getRandomNumber(canvas.height - happyMinion.height),
        "happy"
      );
      minions.push(happy);
    }
  }

  return minions;
}
function averageReactionTimeOnHappyMinions() {
  let reactionTimes = [];

  const average = sum / reactionTimes.length;
  return average;
}

function reactionTimeStandardDeviationOnHappyMinions() {}

function averageClickDistanceFromCenter() {
  let distances = [];

  const average = sum / distances.length;
  return average;
}

function hideButton() {
  const element = document.getElementById("start");
  element.remove();
}

// function result() {
//   let misses = allHappyMinions - clickedHappyMinions;
//   let avgReact = averageReactionTimeOnHappyMinions() / 1000;
//   let standardReact = standardReactionTimeOnHappyMinions() / 1000;
//   let message =
//     "all happy minions: " +
//     allHappyMinions +
//     "\n" +
//     "number of missed objects: " +
//     misses +
//     "\n" +
//     "penalty points for clicking crazy minions" +
//     points +
//     "\n" +
//     "average reaction time:" +
//     avgReact +
//     "seconds" +
//     "\n" +
//     "standard deviation of reaction time:" +
//     standardReact +
//     "seconds";
//   "\n" + "average distance of click from object center:";
//   // "\n" +
//   // "standard deviation of click distance from object center:"

// }

function updateTime() {
  let currentTime = Date.now();
  let remainingTime = Math.ceil((endTime - currentTime) / 1000);
  if (remainingTime <= 0) {
    remainingTime = 0;
    clearInterval(drawInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("gameover").innerHTML = "GAME OVER";
    document.getElementById("result").innerHTML = "RESULT";
  }
  document.getElementById("time").innerHTML = "TIME: " + remainingTime + "s";
  if (remainingTime > 0) {
    setTimeout(updateTime, 1000);
  }
}

function startGame() {
  allMinions = createMinions();
  hideButton();
  points = 0;
  misses = 0;
  startTime = Date.now();
  endTime = startTime + 6000;
  drawInterval = setInterval(createMinions, 2000); // create minions every 2 seconds
  setTimeout(updateTime, 1000);
  document.getElementById("time").innerHTML = "TIME: " + timeLeft + "s";
  document.getElementById("points").innerHTML = "PENALTY: " + points;
}
