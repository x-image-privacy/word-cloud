import {
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
  CUT_OFF,
  DEFAULT_RECT,
  MARGIN_HEIGHT,
  MARGIN_WIDTH,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  NUMBER_OF_INTERVALS,
  WORD_CLOUD_MARGIN_HEIGHT,
  WORD_CLOUD_MARGIN_WIDTH,
} from "./constants";
import {CenterCoordinate, Circle, Coordinate, Rectangle, Word} from "./types";

// linear interpolation (https://math.stackexchange.com/questions/914823/shift-numbers-into-a-different-range)
export const computeFontSize = (coef: number, maxCoef: number, minCoef: number, minFontSize: number, maxFontSize: number): number => {
  const fontInterval = maxFontSize - minFontSize;
  const coefInterval = maxCoef - minCoef;

  return minFontSize + fontInterval / coefInterval * (coef - minCoef);
};

// This function returns the bound of the word cloud
export const boundParent = (rects: Rectangle[]): Rectangle => {
  const topLeftPoints: Coordinate[] = rects.map((r) => ({
    x: r.x,
    y: r.y,
  }));
  const bottomRightPoints: Coordinate[] = rects.map((r) => ({
    x: r.x + r.width,
    y: r.y + r.height,
  }));

  const xMin = Math.min(...topLeftPoints.map((r) => r.x));
  const xMax = Math.max(...bottomRightPoints.map((r) => r.x));
  const yMin = Math.min(...topLeftPoints.map((r) => r.y));
  const yMax = Math.max(...bottomRightPoints.map((r) => r.y));

  return {
    x: xMin,
    y: yMin,
    width: Math.abs(xMax - xMin),
    height: Math.abs(yMax - yMin),
  };
};

export const getBoundingWordCloud = (word: Word[]): Rectangle => {
  const rect = word.map((w) => w.rect);

  const tightBound = boundParent(rect);
  return {
    x: tightBound.x - WORD_CLOUD_MARGIN_WIDTH / 2,
    y: tightBound.y - WORD_CLOUD_MARGIN_HEIGHT / 2,
    width: tightBound.width + WORD_CLOUD_MARGIN_WIDTH,
    height: tightBound.height + WORD_CLOUD_MARGIN_HEIGHT,
  };
};

// This function indicates whether rectangles are in a collision
export const areCentersTooClose = (
  centerA: CenterCoordinate,
  centerB: CenterCoordinate,
  minX: number,
  minY: number
): boolean =>
  Math.abs(centerA.cx - centerB.cx) <= minX &&
  Math.abs(centerA.cy - centerB.cy) <= minY;

// This function computes the collisions
export const allCollision = (
  word: Rectangle,
  passRect: Rectangle[]
): boolean => {
  return passRect
    .map((rect) =>
      areCentersTooClose(
        {cx: rect.x + rect.width / 2, cy: rect.y + rect.height / 2},
        {cx: word.x + word.width / 2, cy: word.y + word.height / 2},
        (rect.width + word.width) / 2,
        (rect.height + word.height) / 2
      )
    )
    .some((t) => t === true);
};

// This function slides an array of words
export const slideWords = (words: Word[], sliding: Coordinate): Word[] => {
  return words.map((w) => ({
    ...w,
    rect: {
      ...w.rect,
      x: w.rect.x + sliding.x,
      y: w.rect.y + sliding.y,
    },
  }));
};

export function archimedeanSpiral(size: [number, number]) {
  // change the aspect of the spiral based on the ratio of width and height
  var e = size[0] / size[1];
  return function (t: number) {
    return [e * (t *= 0.5) * Math.cos(t), t * Math.sin(t)];
  };
}

export const futureSpiralPosition = (
  rectangle: Rectangle,
  placedRects: Rectangle[]
) => {
  let position = {
    ...rectangle,
    x: -rectangle.width / 2,
    y: -rectangle.height / 2,
  };
  let t = 0;
  const dt = Math.random() < 0.5 ? 1 : -1;
  while (allCollision(position, placedRects) && t < 3000) {
    // compute point on spiral
    const spiral = archimedeanSpiral([1, 1]);
    const [dx, dy] = spiral(t);
    position = {
      ...rectangle,
      x: rectangle.x + dx,
      y: rectangle.y + dy,
    };
    t += dt;
  }
  return position;
};

// **************************************
// not used anymore

// This function returns the futur position of a rectangle, without collision, in direction of already placed rectangles
export const futurPosition = (
  word: Rectangle,
  placedRects: Rectangle[],
  step: number,
  weight: number[]
): Rectangle => {
  let isDone = false;

  // Put the word in random place around the parent
  let movedRect = placeWordOnOuterCircle(word, placedRects, weight);
  let iter = 0;
  let displacement = 0;
  do {
    const moveDirection = getMoveDirection(placedRects, movedRect);
    const hypothenus = Math.sqrt(moveDirection.x ** 2 + moveDirection.y ** 2);
    const stepX = (step / hypothenus) * moveDirection.x;
    const stepY = (step / hypothenus) * moveDirection.y;
    const futurRectPosition: Rectangle = {
      ...movedRect,
      x: movedRect.x + stepX,
      y: movedRect.y + stepY,
    };
    // Test if the word can be move over the hypotenuse
    if (allCollision(futurRectPosition, placedRects)) {
      const onlyMoveOverX = {...futurRectPosition, y: movedRect.y};
      const onlyMoveOverY = {...futurRectPosition, x: movedRect.x};
      const xColl = allCollision(onlyMoveOverX, placedRects);
      const yColl = allCollision(onlyMoveOverY, placedRects);
      if (xColl) {
        if (yColl) {
          // Do not move anymore
          isDone = true;
        } else {
          movedRect = {...onlyMoveOverY};
        }
      } else {
        movedRect = {...onlyMoveOverX};
      }
    } else {
      movedRect = {...futurRectPosition};
    }
    displacement = Math.abs(stepX) + Math.abs(stepY);
    iter++;
  } while (!isDone && displacement > 2 && iter < 300);
  return movedRect;
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

// This function put the first word in the center of the parent rectangle
export const setFirstWordInCenterOfParent = (w: Word, p: string): Rectangle => {
  const parentElement = document.getElementsByTagName("svg").namedItem(p);
  const word = getBoundingRect(w.id);
  if (parentElement && word) {
    const parent = parentElement.getBBox();

    const newX = (parent.width - word.width) / 2;
    const newY = (parent.height - word.height) / 2;
    return {x: newX, y: newY, width: word.width, height: word.height};
  }
  return {x: 0, y: 0, width: 50, height: 20};
};

// This function return the distance between a rectangle and a cartesian coordinate
export const getDistance = (point: Coordinate, rect: Rectangle): number => {
  return Math.sqrt((point.x - rect.x) ** 2 + (point.y - rect.y) ** 2);
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
    {x: 0, y: 0}
  );
  centerMass.x /= passRect.length;
  centerMass.y /= passRect.length;

  return centerMass;
};

// This function computes the circle which centre is the center of mass of the rectangle list passed in argument and which radius is equal to the farthest point from the centre
export const getTheCircle = (passRect: Rectangle[]): Circle => {
  const centerMass = centerOfMass(passRect);

  const distance: number[] = passRect.map((rect) =>
    getDistance(centerMass, rect)
  );

  const radius = Math.max(
    ...distance,
    CONTAINER_HEIGHT / 2,
    CONTAINER_WIDTH / 2
  );

  return {x: centerMass.x, y: centerMass.y, radius};
};

// This function return a random float between min and max
export const randomInterval = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// This function puts the word in a random place on a circle
export const placeWordOnOuterCircle = (
  w: Rectangle,
  passRect: Rectangle[],
  weight: number[]
): Rectangle => {
  const maxWeight = Math.max(...weight);

  // Subtract the max to each element to promote other interval
  const invertedWeight = weight.map((a) => maxWeight - a);

  // The cumulative weight allows to define intervals to select a random portion of circle to put our current rectangle, with
  // different probabilities (here we want to favour portions of the circle with less rectangles already put)
  const cumulativeWeight = cumulativeBins(invertedWeight);

  const randomInter = randomInterval(
    0,
    cumulativeWeight[cumulativeWeight.length - 1]
  );

  // Calculate the size of each intervals
  const ratio = 360 / NUMBER_OF_INTERVALS;

  // create the intervals
  const rangeInterval = rangeWithStep(0, 360, ratio);

  const inter = cumulativeWeight.findIndex((el) => el >= randomInter);

  let angleInter;

  if (Number.isInteger(inter)) {
    // Add to weights the position that has just been drawn
    weight[inter] += 1;
    angleInter = {
      x: rangeInterval[inter],
      y: rangeInterval[inter + 1] - 1,
    };
  } else {
    angleInter = {x: 0, y: 360};
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
  currentRect: Rectangle
): Coordinate => {
  return pastWords.reduce(
    (acc, word) => {
      const differences = {
        x: word.x - currentRect.x,
        y: word.y - currentRect.y,
      };
      return {x: acc.x + differences.x, y: acc.y + differences.y};
    },
    {x: 0, y: 0}
  );
};

// This function returns the aera of a rectangle
export const getAreaRectangle = (rect: Rectangle): number => {
  return rect.height * rect.width;
};

// This function places the first word in the centre of the rectangle
export const placeFirstWord = (
  rectToPlace: Rectangle,
  centerX: number,
  centerY: number
): Rectangle => {
  const centeredRect = {
    width: rectToPlace.width,
    height: rectToPlace.height,
    x: centerX,
    y: centerY,
  };

  return centeredRect;
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
    width: bbox.width + MARGIN_WIDTH,
    height: bbox.height + MARGIN_HEIGHT,
  };
};

// This function returns the new position of a list of items
// export const getNewPositions = (
//   itemsToPlace: Word[],
//   centeredRect: Rectangle,
//   step: number
// ): Rectangle[] => {
//   // Initialize the weights with the value 1, of the size of the number of intervals
//   const weight = new Array(NUMBER_OF_INTERVALS).fill(1);

//   const newPositions = itemsToPlace.slice(1).reduce(
//     (placedItems, rect) => {
//       const futureItem = futurPosition(rect, placedItems, step, weight);
//       return [...placedItems, futureItem];
//     },
//     [centeredRect]
//   );

//   return newPositions;
// };
