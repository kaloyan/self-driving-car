import { lerp, getRGBA } from "./helpers.js";

export default class NNVusializer {
  static drawNetwork(ctx, network) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    // NNVusializer.drawLayer(ctx, network.layers[0], top, left, width, height);

    const layerHeight = height / network.layers.length;

    // for (let i = 0; i < network.layers.length; i++) {
    for (let i = network.layers.length - 1; i >= 0; i--) {
      const layerTop =
        top +
        lerp(
          height - layerHeight,
          0,
          network.layers.length == 1 ? 0.5 : i / (network.layers.length - 1)
        );

      // draw with dasher - optional
      // ctx.setLineDash([7, 3]);

      NNVusializer.drawLayer(
        ctx,
        network.layers[i],
        layerTop,
        left,
        width,
        layerHeight,
        i == network.layers.length - 1 ? ["↑", "←", "→", "↓"] : []
      );
    }
  }

  static drawLayer(ctx, layer, top, left, width, height, outputLabels) {
    const right = left + width;
    const bottom = top + height;
    // console.log(layer);
    const { inputs, outputs, weights, biases } = layer;
    const nodeRadius = 18;

    // draw vetices
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(NNVusializer.#getNodeX(inputs, i, left, right), bottom);
        ctx.lineTo(NNVusializer.#getNodeX(outputs, j, left, right), top);
        ctx.lineWidth = 2;

        ctx.strokeStyle = getRGBA(weights[i][j]);

        ctx.stroke();
      }
    }

    // draw inputs
    for (let i = 0; i < inputs.length; i++) {
      const x = NNVusializer.#getNodeX(inputs, i, left, right);

      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(inputs[i]);
      ctx.fill();
    }

    // draw outputs
    for (let i = 0; i < outputs.length; i++) {
      const x = NNVusializer.#getNodeX(outputs, i, left, right);

      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(outputs[i]);
      ctx.fill();

      // draw biases
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBA(biases[i]);
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (outputLabels[i]) {
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.font = nodeRadius * 2 + "px Arial";
        ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.2);
        ctx.lineWidth = 0.5;
        ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.2);
      }
    }
  }

  static #getNodeX(nodes, index, left, right) {
    return lerp(
      left,
      right,
      nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}
