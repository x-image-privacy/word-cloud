import {
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
  DEFAULT_RECT,
  INTERVAL,
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

export const getDistance = (point: Coordinate, word: Rectangle): number => {
  return Math.sqrt((point.x - word.x) ** 2 + (point.y - word.y) ** 2);
};

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

export const randomInterval = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};
export const cumulativeBins = (bin: number[]): number[] => {
  return bin.map(
    (
      (sum) => (value) =>
        (sum += value)
    )(0)
  );
};

// This function put the word in a random place
export const placeWordOnOuterCircle = (
  w: Rectangle,
  passRect: Rectangle[],
  weight: number[]
): Rectangle => {
  // Chose the parent face
  const cumulativeWeight = cumulativeBins(weight);

  const randomInter = randomInterval(
    0,
    cumulativeWeight[cumulativeWeight.length - 1]
  );
  const inter = cumulativeWeight.findIndex((el) => el >= randomInter);

  weight[inter] += 1;

  // substract the max to each element to promote other interval
  weight = weight.map((a) => Math.max(...weight) - a);

  let angleInter = { x: 0, y: 360 };

  if (inter === 0) {
    angleInter = INTERVAL.a;
  } else if (inter === 1) {
    angleInter = INTERVAL.b;
  } else if (inter === 2) {
    angleInter = INTERVAL.c;
  } else if (inter === 3) {
    angleInter = INTERVAL.d;
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
  step: number,
  weight: number[]
): Rectangle => {
  let isCollision = false;

  // put the word in random place around the parent
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
  } while (!isCollision && displacement > 2 && iter < 300);
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

// export const updateParent = (passRect: Rectangle[]) => {
//   const centerMass = centerOfMass(passRect);

//   rectParent.centerX = centerMass.x;
//   rectParent.centerY = centerMass.y;

//   const rectX = passRect.map((word) => word.x);
//   const maxX = Math.max(...rectX);
//   const minX = Math.min(...rectX);

//   const distanceMaxX = maxX - rectParent.centerX;
//   const distanceMinX = rectParent.centerX - minX;

//   if (distanceMaxX > distanceMinX && distanceMaxX > rectParent.width / 2) {
//     rectParent.width = rectParent.centerX + (distanceMaxX + 10);
//   } else if (
//     distanceMinX > distanceMaxX &&
//     distanceMinX > rectParent.width / 2
//   ) {
//     rectParent.width = rectParent.centerX + (distanceMinX + 10);
//   }

//   const rectY = passRect.map((word) => word.y);
//   const maxY = Math.max(...rectY);
//   const minY = Math.min(...rectY);

//   const distanceMaxY = maxY - rectParent.centerY;
//   const distanceMinY = rectParent.centerY - minY;

//   if (distanceMaxY > distanceMinY && distanceMaxY > rectParent.height / 2) {
//     rectParent.height = rectParent.centerY + (distanceMaxY + 10);
//   } else if (
//     distanceMinY > distanceMaxY &&
//     distanceMinY > rectParent.height / 2
//   ) {
//     rectParent.height = rectParent.centerY + (distanceMinY + 10);
//   }

//   return rectParent;

// rectParent.height = centerMass.y * coef;
// rectParent.width = centerMass.x * coef;

// if (
//   maxDistanceYBottom > rectParent.height &&
//   maxDistanceYBottom > maxDistanceXRight
// ) {
//   const coef = maxDistanceYBottom / rectParent.height;
//   rectParent.height *= coef;
//   rectParent.width *= coef;
// }

// if (
//   maxDistanceXRight > rectParent.width &&
//   maxDistanceXRight > maxDistanceYBottom
// ) {
//   const coef = maxDistanceXRight / rectParent.width;

//   rectParent.width *= coef;
//   rectParent.height *= coef;
// }
