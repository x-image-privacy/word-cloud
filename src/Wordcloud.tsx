import {
  boundParent,
  futurPosition,
  getAreaRectangle,
  getBoundingRect,
  getBoundingWordCloud,
  getMoveDirection,
  getNewPositions,
  placeFirstWord,
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

const CUT_OFF = 0.5;

export const MAX_FONT_SIZE = 20;
export const MIN_FONT_SIZE = 6;

type Props = {
  data: { category: string; words: Word[] }[];
  width?: number;
  height?: number;
  showBounds?: boolean;
  showWordBounds?: boolean;
};

const Wordcloud = ({
  data,
  width = CONTAINER_WIDTH,
  height = CONTAINER_HEIGHT,
  showBounds = false,
  showWordBounds = false,
}: Props) => {
  const [words, setWords] = React.useState(data);

  const centerX = width / 2;
  const centerY = height / 2;

  const updateWords = () => {
    setWords((prevWords) => {
      prevWords.forEach((cat) => ({
        ...cat,
        words: cat.words.sort((a, b) => (a.coef > b.coef ? -1 : 1)),
      }));
      const wordCloudOfWordCloud = prevWords.map(({ words }) => {
        const wordsToPlace = words.map((w) => ({
          ...w,
          rect: getBoundingRect(w.id) || DEFAULT_RECT,
        }));

        wordsToPlace.sort((a, b) => (a.coef > b.coef ? -1 : 1));
        const rectsToPlace = wordsToPlace.map((w) => w.rect);
        const firstRect = { ...rectsToPlace[0] };

        const centeredRect = placeFirstWord(firstRect, centerX, centerY);

        const newPositions = getNewPositions(rectsToPlace, centeredRect, 3)

        return wordsToPlace.map((word, idx) => ({
          ...word,
          rect: newPositions[idx],
        }));
      });

      const bigWordCloudsToPlace = wordCloudOfWordCloud.map((w) => ({
        rect: getBoundingWordCloud(w) || DEFAULT_RECT,
      }));
      bigWordCloudsToPlace.sort((a, b) =>
        getAreaRectangle(a.rect) > getAreaRectangle(b.rect) ? -1 : 1
      );

      const bigWordCloudsRectToPlace = bigWordCloudsToPlace.map((w) => w.rect);
      const firstWordCloud = { ...bigWordCloudsRectToPlace[0] };
      const centeredWordCloud = placeFirstWord(
        firstWordCloud,
        centerX,
        centerY
      );

      const newPositionWordCloud = getNewPositions(bigWordCloudsRectToPlace, centeredWordCloud, 1)

      // slide word inside the word cloud
      const slideCoeff = wordCloudOfWordCloud.map((wordCloud, idx) =>
        slideWords(
          wordCloud.map((w) => w.rect),
          getMoveDirection([centeredWordCloud], newPositionWordCloud[idx])
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
  const bounds = words.map((wordCloud) =>
    boundParent(
      wordCloud.words.map((w) => w.rect).filter(Boolean) as Rectangle[]
    )
  );
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
  }, [data]);

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={{ outline: "1px solid transparent" }}
      viewBox={`${bound.x} ${bound.y} ${bound.width} ${bound.height}`}
    >
      {words.map((wordCloud) => (
        <g id={wordCloud.category} opacity={1}>
          {wordCloud.words.map((word) => {
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
          })}
        </g>
      ))}
      {showBounds &&
        bounds.map((b) => (
          <rect
            x={b.x}
            y={b.y}
            width={b.width}
            height={b.height}
            fill="none"
            stroke="blue"
            strokeWidth={1}
          />
        ))}
      {showWordBounds &&
        words.map((wordCloud) =>
          wordCloud.words.map(({ text, rect: initRect }) => {
            const rect = {
              width: initRect?.width,
              height: initRect?.height,
              x: (initRect?.x || 0) - (initRect?.width || 0) / 2,
              y: (initRect?.y || 0) - (initRect?.height || 0) / 2,
            };
            return (
              <g opacity={0.5}>
                <rect
                  x={rect?.x}
                  y={rect?.y}
                  width={rect?.width}
                  height={rect?.height}
                  fill="none"
                  stroke="green"
                  strokeWidth={1}
                />
                <text x={rect?.x} y={rect?.y}>
                  {text}
                </text>
              </g>
            );
          })
        )}
    </svg>
  );
};
export default Wordcloud;
