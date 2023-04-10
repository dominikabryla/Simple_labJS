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

const minionObject = {
  appearingTime: new Date(), // czas pojawienia się
  disappearingTime: null, // czas zniknięcia
  clickingTime: null, // czas kliknięcia
  isClicked: false, // czy obiekt został kliknięty
  height: 90, // wysokość obiektu 90 lub 140
  width: 120, // szerokość obiektu 120 lub 150
  x: 0, // pozycja X lewego górnego rogu
  y: 0, // pozycja Y lewego górnego rogu
  centerX: x + width / 2, // współrzędna X środka obiektu
  centerY: y + height / 2, // współrzędna Y środka obiektu
  type: "happy", // typ obiektu happy lub crazy
};

let backgroundImage = new Image();
backgroundImage.src = "lab2.png";
backgroundImage.onload = function () {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
};

function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

function createMinion(x, y, type) {
  const height = type === "crazy" ? 140 : 90;
  const width = type === "crazy" ? 150 : 120;
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  ctx.drawImage(
    type === "crazy" ? crazyMinion : happyMinion,
    x,
    y,
    width,
    height
  );

  return {
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
}

function createMinion() {
  let x = getRandomNumber(canvas.width - happyMinion.width);
  let y = getRandomNumber(canvas.height - happyMinion.height);
  createMinion(x, y, "happy");
}

function createMinion() {
  let x = getRandomNumber(canvas.width - happyMinion.width);
  let y = getRandomNumber(canvas.height - happyMinion.height);
  createMinion(x, y, "happy");
}

function createCrazyMinion() {
  let x = getRandomNumber(canvas.width - crazyMinion.width);
  let y = getRandomNumber(canvas.height - crazyMinion.height);
  ctx.drawImage(crazyMinion, x, y, crazyMinion.width, crazyMinion.height);
  return { x, y, type: "crazy" };
}

function createMinions() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const randomNumber = getRandomNumber(10);
  if (randomNumber === 0) {
    const happy = createMinion();
    const crazy = createCrazyMinion();
    amountMinions++;
    canvas.addEventListener("click", function (e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (
        x >= happy.x &&
        x <= happy.x + happyMinion.width &&
        y >= happy.y &&
        y <= happy.y + happyMinion.height
      ) {
        ctx.clearRect(happy.x, happy.y, happyMinion.width, happyMinion.height);
        amountMinions--;
      } else if (
        x >= crazy.x &&
        x <= crazy.x + crazyMinion.width &&
        y >= crazy.y &&
        y <= crazy.y + crazyMinion.height
      ) {
        ctx.clearRect(crazy.x, crazy.y, crazyMinion.width, crazyMinion.height);
        points++;
      }
      misses += amountMinions;
      amountMinions = 0;
      document.getElementById("points").innerHTML = "PENALTY: " + points;
      document.getElementById("misses").innerHTML = "MISSES: " + misses;
    });
  } else if (randomNumber === 1) {
    const crazy = createCrazyMinion();
    crazy.type = "happy";
    canvas.addEventListener("click", function (e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (
        x >= crazy.x &&
        x <= crazy.x + crazyMinion.width &&
        y >= crazy.y &&
        y <= crazy.y + crazyMinion.height
      ) {
        ctx.clearRect(crazy.x, crazy.y, crazyMinion.width, crazyMinion.height);
        points++;
      }
      document.getElementById("points").innerHTML = "PENALTY: " + points;
      document.getElementById("misses").innerHTML = "MISSES: " + misses;
    });
  } else {
    const minions = [];
    const randomMinions = getRandomNumber(4);
    amountMinions = randomMinions;
    for (let i = 0; i < randomMinions; i++) {
      const minion = createMinion();
      minions.push(minion);
    }
    canvas.addEventListener("click", function (e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      let clickedMinion = null;
      for (let i = 0; i < minions.length; i++) {
        const minion = minions[i];
        if (
          x >= minion.x &&
          x <= minion.x + happyMinion.width &&
          y >= minion.y &&
          y <= minion.y + happyMinion.height
        ) {
          clickedMinion = minion;
          break;
        }
      }
      if (clickedMinion) {
        ctx.clearRect(
          clickedMinion.x,
          clickedMinion.y,
          happyMinion.width,
          happyMinion.height
        );
        amountMinions--;
      }
      misses += amountMinions;
      amountMinions = 0;
      document.getElementById("points").innerHTML = "PENALTY: " + points;
      document.getElementById("misses").innerHTML = "MISSES: " + misses;
    });
  }
}

function hideButton() {
  const element = document.getElementById("start");
  element.remove();
}

function mouseCoordinates(e) {
  let x = e.clientX;
  let y = e.clientY;
  let coordinates = "Coordinates: (" + x + "," + y + ")";
  document.getElementById("coordinates").innerHTML = coordinates;
}

function startGame() {
  hideButton();
  points = 0;
  misses = 0;
  startTime = Date.now();
  endTime = startTime + 60000;
  drawInterval = setInterval(createMinions, 2000); // create minions every 2 seconds
  setTimeout(updateTime, 1000);
  document.getElementById("time").innerHTML = "TIME: " + timeLeft + "s";
  document.getElementById("points").innerHTML = "PENALTY: " + points;
  document.getElementById("misses").innerHTML = "MISSES: " + misses;
}

function updateTime() {
  let currentTime = Date.now();
  let remainingTime = Math.ceil((endTime - currentTime) / 1000);
  if (remainingTime <= 0) {
    remainingTime = 0;
    clearInterval(drawInterval);
    document.getElementById("gameover").innerHTML = "GAME OVER";
    document.getElementById("result").innerHTML = "RESULT";
  }
  document.getElementById("time").innerHTML = "TIME: " + remainingTime + "s";
  if (remainingTime > 0) {
    setTimeout(updateTime, 1000);
  }
}

function result() {
  alert(
    "number of missed objects: " +
      "\n" +
      "average reaction time:" +
      "\n" +
      "standard deviation of reaction time:" +
      "\n" +
      "average distance of click from object center:" +
      "\n" +
      "standard deviation of click distance from object center:"
  );
}

function checkOverlap(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
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
