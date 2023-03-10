import "./App.css";
import {
  futurPosition,
  getArea,
  getBoundingRect,
  placeWordOnOuterCircle,
  Word,
} from "./utils";
import * as React from "react";
import {
  CENTER_X,
  CENTER_Y,
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
  DEFAULT_RECT,
} from "./constants";

const CUT_OFF = 0.5;

export const MAX_FONT_SIZE = 20;
export const MIN_FONT_SIZE = 6;

const defaultWords: Word[] = [
  { id: "word-1", text: " Big word ", coef: 0.99 },
  { id: "word-2", text: "hello", coef: 0.8 },
  { id: "word-4", text: "caramba", coef: 0.97 },
  { id: "word-3", text: "all", coef: 0.74 },
  { id: "word-5", text: "Piniata", coef: 0.6 },
  { id: "word-6", text: "Taxi", coef: 0.93 },
  { id: "word-7", text: "papa", coef: 0.94 },
  { id: "word-8", text: "chicita", coef: 0.66 },
  { id: "word-9", text: "hellicopter", coef: 0.92 },
  { id: "word-10", text: "chiold", coef: 0.75 },
  { id: "word-11", text: "text", coef: 0.81 },
  { id: "word-12", text: "document", coef: 0.77 },
  { id: "word-13", text: "text", coef: 0.89 },
  { id: "word-14", text: "finger", coef: 0.91 },
  { id: "word-15", text: "girl", coef: 0.88 },
];

const Wordcloud = () => {
  const [words, setWords] = React.useState(defaultWords);

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
      const newPositions = rectsToPlace.slice(1).reduce(
        (placedElements, rect) => {
          // move the word
          const futureWord = futurPosition(
            // put the word in random place around the parent
            placeWordOnOuterCircle(rect),
            placedElements,
            3
          );
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
