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
        wordCloud.words.map(({ id, text, rect }) => {
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
