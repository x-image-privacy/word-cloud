import {
  CENTER_X,
  CENTER_Y,
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
  DEFAULT_RECT,
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

export const getArea = (rect: Rectangle): number => rect.width * rect.height;

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

// This function put the word in a random place
export const placeWordOnOuterCircle = (w: Rectangle) => {
  // Chose the parent face
  const angle = Math.random() * 360;
  const radius = Math.max(CONTAINER_HEIGHT, CONTAINER_WIDTH) / 2;
  console.log(angle);
  const newPosition = {
    ...w,
    x: radius * Math.cos(angle) + CENTER_X,
    y: radius * Math.sin(angle) + CENTER_Y,
  };
  return newPosition;
};

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

export const futurPosition = (
  word: Rectangle,
  passRect: Rectangle[],
  step: number
) => {
  let isCollision = false;
  let movedWord: Rectangle = {
    x: word.x,
    y: word.y,
    width: word.width,
    height: word.height,
  };
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

    // test if the word can be move over the hypotenuse
    if (allCollision(futurPosition, passRect)) {
      const onlyMoveOverX = { ...futurPosition, y: movedWord.y };
      const onlyMoveOverY = { ...futurPosition, x: movedWord.x };
      const xColl = allCollision(onlyMoveOverX, passRect);
      const yColl = allCollision(onlyMoveOverY, passRect);
      if (xColl) {
        if (yColl) {
          // do not move anymore
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
  } while (!isCollision && displacement > 2 && iter < 600);
  console.log(isCollision, displacement, iter);

  return movedWord;
};

export const areCentersTooClose = (
  centerA: Coordinate,
  centerB: Coordinate,
  minX: number,
  minY: number
): boolean =>
  Math.abs(centerA.x - centerB.x) < minX &&
  Math.abs(centerA.y - centerB.y) < minY;

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

// export const distanceBetweenWord = (w1: Word, w2: Word) => {
//   return Math.sqrt(Math.pow(w2.x - w1.x, 2) + Math.pow(w2.y - w1.y, 2));
// };

// export const distanceBetweenPoint = (w1: Coordinate, w2: Coordinate) => {
//   return Math.sqrt(Math.pow(w2.x - w1.x, 2) + Math.pow(w2.y - w1.y, 2));
// };

// export const collision = (w1: Rectangle, w2: Rectangle) => {
//   if (
//     w1.x < w2.x + 2.w &&
//     w1.x + positionW1.w > w2.x &&
//     w1.y < w2.y + positionW2.h &&
//     positionW1.h + w1.y > w2.y
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// };

// export const uncenteredWord = (
//   word: Rectangle,
//   h: number,
//   w: number
// ): Rectangle => {
//   word.x -= Math.floor(w / 2);
//   word.y -= Math.floor(h / 2);

//   return word;
// };

// export const netForce = (w: Rectangle, passRect: Rectangle[]): Coordinate => {
//   let diffX: number[] = [];
//   let diffY: number[] = [];

//   passRect.forEach((passW) => {
//     diffX.push(passW.x - w.x);
//     diffY.push(passW.y - w.y);
//   });

//   let sumDiffX = 0;
//   let sumDiffY = 0;

//   diffX.map((e) => (sumDiffX += e));
//   diffY.map((e) => (sumDiffY += e));

//   return { x: sumDiffX, y: sumDiffY };
// };

// export const getTriangleFromNetForce = (
//   word: Rectangle,
//   netForce: Coordinate
// ): Coordinate => {
//   const x = word.x;
//   const y = netForce.y;

//   return { x, y };
// };

// export const moveWordOnHypotenuse = (
//   A: Coordinate, // adjacent - hypotenuse
//   B: Coordinate, // hypotenuse - opposite
//   C: Coordinate, // right angle
//   step: number
// ) => {
//   const lenghtHypontenus = distanceBetweenPoint(A, B);
//   const distanceBC = distanceBetweenPoint(B, C);

//   const angle = Math.asin(distanceBC / lenghtHypontenus) * (180 / Math.PI);

//   const x = Math.floor(A.x + step * Math.cos(angle) * (180 / Math.PI));
//   const y = Math.floor(A.y + step * Math.sin(angle) * (180 / Math.PI));

//   return { x, y };
// };

// export const limiteOfParent = (word: Word, parent: string) => {
//   const coordinateParent = getCoordinateByID(parent);
//   const coordinateWord = getCoordinateByID(word.id);

//   const unCenteredW = uncenteredWord(word, coordinateWord.h, coordinateWord.w);

//   if (
//     unCenteredW.x > coordinateParent.w ||
//     unCenteredW.y > coordinateParent.w ||
//     unCenteredW.x < 0 ||
//     unCenteredW.y < 0
//   ) {
//     return 1;
//   } else {
//     return 0;
//   }
// };
