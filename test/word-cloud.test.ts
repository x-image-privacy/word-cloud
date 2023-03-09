import { test, expect, describe, it } from "vitest";

import {
  centerWord,
  distanceBetweenWord,
  netForce,
  uncenteredWord,
} from "../src/utils";

describe("Distance", () => {
  it("Naive test", () => {
    const words: {
      id: string;
      text: string;
      x: number;
      y: number;
    }[] = [
      { id: "1", text: "hello", x: 1, y: 1 },
      { id: "2", text: "world", x: 1, y: 2 },
    ];

    let w1 = words[0];
    let w2 = words[1];

    expect(distanceBetweenWord(w1, w2)).toEqual(1);
  });

  it("Naive test", () => {
    const words: {
      id: string;
      text: string;
      x: number;
      y: number;
    }[] = [
      { id: "1", text: "hello", x: -1, y: 1 },
      { id: "2", text: "world", x: 1, y: 2 },
    ];

    let w1 = words[0];
    let w2 = words[1];

    expect(distanceBetweenWord(w1, w2)).toEqual(1);
  });
});
test(" Distance naive test", () => {
  const words: {
    id: string;
    text: string;
    x: number;
    y: number;
  }[] = [
    { id: "1", text: "hello", x: 1, y: 1 },
    { id: "2", text: "world", x: 1, y: 2 },
  ];

  let w1 = words[0];
  let w2 = words[1];

  expect(distanceBetweenWord(w1, w2)).toEqual(1);
});

test("center of word naive test", () => {
  const words: {
    id: string;
    text: string;
    x: number;
    y: number;
  }[] = [
    { id: "1", text: "hello", x: 0, y: 5 },
    { id: "2", text: "world", x: 5, y: 2 },
  ];

  let w1 = words[0];
  let h = 10;
  let w = 10;

  let res = centerWord(w1, h, w);

  expect(res).toEqual({ id: "1", text: "hello", x: 5, y: 10 });
});

test("uncenter the word", () => {
  const words: {
    id: string;
    text: string;
    x: number;
    y: number;
  }[] = [
    { id: "1", text: "hello", x: 0, y: 5 },
    { id: "2", text: "world", x: 5, y: 2 },
  ];

  let w1 = words[0];
  let h = 10;
  let w = 10;

  let centered = centerWord(w1, h, w);
  let uncentered = uncenteredWord(centered, h, w);

  expect(uncentered).toEqual(w1);
});

test("netForce", () => {
  const words: {
    id: string;
    text: string;
    x: number;
    y: number;
  }[] = [
    { id: "1", text: "hello", x: 3, y: 4 },
    { id: "2", text: "world", x: 4, y: 6 },
    { id: "3", text: "world", x: 8, y: 5 },
  ];

  let passRect = [words[1], words[2]];

  let net = netForce(words[0], passRect);

  let res = [6, 3];

  expect(net).toEqual(res);
});
