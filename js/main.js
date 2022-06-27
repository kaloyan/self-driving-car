import Car from "./Car.js";
import Road from "./Road.js";
import NNVisualizer from "./NNVisualizer.js";

const carCanvas = document.querySelector("#road");
carCanvas.width = 200;

const nnCanvas = document.querySelector("#nnCanvas");
nnCanvas.width = 500;

const carCtx = carCanvas.getContext("2d");
const nnCtx = nnCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const numCars = 10;
const cars = genGars(numCars);

let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"));
}

const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)];

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (const car of cars) {
    car.update(road.borders, traffic);
  }

  carCanvas.height = window.innerHeight;
  nnCanvas.height = window.innerHeight;

  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "green");
  }

  carCtx.globalAlpha = 0.2;

  for (const car of cars) {
    car.draw(carCtx, "blue");
  }

  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  // to animate dashes - optional
  // nnCtx.lineDashOffset = -time / 80;

  NNVisualizer.drawNetwork(nnCtx, bestCar.brain);

  requestAnimationFrame(animate);
}

document.querySelector("#saveBtn").addEventListener("click", save);
document.querySelector("#discardBtn").addEventListener("click", discard);

animate();

function genGars(num) {
  const cars = [];

  for (let i = 0; i < num; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }

  return cars;
}

function save() {
  let brain = JSON.stringify(bestCar.brain);
  // console.log(brain);
  localStorage.setItem("bestBrain", brain);
}

function discard() {
  localStorage.removeItem("bestBrain");
}
