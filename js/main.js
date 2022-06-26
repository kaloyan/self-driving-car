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
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS");

const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)];

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  car.update(road.borders, traffic);

  carCanvas.height = window.innerHeight;
  nnCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);

  road.draw(carCtx);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "green");
  }

  car.draw(carCtx, "blue");

  carCtx.restore();

  NNVisualizer.drawNetwork(nnCtx, car.brain);

  requestAnimationFrame(animate);
}

animate();
