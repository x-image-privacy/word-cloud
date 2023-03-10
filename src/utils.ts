export type Word = {
  id: string;
  text: string;
  x: number;
  y: number;
};

export type WordArray = Word[];

export type Coordinate = {
  x: number;
  y: number;
};

// This function put the first word in the center of the parent rectangle
export const setFirstWordInCenterOfParent = (w: Word, p: string) => {
  const parent = getCoordinateByID(p);
  const word = getCoordinateByID(w.id);

  w.x = Math.floor(parent.w / 2) - word.w / 2;
  w.y = Math.floor(parent.h / 2) - word.h / 2;

  return w;
};

// function that return the coordinate of the parent in an array
export const getCoordinateByID = (parent: string) => {
  const p = document.getElementById(parent);

  if (p) {
    const x = p.getBoundingClientRect().x;
    const y = p.getBoundingClientRect().y;
    const w = p.getBoundingClientRect().width;
    const h = p.getBoundingClientRect().height;

    return { x, y, w, h };
  }

  return { x: 0, y: 0, w: 0, h: 0 };
};

// This function return a random interger between two numbers
export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// This function put the word in a random place
export const putWordInRandomPositionOnParent = (w: Word, p: string) => {
  const parent = getCoordinateByID(p);

  // Chose the parent face
  const parentFace = randomIntFromInterval(1, 4);
  const xValue = randomIntFromInterval(0, parent.w);
  const yValue = randomIntFromInterval(0, parent.h);

  if (parentFace === 1) {
    w.x = xValue;
    w.y = 0;
  } else if (parentFace === 2) {
    w.x = 0;
    w.y = yValue;
  } else if (parentFace === 3) {
    w.x = xValue;
    w.y = parent.h;
  } else if (parentFace == 4) {
    w.x = parent.w;
    w.y = yValue;
  }

  return w;
};

export const centerOfObject = (word: Word, h: number, w: number): Word => {
  word.x += Math.floor(w / 2);
  word.y += Math.floor(h / 2);

  return word;
};

export const uncenteredWord = (word: Word, h: number, w: number): Word => {
  word.x -= Math.floor(w / 2);
  word.y -= Math.floor(h / 2);

  return word;
};

export const netForce = (w: Word, passRect: WordArray): Coordinate => {
  let diffX: number[] = [];
  let diffY: number[] = [];

  passRect.forEach((passW) => {
    diffX.push(passW.x - w.x);
    diffY.push(passW.y - w.y);
  });

  let sumDiffX = 0;
  let sumDiffY = 0;

  diffX.map((e) => (sumDiffX += e));
  diffY.map((e) => (sumDiffY += e));

  return { x: sumDiffX, y: sumDiffY };
};

export const getTriangleFromNetForce = (
  word: Word,
  netForce: Coordinate
): Coordinate => {
  const x = word.x;
  const y = netForce.y;

  return { x, y };
};

export const moveWordOnHypotenuse = (
  A: Coordinate, // adjacent - hypotenuse
  B: Coordinate, // hypotenuse - opposite
  C: Coordinate, // right angle
  step: number
) => {
  const lenghtHypontenus = distanceBetweenPoint(A, B);
  const distanceBC = distanceBetweenPoint(B, C);

  const angle = Math.asin(distanceBC / lenghtHypontenus) * (180 / Math.PI);

  const x = Math.floor(A.x + step * Math.cos(angle) * (180 / Math.PI));
  const y = Math.floor(A.y + step * Math.sin(angle) * (180 / Math.PI));

  return { x, y };
};

export const limiteOfParent = (word: Word, parent: string) => {
  const coordinateParent = getCoordinateByID(parent);
  const coordinateWord = getCoordinateByID(word.id);

  const unCenteredW = uncenteredWord(word, coordinateWord.h, coordinateWord.w);

  if (
    unCenteredW.x > coordinateParent.w ||
    unCenteredW.y > coordinateParent.w ||
    unCenteredW.x < 0 ||
    unCenteredW.y < 0
  ) {
    return 1;
  } else {
    return 0;
  }
};

export const futurPosition = (
  word: Word,
  passRect: WordArray,
  step: number,
  parent: string
) => {
  let isCollision = 0;

  while (!isCollision) {
    const netForceW = netForce(word, passRect);
    const rightAnglePoint = getTriangleFromNetForce(word, netForceW);

    const futurWPosition = moveWordOnHypotenuse(
      { x: word.x, y: word.y },
      netForceW,
      rightAnglePoint,
      step
    );

    // set the position
    let tmpW = word;
    let tmpWX = word;
    let tmpWY = word;

    tmpW.x = futurWPosition.x;
    tmpW.y = futurWPosition.y;

    tmpWX.x = futurWPosition.x;
    tmpWY.y = futurWPosition.y;

    // test if the word can be move over the hypotenuse
    isCollision = allCollision(tmpW, passRect);

    if (isCollision) {
      // test collision on x
      const isCollisionX = allCollision(tmpWX, passRect);
      const isCollisionY = allCollision(tmpWY, passRect);

      if (isCollisionX && isCollisionY) {
        return word;
      }

      if (!isCollisionX) {
        word.x = tmpWX.x;

        if (limiteOfParent(word, parent)) {
          return word;
        }
      }

      if (!isCollisionY) {
        word.y = tmpWY.y;
        if (limiteOfParent(word, parent)) {
          return word;
        }
      }
    } else {
      word = tmpW;
      if (limiteOfParent(word, parent)) {
        return word;
      }
    }
  }
  return word;
};

export const distanceBetweenWord = (w1: Word, w2: Word) => {
  return Math.sqrt(Math.pow(w2.x - w1.x, 2) + Math.pow(w2.y - w1.y, 2));
};

export const distanceBetweenPoint = (w1: Coordinate, w2: Coordinate) => {
  return Math.sqrt(Math.pow(w2.x - w1.x, 2) + Math.pow(w2.y - w1.y, 2));
};

export const collision = (w1: Word, w2: Word) => {
  const positionW1 = getCoordinateByID(w1.id);
  const positionW2 = getCoordinateByID(w2.id);

  w1 = uncenteredWord(w1, positionW1.w, positionW1.h);
  w2 = uncenteredWord(w2, positionW2.w, positionW2.h);

  if (
    w1.x < w2.x + positionW2.w &&
    w1.x + positionW1.w > w2.x &&
    w1.y < w2.y + positionW2.h &&
    positionW1.h + w1.y > w2.y
  ) {
    return 1;
  } else {
    return 0;
  }
};

export const allCollision = (word: Word, passRect: WordArray): any => {
  passRect.forEach((w: Word) => {
    if (word.id !== w.id) {
      if (collision(word, w)) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  });
};
