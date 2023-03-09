import "./App.css";
import {
  centerOfObject,
  futurPosition,
  putWordInRandomPositionOnParent,
  setFirstWordInCenterOfParent,
} from "./utils";
import * as React from "react";

const defaultWords = [
  { id: "1234", text: "test", x: 10, y: 100 },
  { id: "2345", text: "hello", x: 50, y: 10 },
  { id: "3456", text: "haha", x: 130, y: 40 },
];

// may be we don't need this
export const isFinish = (
  passRect: { id: string; text: string; x: number; y: number }[]
) => {
  if (passRect.length === defaultWords.length) {
    return 1;
  } else {
    return 0;
  }
};

const PARENT_ID = "rect";

const Wordcloud = () => {
  const [words, setWords] = React.useState(defaultWords);
  const [intervalId, setIntervalId] = React.useState<number | null>(null);

  const updateWords = () => {
    console.log("start");

    setWords((prevWords) => {
      let passRect: { id: string; text: string; x: number; y: number }[] = [];

      console.log("start word move");

      const newWords = prevWords.map((w) => {
        const elem = document.getElementById(w.id);

        if (elem) {
          if (passRect.length === 0) {
            w = setFirstWordInCenterOfParent(w, PARENT_ID);
            passRect.push(w);
            console.log("first element done");
          } else {
            // Get the height and width of the word
            const heightW = elem.getBoundingClientRect().height;
            const widthW = elem.getBoundingClientRect().width;

            // put the word in random place arround the parent
            w = putWordInRandomPositionOnParent(w, PARENT_ID);

            // Get the center of the word
            w = centerOfObject(w, heightW, widthW);

            // move the word
            w = futurPosition(w, passRect, 3);

            passRect.push(w);
          }
        }
        return w;
      });

      return newWords;
    });
    console.log("stop");
  };

  React.useEffect(() => {
    updateWords();
  }, []);
  console.log(words);
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
