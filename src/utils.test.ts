import { describe, expect, it } from "vitest";
import {
  areCentersTooClose,
  Coordinate,
  allCollision,
  Rectangle,
  getMoveDirection,
  getTheCircle,
  getDistance,
} from "./utils";

const origin: Coordinate = {
  x: 0,
  y: 0,
};

const originRectangle: Rectangle = {
  x: 0,
  y: 0,
  width: 1,
  height: 1,
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
  it("1 rectangle", () => {
    expect(
      getMoveDirection([{ x: 4, y: 6, width: 4, height: 4 }], {
        x: 3,
        y: 4,
        width: 3,
        height: 3,
      })
    ).toEqual({ x: 1, y: 2 });
  });

  it("2 rectangles", () => {
    expect(
      getMoveDirection(
        [
          { x: 4, y: 6, width: 4, height: 4 },
          { x: 8, y: 5, width: 7, height: 7 },
        ],
        { x: 3, y: 4, width: 3, height: 3 }
      )
    ).toEqual({
      x: 6,
      y: 3,
    });
  });

  it("Negative coordinate", () => {
    expect(
      getMoveDirection([{ x: -4, y: -6, width: 4, height: 4 }], {
        x: 3,
        y: -4,
        width: 3,
        height: 3,
      })
    ).toEqual({
      x: -7,
      y: -2,
    });
  });

  it("Same coordinate", () => {
    expect(
      getMoveDirection([{ x: 0, y: 0, width: 4, height: 4 }], {
        x: 0,
        y: 0,
        width: 3,
        height: 3,
      })
    ).toEqual({
      x: 0,
      y: 0,
    });
  });
});

describe("All collision", () => {
  it("True", () => {
    expect(allCollision(originRectangle, [originRectangle])).toBe(true);
  });

  it("False", () => {
    expect(
      allCollision(originRectangle, [{ x: 4, y: 4, width: 2, height: 2 }])
    ).toBe(false);
  });

  it("Two placed element true", () => {
    expect(
      allCollision(originRectangle, [
        { x: 2, y: 2, width: 4, height: 4 },
        { x: 6, y: 6, width: 2, height: 2 },
      ])
    ).toBe(true);
  });

  it("Two placed element false", () => {
    expect(
      allCollision(originRectangle, [
        { x: 2, y: 2, width: 4, height: 4 },
        { x: 6, y: 6, width: 2, height: 2 },
      ])
    ).toBe(true);
  });
});

describe("Get distance", () => {
  it("Naive test", () => {
    expect(
      getDistance({ x: 1, y: 1 }, { x: 1, y: 1, width: 4, height: 4 })
    ).toEqual(0);
  });

  it("Naive test", () => {
    expect(
      getDistance({ x: 10, y: 5 }, { x: 1, y: 5, width: 4, height: 4 })
    ).toEqual(9);
  });
});

describe("Get the circle", () => {
  it("Center of mass one word", () => {
    expect(getTheCircle([{ x: 1, y: 1, width: 4, height: 4 }])).toEqual({
      x: 1,
      y: 1,
      radius: 250,
    });
  });

  it("Center of mass multiple words", () => {
    expect(
      getTheCircle([
        { x: 1, y: 1, width: 4, height: 4 },
        { x: 3, y: 4, width: 4, height: 4 },
        { x: 2, y: 2, width: 4, height: 4 },
        { x: -2, y: 1, width: 4, height: 4 },
      ])
    ).toEqual({
      x: 1,
      y: 2,
      radius: 250,
    });
  });

  it("Center of mass update radius", () => {
    expect(
      getTheCircle([
        { x: 0, y: 0, width: 4, height: 4 },
        { x: 600, y: 0, width: 4, height: 4 },
      ])
    ).toEqual({
      x: 300,
      y: 0,
      radius: 300,
    });
  });
});
