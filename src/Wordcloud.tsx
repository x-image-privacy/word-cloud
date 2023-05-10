import {
  boundParent,
  futurPosition,
  getAreaRectangle,
  getBoundingRect,
  getBoundingWordCloud,
  Rectangle,
  slideWords,
  Word,
} from "./utils";
import * as React from "react";

import {
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
  DEFAULT_RECT,
  NUMBER_OF_INTERVALS,
} from "./constants";
import { explainWordCloud } from "./data";

const CUT_OFF = 0.5;

export const MAX_FONT_SIZE = 20;
export const MIN_FONT_SIZE = 6;

type Props = {
  data: { category: string; words: Word[] }[];
  width?: number;
  height?: number;
};

const Wordcloud = ({
  data,
  width = CONTAINER_WIDTH,
  height = CONTAINER_HEIGHT,
}: Props) => {
  const [words, setWords] = React.useState(data);

  const centerX = width / 2;
  const centerY = height / 2;

  const updateWords = () => {
    setWords((prevWords) => {
      const wordCloudOfWordCloud = prevWords.map(({ words }) => {
        const wordsToPlace = words
          .map((w) => ({ ...w, rect: getBoundingRect(w.id) || DEFAULT_RECT }))
          .sort((a, b) => (a.coef > b.coef ? -1 : 1));
        const rectsToPlace = wordsToPlace.map((w) => w.rect);
        const firstRect = { ...rectsToPlace[0] };
        const centeredRect = {
          width: firstRect.width,
          height: firstRect.height,
          x: centerX,
          y: centerY,
        };

        // Initialize the weights with the value 1, of the size of the number of intervals
        const weight = new Array(NUMBER_OF_INTERVALS).fill(1);

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

      const wordCloudToPlace = wordCloudOfWordCloud
        .map((w) => ({
          rect: getBoundingWordCloud(w) || DEFAULT_RECT,
        }))
        .sort((a, b) =>
          getAreaRectangle(a.rect) > getAreaRectangle(b.rect) ? -1 : 1
        );

      console.log(wordCloudToPlace);

      const wordCloudRectToPlace = wordCloudToPlace.map((w) => w.rect);
      const firstWordCloud = { ...wordCloudRectToPlace[0] };
      const centeredWodCloud = {
        width: firstWordCloud.width,
        height: firstWordCloud.height,
        x: centerX,
        y: centerY,
      };

      const wordCloudWeight = new Array(NUMBER_OF_INTERVALS).fill(1);

      const newPositionWordCloud = wordCloudRectToPlace.slice(1).reduce(
        (placedWordCloud, wordCloud) => {
          const futureWordCloud = futurPosition(
            wordCloud,
            placedWordCloud,
            3,
            wordCloudWeight
          );
          return [...placedWordCloud, futureWordCloud];
        },
        [centeredWodCloud]
      );

      // slide word inside the word cloud
      const slideCoeff = wordCloudOfWordCloud.map((wordCloud, idx) =>
        slideWords(
          wordCloud.map((w) => w.rect),
          newPositionWordCloud[idx]
        )
      );
      return prevWords.map((wordCloud, idx) => ({
        ...wordCloud,
        words: wordCloud.words.map((w, idxw) => ({
          ...w,
          rect: slideCoeff[idx][idxw],
        })),
      }));
    });
  };

  // casting is fine here https://codereview.stackexchange.com/questions/135363/filtering-undefined-elements-out-of-an-array
  const rects = words
    .map(
      (wordCloud) =>
        wordCloud.words.map((w) => w.rect).filter(Boolean) as Rectangle[]
    )
    .reduce((acc, wordCloud) => [...acc, ...wordCloud], []);

  const bound = rects.length
    ? boundParent(rects)
    : {
        x: 0,
        y: 0,
        width: width,
        height: height,
      };

  React.useEffect(() => {
    updateWords();
  }, []);

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={{ outline: "1px solid transparent" }}
      viewBox={`${bound.x} ${bound.y} ${bound.width} ${bound.height}`}
    >
      {words.map((wordCloud) =>
        wordCloud.words.map((word) => {
          const fontSize =
            (word.coef - CUT_OFF) *
              (1 / (1 - CUT_OFF)) ** 2 *
              (MAX_FONT_SIZE - MIN_FONT_SIZE) +
            MIN_FONT_SIZE;

          return (
            <text
              key={word.id}
              // useful to have the anchor at the center of the word
              textAnchor="middle"
              fontSize={fontSize}
              id={word.id}
              x={(word.rect?.x || centerX).toString()}
              // I don't know why I have to add the third of the fontSize to center te word vertically but it works
              y={((word.rect?.y || centerY) + fontSize / 3).toString()}
            >
              {word.text}
            </text>
          );
        })
      )}
    </svg>
  );
};
export default Wordcloud;
