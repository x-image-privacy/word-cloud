import "./App.css";

import * as React from "react";

const defaultWords = [
  { id: "1234", text: "test", x: 10, y: 100 },
  { id: "2345", text: "hello", x: 50, y: 10 },
  { id: "3456", text: "haha", x: 130, y: 40 },
];

const centerRect = (rect: {
  id: string;
  text: string;
  x: number;
  y: number;
}) => {
  const elem = document.getElementById(rect.id);
  if (elem) {
    const h = elem.getBoundingClientRect().height;
    const w = elem.getBoundingClientRect().width;

    let x = rect.x + Math.floor(w / 2);
    let y = rect.y + Math.floor(h / 2);

    return [x, y];
  }
};

const distance = (
  w1: { id: string; text: string; x: number; y: number },
  w2: { id: string; text: string; x: number; y: number }
) => {
  const centerW1 = centerRect(w1);
  const centerW2 = centerRect(w2);

  return Math.sqrt(
    Math.pow(centerW2[0] - centerW1[0], 2) +
      Math.pow(centerW2[1] - centerW1[1], 2)
  );
};

const allCollision = (
  word: { id: string; text: string; x: number; y: number },
  wordArray: any[]
): any => {
  wordArray.forEach((w: { id: string; text: string; x: number; y: number }) => {
    if (word.id != w.id) {
      if (collision(word, w)) {
        console.log("collision");
        return true;
      } else {
        console.log("No collision");

        return false;
      }
    }
    return false;
  });
};

const collision = (
  word1: { id: string; text: string; x: number; y: number },
  word2: { id: string; text: string; x: number; y: number }
) => {
  const x1 = word1.x;
  const y1 = word1.y;
  const w1 = document.getElementById(word1.id).getBoundingClientRect().width;
  const h1 = document.getElementById(word1.id).getBoundingClientRect().height;

  const x2 = word2.x;
  const y2 = word2.y;
  const w2 = document.getElementById(word2.id).getBoundingClientRect().width;
  const h2 = document.getElementById(word2.id).getBoundingClientRect().height;

  if (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2) {
    console.log("collision");
    return true;
  } else {
    console.log("No collision");
    return false;
  }
};

const finished = (array: any[]) => {
  // if (!array.includes(w)) {
  //   array.push(array);
  // }

  array.forEach((word) => {
    // console.log(document.getElementById(word.id).getBoundingClientRect());
  });

  if (array.length === defaultWords.length) {
    // condition to stop
    return true;
  }
};

// w element to place, otherLocation how are already place
const findLocation = (
  word: { id: string; text: string; x: number; y: number },
  otherLocation: any[]
) => {
  let lastword = otherLocation[otherLocation.length - 1];

  console.log(innerHeight);
  console.log(innerWidth);
  let direction = 0;
  let xDirection = 0;
  let yDirection = 0;

  word.x = lastword.x;
  word.y = lastword.y;

  let ret = 1;

  while (ret) {
    direction = Math.random();
    xDirection = Math.random();
    yDirection = Math.random();

    if (direction == 0) {
      if (word.x >= innerWidth - 1) {
        word.x -= 1;
      } else if (word.x <= 1) {
        word.x += 1;
      } else {
        if (xDirection == 0) {
          word.x += 1;
        } else {
          word.x -= 1;
        }
      }
    }

    if (direction == 1) {
      if (word.y >= innerHeight - 1) {
        word.y -= 1;
      } else if (word.y <= 1) {
        word.y += 1;
      } else {
        if (yDirection == 0) {
          word.y += 1;
        } else {
          word.y -= 1;
        }
      }
    }

    ret = allCollision(word, otherLocation);
    console.log(ret);
  }

  return word;
};

const MAX_WIDTH = 150;
const Wordcloud = () => {
  const [words, setWords] = React.useState(defaultWords);
  const [intervalId, setIntervalId] = React.useState<number | null>(null);
  let positionWord = defaultWords;

  const updateWords = () => {
    setWords((prevWords) => {
      let currArray: any[] = [];
      console.log("start");

      const newWords = prevWords.map((w) => {
        const elem1 = document.getElementById(w.id);

        const rect = document.getElementById("rect");
        console.log("rectangle");
        console.log(rect?.getBoundingClientRect());
        // const x1 = elem1.getBoundingClientRect().x;
        // console.log(elem1.getBoundingClientRect());

        if (currArray.indexOf(w) == -1) {
          currArray.push(w);
          // console.log(currArray);
          w = findLocation(w, currArray);
        }

        return w;
        // {
        // ...w,
        // x: 100 - w.x > 0 ? w.x + 1 : w.x - 1,
        // y: 100 - w.y > 0 ? w.y + 1 : w.y - 1,
        // };
      });
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
