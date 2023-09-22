import { useEffect, useState } from 'react';

import WordBounds from './WordBounds';
import CategoryCloudDisplay from './components/CategoryCloudDisplay';
import {
  MARGIN_HEIGHT,
  MARGIN_WIDTH,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
} from './components/constants';
import { PlacedWordCloud, Word, WordCloudData } from './components/types';
import {
  boundParent,
  computeFontSize,
  futureSpiralPosition,
  getBoundingWordCloud,
  slideWords,
} from './components/utils';
import { ExplanationData } from './types';

const useWordCloudLayout = (wordClouds: WordCloudData): PlacedWordCloud => {
  wordClouds.forEach((cloud, cloudIdx, originalWordClouds) => {
    const newWordCloud = cloud.words.slice(1).reduce<Word[]>(
      (placedWords, word) => {
        const futureItem = futureSpiralPosition(
          word.rect,
          placedWords.map(({ rect }) => rect),
        );
        return [...placedWords, { ...word, rect: futureItem }];
      },
      [cloud.words[0]],
    );
    originalWordClouds[cloudIdx].words = newWordCloud;
  });

  const placedWordCloud: PlacedWordCloud = wordClouds.map((cloud) => ({
    ...cloud,
    bound: getBoundingWordCloud(cloud.words),
  }));

  placedWordCloud.sort((cloudA, cloudB) => {
    return cloudA.bound.width * cloudA.bound.height >=
      cloudB.bound.width * cloudB.bound.height
      ? -1
      : 1;
  });

  const newWordClouds = placedWordCloud.reduce<PlacedWordCloud>(
    (accWordClouds, cloud, cloudIdx) => {
      if (cloudIdx === 0) {
        accWordClouds.push({
          ...cloud,
          bound: {
            ...cloud.bound,
            x: -cloud.bound.width / 2,
            y: -cloud.bound.height / 2,
          },
        });
        return accWordClouds;
      }
      const previousBounds = accWordClouds.map(({ bound }) => bound);

      const futurePos = futureSpiralPosition(cloud.bound, previousBounds);

      const newCloud = {
        ...cloud,
        bound: futurePos,
        words: slideWords(cloud.words, {
          x: futurePos.x - cloud.bound.x,
          y: futurePos.y - cloud.bound.y,
        }),
      };
      accWordClouds.push(newCloud);
      return accWordClouds;
    },
    [],
  );

  return newWordClouds;
  // return placedWordCloud;
};

const getHiddenElementId = (id: string) => `hidden-${id}`;

type Props = {
  data?: ExplanationData;
  width?: string;
  height?: string;
  hideWords?: boolean;
  showOrigin?: boolean;
  showBounds?: boolean;
  showWordBounds?: boolean;
  minFontSize?: number;
  maxFontSize?: number;
};

const Wordcloud = ({
  data,
  height = '100%',
  width = '100%',
  hideWords = false,
  showOrigin = false,
  showBounds = false,
  showWordBounds = false,
  minFontSize = MIN_FONT_SIZE,
  maxFontSize = MAX_FONT_SIZE,
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
    ? boundParent(rects)
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
            const width = rect?.width + MARGIN_WIDTH;
            const height = rect?.height + MARGIN_HEIGHT;
            return {
              ...w,
              rect: {
                // center rect in the middle
                x: -width / 2,
                y: -height / 2,
                width,
                height,
              },
            };
          });
          // sort rectangles based on their coefficient
          words.sort((a, b) => (a.coef > b.coef ? -1 : 1));

          return {
            category,
            words,
          };
        },
      );

      const layedOutWordClouds = useWordCloudLayout(wordCloudsWithRectangles);

      // set rectangles and let hook re-render
      setWordClouds(layedOutWordClouds);
    }
  }, [data]);

  return (
    <>
      <svg visibility='hidden' style={{ position: 'absolute' }}>
        {data?.map((c) => {
          const coefs = c.words.map((word) => word.coef);
          const minCoef = Math.min(...coefs);
          let maxCoef = Math.max(...coefs);
          return c.words.map((w) => (
            <text
              key={`${c.category}-${w.id}`}
              id={getHiddenElementId(w.id)}
              fontSize={computeFontSize(
                w.coef,
                maxCoef,
                minCoef,
                minFontSize,
                maxFontSize,
              )}
            >
              {w.text}
            </text>
          ));
        })}
      </svg>
      <svg
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        width={width}
        height={height}
        style={{ outline: '1px solid transparent' }}
        viewBox={`${bound.x} ${bound.y} ${bound.width} ${bound.height}`}
      >
        {showOrigin && (
          <>
            <line x1={-100} x2={100} y={0} stroke='red' />
            <line y1={-100} y2={100} x={0} stroke='red' />
          </>
        )}
        {bounds?.map(({ id, bound: b }) => (
          <>
            <rect
              className={
                showBounds ? 'stroke-blue-500 dark:stroke-green-200' : ''
              }
              style={{ cursor: 'pointer' }}
              key={`bounds-${id}`}
              x={b.x}
              y={b.y}
              rx={10}
              ry={10}
              width={b.width}
              height={b.height}
              fill='transparent'
              strokeWidth={1}
            >
              <title>Category: {id}; Score: TBA</title>
            </rect>
          </>
        ))}
        {wordClouds?.map((wordCloud) => {
          const coefs = wordCloud.words.map((word) => word.coef);
          const minCoef = Math.min(...coefs);
          let maxCoef = Math.max(...coefs);

          return (
            <g key={wordCloud.category} id={wordCloud.category} opacity={1}>
              {hideWords ? (
                <CategoryCloudDisplay wordCloud={wordCloud} />
              ) : (
                wordCloud.words.map((word) => {
                  const fontSize = computeFontSize(
                    word.coef,
                    maxCoef,
                    minCoef,
                    minFontSize,
                    maxFontSize,
                  );
                  return (
                    <text
                      key={`${wordCloud.category}-${word.id}`}
                      // useful to have the anchor at the center of the word
                      textAnchor='middle'
                      // y centering
                      dominantBaseline='middle'
                      fontSize={fontSize}
                      id={word.id}
                      x={(word.rect.x + word.rect.width / 2).toString()}
                      y={(word.rect.y + word.rect.height / 2).toString()}
                    >
                      {word.text}
                      <title>
                        Word: {word.text}; Score: {word.coef}
                      </title>
                    </text>
                  );
                })
              )}
            </g>
          );
        })}
        <WordBounds showWordBounds={showWordBounds} wordClouds={wordClouds} />
      </svg>
    </>
  );
};
export default Wordcloud;
