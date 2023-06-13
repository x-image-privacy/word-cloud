import { WordCloudData } from "./components/types";

type Props = {
  showWordBounds: boolean;
  wordClouds?: WordCloudData;
};

const WordBounds = ({
  wordClouds,
  showWordBounds,
}: Props): JSX.Element | null => {
  if (!showWordBounds) {
    return null;
  }
  return (
    <>
      {wordClouds?.map((wordCloud) =>
        wordCloud.words.map(({ id, text, rect: initRect }) => {
          const rect = {
            width: initRect.width,
            height: initRect.height,
            x: initRect.x - initRect.width / 2,
            y: initRect.y - initRect.height / 2,
          };
          return (
            <g opacity={0.5} key={`${wordCloud.category}-${id}`}>
              <rect
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                fill="none"
                stroke="green"
                strokeWidth={1}
              />
              <text x={rect.x} y={rect.y}>
                {text}
              </text>
            </g>
          );
        })
      )}
    </>
  );
};

export default WordBounds;
