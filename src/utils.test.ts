import { describe, expect, it } from "vitest";
import {
  areCentersTooClose,
  Coordinate,
  getBoundingRect,
  Rectangle,
  getMoveDirection,
} from "./utils";

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

describe("Get move direction", () => {
  it("Test with three rectangle", () => {
    const rect = { id: "word-1", text: " Big word ", coef: 0.99 };

    expect(
      getMoveDirection(
        [
          {
            x: 4,
            y: 6,
            width: 4,
            height: 4,
          },
          {
            x: 8,
            y: 5,
            width: 7,
            height: 7,
          },
        ],
        {
          x: 3,
          y: 4,
          width: 3,
          height: 3,
        }
      )
    ).toEqual({
      x: 6,
      y: 3,
      width: 3,
      height: 3,
    });
  });
});
