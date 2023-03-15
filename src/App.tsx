import "./App.css";
import {
  futurPosition,
  getBoundingRect,
  placeWordOnOuterCircle,
} from "./utils";
import * as React from "react";
import {
  CENTER_X,
  CENTER_Y,
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
  DEFAULT_RECT,
} from "./constants";
import { defaultWords1 } from "./data";

const CUT_OFF = 0.5;

export const MAX_FONT_SIZE = 20;
export const MIN_FONT_SIZE = 6;

const Wordcloud = () => {
  const [words, setWords] = React.useState(defaultWords1);

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
        x: CENTER_X,
        y: CENTER_Y,
      };

      const weight = [1, 1, 1, 1];
      const newPositions = rectsToPlace.slice(1).reduce(
        (placedElements, rect) => {
          const futureWord = futurPosition(rect, placedElements, 3, weight);
          // console.log("weight reduce", weight);
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

  React.useEffect(() => {
    updateWords();
  }, []);

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={CONTAINER_WIDTH}
      height={CONTAINER_HEIGHT}
      style={{ outline: "1px solid green" }}
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
            x={(word.rect?.x || CENTER_X).toString()}
            // I don't know why I have to add the third of the fontSize to center te word vertically but it works
            y={((word.rect?.y || CENTER_Y) + fontSize / 3).toString()}
          >
            {word.text}
          </text>
        );
      })}
      <line
        x1={CENTER_X}
        x2={CENTER_X}
        y1="0"
        y2={CONTAINER_HEIGHT}
        opacity={0.1}
        stroke="orange"
        strokeWidth="1"
      />
      <line
        x1="0"
        x2={CONTAINER_WIDTH}
        y1={CENTER_Y}
        y2={CENTER_Y}
        opacity={0.1}
        stroke="orange"
        strokeWidth="1"
      />
    </svg>
  );
};
export default Wordcloud;
