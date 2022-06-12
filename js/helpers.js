// calc linear interpolation
function lerp(A, B, t) {
  return A + (B - A) * t;
}

export { lerp };