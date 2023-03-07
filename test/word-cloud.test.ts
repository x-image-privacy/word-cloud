import { test, expect } from "vitest";

import { centerWord } from "../src/utils";
import app from "../src/App";

test("1+1", () => {
  expect(1 + 1).toEqual(2);
});

// test(' Distance naive test', () =>{

//     const words = [
//         {id: "1", text: "hello", x:0, y:5 },
//         {id: "2", test: "world", x: 5, y:2 }
//     ];

//     let w1 = words.find(i => i.id === "1");
//     let w2 = words.find(i => i.id === "2");

//     expect(distance(w1, w2)).toStrictEqual(Math.sqrt(Math.pow()))

// })

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

  expect(res).toEqual([5, 10]);
});
