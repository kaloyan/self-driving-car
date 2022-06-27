import { lerp } from "./helpers.js";

export class NeuralNetwork {
  constructor(neuronCounts) {
    this.layers = [];

    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.layers.push(new NNLayer(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = NNLayer.feedForward(givenInputs, network.layers[0]);

    for (let i = 1; i < network.layers.length; i++) {
      outputs = NNLayer.feedForward(outputs, network.layers[i]);
    }

    return outputs;
  }

  static mutateStatic(network, amount = 1) {
    network.layers.forEach((layer) => {
      for (let i = 0; i < layer.biases.length; i++) {
        layer.biases[i] = lerp(layer.biases[i], Math.random() * 2 - 1, amount);
      }

      for (let i = 0; i < layer.weights.length; i++) {
        for (let j = 0; j < layer.weights[i].length; j++) {
          layer.weights[i][j] = lerp(
            layer.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}

class NNLayer {
  constructor(inputNeurons, outputNeurons) {
    this.inputs = new Array(inputNeurons);
    this.outputs = new Array(outputNeurons);
    this.biases = new Array(outputNeurons);

    this.weights = [];
    for (let i = 0; i < inputNeurons; i++) {
      this.weights[i] = new Array(outputNeurons);
    }

    NNLayer.#randomize(this);
  }

  static #randomize(layer) {
    for (let i = 0; i < layer.inputs.length; i++) {
      for (let j = 0; j < layer.outputs.length; j++) {
        layer.weights[i][j] = Math.random() * 2 - 1; // gives value between -1 to 1
      }
    }

    for (let i = 0; i < layer.biases.length; i++) {
      layer.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs, layer) {
    for (let i = 0; i < layer.inputs.length; i++) {
      layer.inputs[i] = givenInputs[i];
    }

    for (let i = 0; i < layer.outputs.length; i++) {
      let sum = 0;

      for (let j = 0; j < layer.inputs.length; j++) {
        sum += layer.inputs[j] * layer.weights[j][i];
      }

      if (sum > layer.biases[i]) {
        layer.outputs[i] = 1;
      } else {
        layer.outputs[i] = 0;
      }
    }

    return layer.outputs;
  }
}
