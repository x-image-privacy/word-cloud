import "./App.css";
import { futurPosition, getBoundingRect, Rectangle, Word } from "./utils";
import * as React from "react";

import { CONTAINER_HEIGHT, CONTAINER_WIDTH, DEFAULT_RECT } from "./constants";

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
    width: width,
    height: height,
    centerY: height / 2,
    centerX: width / 2,
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

  // const parent = updateParent(
  //   words.filter((w) => Boolean(w.rect)).map((w) => w.rect) as Rectangle[]
  // );

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
      // viewBox={`${parent.centerX} ${parent.centerY} 1000 1000`}
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
    </svg>
  );
};
export default Wordcloud;
