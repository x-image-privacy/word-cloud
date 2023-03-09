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

  w.x = parent.x + Math.floor(parent.w / 2);
  w.y = parent.y + Math.floor(parent.h / 2);

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
  const lenghtHypontenus = Math.sqrt(
    Math.pow(netForce.x - word.x, 2) + Math.pow(netForce.y - word.y, 2)
  );

  const deltaX =
    ((netForce.y - word.y) * lenghtHypontenus) / (2 * lenghtHypontenus);
  const deltaY =
    ((netForce.x - word.x) * lenghtHypontenus) / (2 * lenghtHypontenus);

  const midPointX = (word.x + netForce.x) / 2;
  const midPointY = (word.y + netForce.y) / 2;

  const x = midPointX + deltaX / 2;
  const y = midPointY - deltaY / 2;

  return { x, y };
};

export const moveOnHypotenus = (
  A: Coordinate, // adjacent - hypotenuse
  B: Coordinate, // hypotenuse - opposite
  C: Coordinate, // right angle
  step: number
) => {
  const lenghtHypontenus = distanceBetweenPoint(A, B);

  const distanceCA =
    ((A.x - C.x) * (B.x - A.x) + (A.y - C.y) * (B.y - A.y)) / lenghtHypontenus;

  const x = A.x + (step * (B.x - A.x)) / lenghtHypontenus;
  const y = A.y + (step * (B.y - A.y)) / lenghtHypontenus;

  return { x, y };
};

export const futurPosition = (
  word: Word,
  passRect: WordArray,
  step: number
) => {
  let isCollision = 0;

  while (!isCollision) {
    const netForceW = netForce(word, passRect);

    const rightAnglePoint = getTriangleFromNetForce(word, netForceW);

    const tmpWPosition = moveOnHypotenus(
      { x: word.x, y: word.y },
      netForceW,
      rightAnglePoint,
      step
    );

    // set the position
    const tmpW = word;
    let tmpWX = word;
    let tmpWY = word;

    tmpW.x = tmpWPosition.x;
    tmpW.y = tmpWPosition.y;

    tmpWX.x = tmpWPosition.x;
    tmpWY.y = tmpWPosition.y;

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
      }

      if (!isCollisionY) {
        word.y = tmpWY.y;
      }
    } else {
      word = tmpW;
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
  w2 = uncenteredWord(w2, positionW1.w, positionW1.h);

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
  passRect.forEach((w: { id: string; text: string; x: number; y: number }) => {
    if (word.id !== w.id) {
      if (collision(word, w)) {
        return 1;
      } else {
        return 0;
      }
    }
    return 0;
  });
};
