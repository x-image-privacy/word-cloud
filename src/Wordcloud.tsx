import "./App.css";
import {
  boundParent,
  futurPosition,
  getBoundingRect,
  Rectangle,
  Word,
} from "./utils";
import * as React from "react";

import { CONTAINER_HEIGHT, CONTAINER_WIDTH, DEFAULT_RECT } from "./constants";
import { defaultWords1 } from "./data";

const CUT_OFF = 0.5;

export const MAX_FONT_SIZE = 20;
export const MIN_FONT_SIZE = 6;

type Props = {
  data: Word[];
  width?: number;
  height?: number;
};

const Wordcloud = ({
  data,
  width = CONTAINER_WIDTH,
  height = CONTAINER_HEIGHT,
}: Props) => {
  const [words, setWords] = React.useState(data);

  const rectParent = {
    x: width / 2,
    y: height / 2,
    width: width,
    height: height,
  };

  const updateWords = () => {
    setWords((prevWords) => {
      const wordsToPlace = prevWords
        .map((w) => ({ ...w, rect: getBoundingRect(w.id) || DEFAULT_RECT }))
        .sort((a, b) => (a.coef > b.coef ? -1 : 1));
      const rectsToPlace = wordsToPlace.map((w) => w.rect);
      const firstRect = { ...rectsToPlace[0] };
      const centeredRect = {
        width: firstRect.width,
        height: firstRect.height,
        x: width / 2,
        y: height / 2,
      };

      const weight = [1, 1, 1, 1];
      const newPositions = rectsToPlace.slice(1).reduce(
        (placedElements, rect) => {
          const futureWord = futurPosition(rect, placedElements, 3, weight);
          return [...placedElements, futureWord];
        },
        [centeredRect]
      );

      return wordsToPlace.map((word, idx) => ({
        ...word,
        rect: newPositions[idx],
      }));
    });
  };

  // casting is fine here https://codereview.stackexchange.com/questions/135363/filtering-undefined-elements-out-of-an-array
  const rects = words.map((w) => w.rect).filter(Boolean) as Rectangle[];

  const bound = rects.length
    ? boundParent(rects)
    : {
        x: 0,
        y: 0,
        width: width,
        height: height,
      };

  console.log("bound", bound);

  React.useEffect(() => {
    updateWords();
  }, []);

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={{ outline: "1px solid green" }}
      viewBox={`${bound.x} ${bound.y} ${bound.width} ${bound.height}`}
    >
      {words.map((word) => {
        const fontSize =
          (word.coef - CUT_OFF) *
            (1 / (1 - CUT_OFF)) ** 2 *
            (MAX_FONT_SIZE - MIN_FONT_SIZE) +
          MIN_FONT_SIZE;

        return (
          <text
            key={word.id}
            // usefull to have the anchor at the center of the word
            textAnchor="middle"
            fontSize={fontSize}
            style={{ outline: "1px solid rgba(255, 0, 0, 0.1)" }}
            id={word.id}
            x={(word.rect?.x || width / 2).toString()}
            // I don't know why I have to add the third of the fontSize to center te word vertically but it works
            y={((word.rect?.y || height / 2) + fontSize / 3).toString()}
          >
            {word.text}
          </text>
        );
      })}
      <line
        x1={width / 2}
        x2={width / 2}
        y1="0"
        y2={height}
        opacity={0.1}
        stroke="orange"
        strokeWidth="1"
      />
      <line
        x1="0"
        x2={width}
        y1={height / 2}
        y2={height / 2}
        opacity={0.1}
        stroke="orange"
        strokeWidth="1"
      />
      <g>
        <text
          style={{ fill: "blue" }}
          x={bound.x}
          y={bound.y + 10}
          fontSize={10}
          textAnchor="start"
        >
          viewBox
        </text>
        <rect {...bound} stroke="blue" strokeWidth="1" fill="none" />
      </g>
    </svg>
  );
};
export default Wordcloud;
