import {
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
  DEFAULT_RECT,
  NUMBER_OF_INTERVALS,
} from "./constants";

export type Word = {
  id: string;
  text: string;
  coef: number;
  rect?: Rectangle;
};

export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Coordinate = {
  x: number;
  y: number;
};

export type Circle = {
  x: number;
  y: number;
  radius: number;
};

export const getBoundingRect = (
  id: string,
  tagName: "svg" | "text" = "text"
): Rectangle => {
  const bbox =
    (
      document.getElementsByTagName(tagName).namedItem(id) || undefined
    )?.getBoundingClientRect() || DEFAULT_RECT;
  return {
    x: bbox.x,
    y: bbox.y,
    width: bbox.width + 10,
    height: bbox.height - 5,
  };
};

// This function put the first word in the center of the parent rectangle
export const setFirstWordInCenterOfParent = (w: Word, p: string): Rectangle => {
  const parentElement = document.getElementsByTagName("svg").namedItem(p);
  const word = getBoundingRect(w.id);
  if (parentElement && word) {
    const parent = parentElement.getBBox();

    const newX = (parent.width - word.width) / 2;
    const newY = (parent.height - word.height) / 2;
    return { x: newX, y: newY, width: word.width, height: word.height };
  }
  return { x: 0, y: 0, width: 50, height: 20 };
};

// This function return the distance between a rectangle and a cartesian coordinate
export const getDistance = (point: Coordinate, word: Rectangle): number => {
  return Math.sqrt((point.x - word.x) ** 2 + (point.y - word.y) ** 2);
};

// This function return the center of mass of multiple rectangle
export const centerOfMass = (passRect: Rectangle[]): Coordinate => {
  const centerMass: Coordinate = passRect.reduce(
    (acc, word) => {
      const sum = {
        x: acc.x + word.x,
        y: acc.y + word.y,
      };
      return sum;
    },
    { x: 0, y: 0 }
  );
  centerMass.x /= passRect.length;
  centerMass.y /= passRect.length;

  return centerMass;
};

// This function computes the circle which centre is the center of mass of the rectangle list passed in argument and which radius is equal to the farthest point from the centre
export const getTheCircle = (passRect: Rectangle[]): Circle => {
  const centerMass = centerOfMass(passRect);

  const distance: number[] = passRect.map((word) =>
    getDistance(centerMass, word)
  );

  const radius = Math.max(
    ...distance,
    CONTAINER_HEIGHT / 2,
    CONTAINER_WIDTH / 2
  );

  return { x: centerMass.x, y: centerMass.y, radius };
};

// This function return a random float between min and max
export const randomInterval = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// This function return the cumulative weight of an array : for example [1, 2, 3, 4] become [1, 3, 6, 10]
// source: https://quickref.me/create-an-array-of-cumulative-sum.html
export const cumulativeBins = (bin: number[]): number[] => {
  return bin.map(
    (
      (sum) => (value) =>
        (sum += value)
    )(0)
  );
};

// https://stackoverflow.com/questions/36947847/how-to-generate-range-of-numbers-from-0-to-n-in-es2015-only
// range(0, 9, 2) => [0, 2, 4, 6, 8]
// No negative step
export const rangeWithStep = (
  from: number,
  to: number,
  step: number
): number[] => {
  if (to < from) {
    return [];
  }
  return [...Array(Math.floor((to - from) / step) + 1)].map(
    (_, i) => from + i * step
  );
};

// This function puts the word in a random place on a circle
export const placeWordOnOuterCircle = (
  w: Rectangle,
  passRect: Rectangle[],
  weight: number[]
): Rectangle => {
  const maxWeight = Math.max(...weight);

  // Substract the max to each element to promote other interval
  const invertedWeight = weight.map((a) => maxWeight - a);

  // The cumulative weight allows to define intervals to select a random portion of circle to put our current rectangle, with
  // different probabilities (here we want to favour portions of the circle with less rectangles already put)
  const cumulativeWeight = cumulativeBins(invertedWeight);

  const randomInter = randomInterval(
    0,
    cumulativeWeight[cumulativeWeight.length - 1]
  );

  const inter = cumulativeWeight.findIndex((el) => el >= randomInter);

  // Add to weights the position that has just been drawn
  weight[inter] += 1;

  // Calculate the size of each intervals
  const ratio = 360 / NUMBER_OF_INTERVALS;

  // create the intervals
  const rangeInterval = rangeWithStep(0, 360, ratio);

  let angleInter;

  if (Number.isInteger(inter)) {
    angleInter = {
      x: rangeInterval[inter],
      y: rangeInterval[inter + 1] - 1,
    };
  } else {
    angleInter = { x: 0, y: 360 };
  }

  const angle = randomInterval(angleInter.x, angleInter.y);
  const circle = getTheCircle(passRect);
  const newPosition = {
    ...w,
    x: circle.radius * Math.cos(angle) + circle.x,
    y: circle.radius * Math.sin(angle) + circle.y,
  };
  return newPosition;
};

// This function allows to obtain the direction of movement of a rectangle in the direction of the rectangles already placed.
export const getMoveDirection = (
  pastWords: Rectangle[],
  currentWord: Rectangle
): Coordinate => {
  return pastWords.reduce(
    (acc, word) => {
      const differences = {
        x: word.x - currentWord.x,
        y: word.y - currentWord.y,
      };
      return { x: acc.x + differences.x, y: acc.y + differences.y };
    },
    { x: 0, y: 0 }
  );
};

// This function returns the futur position of a rectangle, without collision, in direction of already placed rectangles
export const futurPosition = (
  word: Rectangle,
  passRect: Rectangle[],
  step: number,
  weight: number[]
): Rectangle => {
  let isCollision = false;

  // Put the word in random place around the parent
  let movedWord = placeWordOnOuterCircle(word, passRect, weight);
  let iter = 0;
  let displacement = 0;
  do {
    const moveDirection = getMoveDirection(passRect, movedWord);
    const hypothenus = Math.sqrt(moveDirection.x ** 2 + moveDirection.y ** 2);
    const stepX = (step / hypothenus) * moveDirection.x;
    const stepY = (step / hypothenus) * moveDirection.y;
    const futurPosition: Rectangle = {
      ...movedWord,
      x: movedWord.x + (Math.abs(stepX) > 0.01 ? stepX : 0),
      y: movedWord.y + (Math.abs(stepY) > 0.01 ? stepY : 0),
    };

    // Test if the word can be move over the hypotenuse
    if (allCollision(futurPosition, passRect)) {
      const onlyMoveOverX = { ...futurPosition, y: movedWord.y };
      const onlyMoveOverY = { ...futurPosition, x: movedWord.x };
      const xColl = allCollision(onlyMoveOverX, passRect);
      const yColl = allCollision(onlyMoveOverY, passRect);
      if (xColl) {
        if (yColl) {
          // Do not move anymore
          isCollision = true;
        } else {
          movedWord = { ...onlyMoveOverY };
        }
      } else {
        movedWord = { ...onlyMoveOverX };
      }
    } else {
      movedWord = { ...futurPosition };
    }
    displacement = Math.abs(stepX) + Math.abs(stepY);
    iter++;
  } while (!isCollision && displacement > 2 && iter < 300);
  return movedWord;
};

// This function indicates whether rectangles are in a collision
export const areCentersTooClose = (
  centerA: Coordinate,
  centerB: Coordinate,
  minX: number,
  minY: number
): boolean =>
  Math.abs(centerA.x - centerB.x) < minX &&
  Math.abs(centerA.y - centerB.y) < minY;

// This function computes the collisions
export const allCollision = (word: Rectangle, passRect: Rectangle[]): boolean =>
  passRect
    .map((rect) =>
      areCentersTooClose(
        rect,
        word,
        (rect.width + word.width) / 2,
        (rect.height + word.height) / 2
      )
    )
    .some((t) => t === true);

// This function returns the bound of the word cloud
export const boundParent = (rects: Rectangle[]): Rectangle => {
  const topLeftPoints: Coordinate[] = rects.map((r) => ({
    x: r.x - r.width / 2,
    y: r.y - r.height / 2,
  }));
  const bottomRightPoints: Coordinate[] = rects.map((r) => ({
    x: r.x + r.width / 2,
    y: r.y + r.height / 2,
  }));

  const xMin = Math.min(...topLeftPoints.map((r) => r.x));
  const xMax = Math.max(...bottomRightPoints.map((r) => r.x));
  const yMin = Math.min(...topLeftPoints.map((r) => r.y));
  const yMax = Math.max(...bottomRightPoints.map((r) => r.y));

  return { x: xMin, y: yMin, width: xMax - xMin, height: yMax - yMin };
};

// This function gets the slide of the word cloud
export const getWordSlide = (
  parent: Rectangle,
  bound: Rectangle
): Coordinate => {
  const boundCentered: Rectangle = {
    x: bound.x + bound.width / 2,
    y: bound.y + bound.height / 2,
    width: bound.width,
    height: bound.height,
  };

  const differenceX = boundCentered.x - parent.x;
  const differenceY = boundCentered.y - parent.y;

  return { x: differenceX, y: differenceY };
};

// This function slides an array of rectangles
export const slideWords = (
  words: Rectangle[],
  slice: Coordinate
): Rectangle[] => {
  words.map((w) => {
    w.x = w.x + slice.x;
    w.y = w.y + slice.y;
  });

  return words;
};
