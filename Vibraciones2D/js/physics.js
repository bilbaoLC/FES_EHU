export const PI = Math.PI;

export function omegaX(qx) {
  return 2 * Math.abs(Math.sin(qx / 2));
}

export function omegaY(qy) {
  return 2 * Math.abs(Math.sin(qy / 2));
}

export function frequency(qx, qy, branch) {
  return branch === "x" ? omegaX(qx) : omegaY(qy);
}

export function displacement(nx, ny, time, state) {
  const phase = state.qx * nx + state.qy * ny - frequency(state.qx, state.qy, state.branch) * time;
  const value = state.amplitude * Math.cos(phase);
  return state.branch === "x" ? { x: value, y: 0 } : { x: 0, y: value };
}
