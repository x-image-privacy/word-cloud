import "./App.css";
import { centerWord } from "./utils";
import * as React from "react";

const defaultWords = [
  { id: "1234", text: "test", x: 10, y: 100 },
  { id: "2345", text: "hello", x: 50, y: 10 },
  { id: "3456", text: "haha", x: 130, y: 40 },
];

const MAX_WIDTH = 150;
const Wordcloud = () => {
  const [words, setWords] = React.useState(defaultWords);
  const [intervalId, setIntervalId] = React.useState<number | null>(null);

  const updateWords = () => {
    setWords((prevWords) => {
      let passRect: { id: string; text: string; x: number; y: number }[] = [];

      const newWords = prevWords.forEach((w) => {
        const elem = document.getElementById(w.id);

        if (elem) {
          const heightW = elem.getBoundingClientRect().height;
          const widthW = elem.getBoundingClientRect().width;

          // Get the center of the word

          const centeredX = centerWord(w, heightW, widthW);

          const xW = centeredX[0];
          const yW = centeredX[1];
        }

        return w;
      });

      // const newWords = prevWords.map((w) => {

      //   const elem = document.getElementById(w.id);

      //   if (elem) {
      //     const heightW = elem.getBoundingClientRect().height;
      //     const widthW = elem.getBoundingClientRect().width;

      //     const rect = document.getElementById("rect");

      //     if (rect) {
      //       console.log(rect.getBoundingClientRect());
      //       const xParent = rect.getBoundingClientRect().x;
      //       const yParent = rect.getBoundingClientRect().y;
      //       const wParent = rect.getBoundingClientRect().width;
      //       const hParent = rect.getBoundingClientRect().height;
      //     }

      //     if (currArray.indexOf(w) == -1) {
      //       currArray.push(w);
      //       w = findLocation(w, currArray);
      //     }

      //     return w;
      //   }

      //   {
      //   ...w,
      //   x: 100 - w.x > 0 ? w.x + 1 : w.x - 1,
      //   y: 100 - w.y > 0 ? w.y + 1 : w.y - 1,
      //   };
      // });

      return newWords;
    });
  };

  React.useEffect(() => {
    setIntervalId(setInterval(updateWords, 50));

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="200px" height="200px">
      {words.map((word) => (
        <text
          fill="#000"
          id={word.id}
          x={word.x.toString()}
          y={word.y.toString()}
        >
          {word.text}
        </text>
      ))}
      <rect id="rect" stroke="#000" fill="none" width="200" height="200" />
    </svg>
  );
};
export default Wordcloud;
