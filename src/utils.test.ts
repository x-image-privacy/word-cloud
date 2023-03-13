import { describe, expect, it } from "vitest";
import { areCentersTooClose, Coordinate, Rectangle } from "./utils";

const origin: Coordinate = {
  x: 0,
  y: 0,
};

describe("areCentersTooClose", () => {
  it("No collisions", () => {
    expect(areCentersTooClose(origin, { x: 6, y: 0 }, 2, 2)).toBe(false);
    expect(areCentersTooClose(origin, { x: 0, y: 6 }, 2, 2)).toBe(false);
    expect(areCentersTooClose({ x: 0, y: 6 }, origin, 2, 2)).toBe(false);
  });
  it("Collisions in X", () => {
    expect(areCentersTooClose(origin, { x: 2, y: 0 }, 3, 2)).toBe(true);
    expect(areCentersTooClose(origin, { x: 2, y: 0 }, 2.1, 2)).toBe(true);
    expect(areCentersTooClose({ x: 2, y: 0 }, origin, 2.1, 2)).toBe(true);
  });
  it("Collisions in Y", () => {
    expect(areCentersTooClose(origin, { x: 0, y: 2 }, 2, 3)).toBe(true);
    expect(areCentersTooClose(origin, { x: 0, y: 2 }, 2, 2.1)).toBe(true);
    expect(areCentersTooClose({ x: 0, y: 2 }, origin, 2, 2.1)).toBe(true);
  });
  it("Collisions in X and Y", () => {
    expect(areCentersTooClose(origin, { x: 2, y: 2 }, 2.5, 2.5)).toBe(true);
    expect(areCentersTooClose(origin, { x: -2, y: -2 }, 2.5, 2.5)).toBe(true);
    expect(areCentersTooClose({ x: -2, y: -2 }, origin, 2.5, 2.5)).toBe(true);
  });
});
