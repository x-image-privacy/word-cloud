import {
  boundParent,
  computeFontSize,
  futurPosition,
  getMoveDirection,
  slideWords,
} from "./components/utils";

import {
  MARGIN_HEIGHT,
  MARGIN_WIDTH,
  NUMBER_OF_INTERVALS,
} from "./components/constants";
import { useEffect, useState } from "react";
import { ExplanationData } from "./types";
import WordBounds from "./WordBounds";
import { Rectangle, Word, WordCloudData } from "./components/types";

const useWordCloudLayout = (wordClouds: WordCloudData): WordCloudData => {
  wordClouds.forEach((cloud, cloudIdx, originalWordClouds) => {
    // Initialize the weights with the value 1, of the size of the number of intervals
    const weight = new Array(NUMBER_OF_INTERVALS).fill(1);

    const newWordCloud = cloud.words.slice(1).reduce<Word[]>(
      (placedWords, word) => {
        const futureItem = futurPosition(
          word.rect,
          placedWords.map(({ rect }) => rect),
          3,
          weight
        );
        return [...placedWords, { ...word, rect: futureItem }];
      },
      [cloud.words[0]]
    );
    originalWordClouds[cloudIdx].words = newWordCloud;
    originalWordClouds[cloudIdx].bound = boundParent(
      newWordCloud.map(({ rect }) => rect)
    );
  });

  wordClouds.sort((cloudA, cloudB) => {
    return cloudA.bound &&
      cloudB.bound &&
      cloudA.bound.width * cloudA.bound.height >=
        cloudB.bound.width * cloudB.bound.height
      ? -1
      : 1;
  });

  // Initialize the weights with the value 1, of the size of the number of intervals
  const weight = new Array(NUMBER_OF_INTERVALS).fill(1);
  wordClouds.forEach((cloud, cloudIdx, originalWordClouds) => {
    if (cloudIdx === 0 || !cloud.bound) {
      return;
    }
    const futurePos = futurPosition(
      cloud.bound,
      originalWordClouds
        .slice(0, cloudIdx)
        .map(({ bound }) => bound as Rectangle),
      4,
      weight
    );
    const slidedWordRectangles = slideWords(
      originalWordClouds[cloudIdx].words.map(({ rect }) => rect),
      getMoveDirection([originalWordClouds[0].bound as Rectangle], futurePos)
    );
    originalWordClouds[cloudIdx].words = originalWordClouds[cloudIdx].words.map(
      (w, idx) => ({
        ...w,
        rect: slidedWordRectangles[idx],
      })
    );
    const newBound = boundParent(slidedWordRectangles);
    console.log(newBound);
    originalWordClouds[cloudIdx].bound = newBound;
  });

  return wordClouds;
};

const getHiddenElementId = (id: string) => `hidden-${id}`;

type Props = {
  data?: ExplanationData;
  width?: string;
  height?: string;
  showBounds?: boolean;
  showWordBounds?: boolean;
};

const Wordcloud = ({
  data,
  height = "100%",
  width = "100%",
  showBounds = false,
  showWordBounds = false,
}: Props) => {
  const [wordClouds, setWordClouds] = useState<WordCloudData>();

  // casting is fine here https://codereview.stackexchange.com/questions/135363/filtering-undefined-elements-out-of-an-array
  const rects = wordClouds
    ?.map((wordCloud) => wordCloud.words.map((w) => w.rect))
    .reduce((acc, wordCloud) => [...acc, ...wordCloud], []);
  const bounds = wordClouds?.map((wordCloud) => ({
    id: wordCloud.category,
    bound: boundParent(wordCloud.words.map((w) => w.rect)),
  }));
  const bound = rects?.length
    ? boundParent(rects as Rectangle[])
    : {
        x: -100,
        y: -100,
        width: 200,
        height: 200,
      };

  useEffect(() => {
    if (data) {
      // get rectangles from data
      const wordCloudsWithRectangles = data.map(
        ({ category, words: prevWords }) => {
          // get rectangle from canvas
          const words = prevWords.map((w) => {
            const rect = document
              .getElementById(getHiddenElementId(w.id))
              ?.getBoundingClientRect() || { x: 0, y: 0, width: 0, height: 0 };

            return {
              ...w,
              rect: {
                // center rect in the middle
                x: 0,
                y: 0,
                width: rect?.width + MARGIN_WIDTH,
                height: rect?.height + MARGIN_HEIGHT,
              },
            };
          });
          // sort rectangles based on their coefficient
          words.sort((a, b) => (a.coef > b.coef ? -1 : 1));

          return {
            category,
            words,
          };
        }
      );

      const layedOutWordClouds = useWordCloudLayout(wordCloudsWithRectangles);

      // set rectangles and let hook re-render
      setWordClouds(layedOutWordClouds);
    }
  }, [data]);

  console.log("wordClouds", wordClouds);

  return (
    <>
      <svg visibility="hidden" style={{ position: "absolute" }}>
        {data?.map((c) =>
          c.words.map((w) => (
            <text
              key={w.id}
              id={getHiddenElementId(w.id)}
              fontSize={computeFontSize(w.coef)}
            >
              {w.text}
            </text>
          ))
        )}
      </svg>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        style={{ outline: "1px solid transparent" }}
        viewBox={`${bound.x} ${bound.y} ${bound.width} ${bound.height}`}
      >
        {showBounds && (
          <>
            <line x1={-100} x2={100} y={0} stroke="blue" />
            <line y1={-100} y2={100} x={0} stroke="blue" />
          </>
        )}
        {wordClouds?.map((wordCloud) => (
          <g key={wordCloud.category} id={wordCloud.category} opacity={1}>
            {wordCloud.words.map((word) => {
              const fontSize = computeFontSize(word.coef);
              return (
                <text
                  key={word.id}
                  // useful to have the anchor at the center of the word
                  textAnchor="middle"
                  // y centering
                  alignmentBaseline="central"
                  fontSize={fontSize}
                  id={word.id}
                  x={word.rect.x.toString()}
                  // I don't know why I have to add the third of the fontSize to center te word vertically but it works
                  y={word.rect.y.toString()}
                >
                  {word.text}
                </text>
              );
            })}
          </g>
        ))}
        {showBounds &&
          bounds?.map(({ id, bound: b }) => (
            <rect
              key={`bounds-${id}`}
              x={b.x}
              y={b.y}
              width={b.width}
              height={b.height}
              fill="none"
              stroke="blue"
              strokeWidth={1}
            />
          ))}
        <WordBounds showWordBounds={showWordBounds} wordClouds={wordClouds} />
      </svg>
    </>
  );
};
export default Wordcloud;
