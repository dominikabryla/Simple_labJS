const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let happyMinion = new Image(90, 120);
let crazyMinion = new Image(140, 150);
happyMinion.src = "minion.png";
crazyMinion.src = "crazy.png";

let maxMinions = 3;
let clickedHappyMinions = 0;
let allHappyMinions = 0;
let allMinions = [];
let points = 0;
let misses = 0;
let startTime = 0;
let endTime = 0;
let timeLeft = 60;
let drawInterval;

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

///// -----------------------TWORZENIE ----------------------- \\\\\

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
    clickDistance: null,
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
        minion.clickDistance = Math.sqrt(
          Math.pow(event.clientX - minion.centerX, 2) +
            Math.pow(event.clientY - minion.centerY, 2)
        );
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

///// -----------------------OBLICZENIA ----------------------- \\\\\

function averageReactionTimeOnHappyMinions() {
  let reactionTimes = [];

  allMinions.forEach((minion) => {
    if (minion.type === "happy" && minion.isClicked) {
      reactionTimes.push(minion.clickingTime - minion.appearingTime);
    }
  });
  if (reactionTimes.length === 0) {
    return 0;
  }
  const sum = reactionTimes.reduce((acc, val) => acc + val);
  const average = sum / reactionTimes.length;
  return average;
}

function reactionTimeStandardDeviationOnHappyMinions() {
  let reactionTimes = [];

  allMinions.forEach((minion) => {
    if (minion.type === "happy" && minion.isClicked) {
      reactionTimes.push(minion.clickingTime - minion.appearingTime);
    }
  });

  if (reactionTimes.length === 0) {
    return 0;
  }

  const average =
    reactionTimes.reduce((acc, val) => acc + val) / reactionTimes.length;
  const variance =
    reactionTimes.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) /
    reactionTimes.length;
  const stdDev = Math.sqrt(variance);

  return stdDev;
}

function averageClickDistanceFromCenter() {
  let distances = [];

  allMinions.forEach((minion) => {
    if (minion.type === "happy" && minion.isClicked) {
      distances.push(minion.clickDistance);
    }
  });

  if (distances.length === 0) {
    return 0;
  }

  const sum = distances.reduce((acc, val) => acc + val);
  const average = sum / distances.length;
  return average;
}

function standardDeviationClickDistanceFromCenter() {
  let distances = [];

  allMinions.forEach((minion) => {
    if (minion.type === "happy" && minion.isClicked) {
      distances.push(minion.clickDistance);
    }
  });

  if (distances.length === 0) {
    return 0;
  }

  const average = distances.reduce((acc, val) => acc + val) / distances.length;
  const variance =
    distances.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) /
    distances.length;
  const stdDev = Math.sqrt(variance);

  return stdDev;
}
///// -----------------------NAPISY,PRZYCISKI ----------------------- \\\\\

function hideButton() {
  const element = document.getElementById("start");
  element.remove();
}

function addParaToPanel(message) {
  const para = document.createElement("p");
  const node = document.createTextNode(message);
  para.appendChild(node);
  const element = document.getElementById("panel");
  element.appendChild(para);
}

function result() {
  document.getElementById("result").style.display = "none";
  document.getElementById("panel").style.display = "block";
  const message = "all happy minions: " + allHappyMinions + "\n";
  addParaToPanel(message);

  misses = allHappyMinions - clickedHappyMinions;
  const message2 = "number of missed objects: " + misses + "\n";
  addParaToPanel(message2);

  const message3 =
    "penalty points for clicking crazy minions: " + points + "\n";
  addParaToPanel(message3);

  let avgReact = averageReactionTimeOnHappyMinions() / 1000;
  const message4 = "average reaction time: " + avgReact + " s" + "\n";
  addParaToPanel(message4);

  let stdReact = reactionTimeStandardDeviationOnHappyMinions() / 100;
  const message5 =
    "standard deviation of reaction time:" + stdReact + " s" + "\n";
  addParaToPanel(message5);

  let avgClick = Math.floor(averageClickDistanceFromCenter());
  const message6 =
    "average distance of click from object center: " + avgClick + " px" + "\n";
  addParaToPanel(message6);

  let stdClick = Math.floor(standardDeviationClickDistanceFromCenter());
  const message7 =
    "standard deviation of click distance from object center: " +
    stdClick +
    " px";
  addParaToPanel(message7);
}

///// ----------------------- PLAY ----------------------- \\\\\

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
  endTime = startTime + 60000;
  drawInterval = setInterval(createMinions, 3500); // create minions every 2 seconds
  setTimeout(updateTime, 1000);
  document.getElementById("time").innerHTML = "TIME: " + timeLeft + "s";
  document.getElementById("points").innerHTML = "PENALTY: " + points;
}
