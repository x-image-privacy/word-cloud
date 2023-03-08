// This function put the first word in the center of the parent rectangle
export const setFirstWordInCenterOfParent = (
  w: {
    id: string;
    text: string;
    x: number;
    y: number;
  },
  p: string
) => {
  const centerOfParent = centerParent(p);

  w.x = centerOfParent[0];
  w.y = centerOfParent[1];

  return w;
};

// function that return the coordinate of the parent in an array
export const getCoordinateOfParent = (parent: string) => {
  let xParent = 0;
  let yParent = 0;
  let wParent = 0;
  let hParent = 0;

  const p = document.getElementById(parent);

  if (p) {
    xParent = p.getBoundingClientRect().x;
    yParent = p.getBoundingClientRect().y;
    wParent = p.getBoundingClientRect().width;
    hParent = p.getBoundingClientRect().height;
  }

  return [xParent, yParent, wParent, hParent];
};

// function that calculate the center of the parent
export const centerParent = (p: string) => {
  const parent = getCoordinateOfParent(p);

  const centerOfParentX = parent[0] + Math.floor(parent[2] / 2);
  const centerOfParentY = parent[1] + Math.floor(parent[3] / 2);

  return [centerOfParentX, centerOfParentY];
};

// This function return a random interger between two numbers
export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// This function put the word in a random place
export const putWordInRandomPositionOnParent = (
  w: {
    id: string;
    text: string;
    x: number;
    y: number;
  },
  p: string
) => {
  const parent = getCoordinateOfParent(p);
  const xParent = parent[0];
  const yParent = parent[1];
  const wParent = parent[2];
  const hParent = parent[3];

  // Chose the parent face
  const parentFace = randomIntFromInterval(1, 4);
  const xValue = randomIntFromInterval(0, xParent + wParent);
  const yValue = randomIntFromInterval(0, yParent + hParent);

  // ([0, x + w], 0)
  if (parentFace === 1) {
    w.x = xValue;
    w.y = 0;

    // (0, [0, y + h])
  } else if (parentFace === 2) {
    w.x = 0;
    w.y = yValue;
    // ([0, x + w], y + h)
  } else if (parentFace === 3) {
    w.x = xValue;
    w.y = yParent + hParent;
    // (x + w, [0, y + h])
  } else if (parentFace == 4) {
    w.x = xParent + wParent;
    w.y = yValue;
  }

  return w;
};

export const centerWord = (
  rect: {
    id: string;
    text: string;
    x: number;
    y: number;
  },
  h: number,
  w: number
) => {
  let x = rect.x + Math.floor(w / 2);
  let y = rect.y + Math.floor(h / 2);

  return [x, y];
};

export const netForce = (
  w: {
    id: string;
    text: string;
    x: number;
    y: number;
  },
  passRect: {
    id: string;
    text: string;
    x: number;
    y: number;
  }[]
) => {
  let diffX: number[] = [];
  let diffY: number[] = [];
  passRect.forEach((passW) => {
    const x = passW.x - w.x;
    const y = passW.y - w.y;

    diffX.push(x);
    diffY.push(y);
  });

  let sumDiffX = 0;
  let sumDiffY = 0;

  diffX.map((e) => (sumDiffX += e));
  diffY.map((e) => (sumDiffY += e));

  return [sumDiffX, sumDiffY];
};

export const getTriangleFromNetForce = (
  word: {
    id: string;
    text: string;
    x: number;
    y: number;
  },
  netForce: [number, number]
) => {
  const lenghtHypontenus = Math.sqrt(
    Math.pow(netForce[0] - word.x, 2) + Math.pow(netForce[1] - word.y, 2)
  );

  const deltaX =
    ((netForce[1] - word.y) * lenghtHypontenus) / (2 * lenghtHypontenus);
  const deltaY =
    ((netForce[0] - word.x) * lenghtHypontenus) / (2 * lenghtHypontenus);

  const midPointX = (word.x + netForce[0]) / 2;
  const midPointY = (word.y + netForce[1]) / 2;

  const rightTriangleVertexX = midPointX + deltaX / 2;
  const rightTriangleVertexY = midPointY + deltaY / 2;

  return [rightTriangleVertexX, rightTriangleVertexY];
};

export const moveOnHypotenus = (
  A: [x: number, y: number], // adjacent - hypotenuse
  B: [x: number, y: number], // hypotenuse - opposite
  C: [x: number, y: number], // right angle
  step: number
) => {
  const lenghtHypontenus = distanceBetweenPoint(A, B);

  const distanceCA =
    ((A[0] - C[0]) * (B[0] - A[0]) + (A[1] - C[1]) * (B[1] - A[1])) /
    lenghtHypontenus;

  const newX = A[0] + (step * (B[0] - A[0])) / lenghtHypontenus;
  const newY = A[1] + (step * (B[1] - A[1])) / lenghtHypontenus;

  return [newX, newY];
};

export const futurPosition = (
  word: {
    id: string;
    text: string;
    x: number;
    y: number;
  },
  passRect: {
    id: string;
    text: string;
    x: number;
    y: number;
  }[],
  step: number,
  w1H: number,
  w1W: number,
  w2H: number,
  w2W: number
) => {
  let isCollision = 1;
  let netForceW;
  let rightAnglePoint;

  let tmpWPosition = [word.x, word.y];
  let tmpW = word;

  while (isCollision) {
    netForceW = netForce(word, passRect);

    rightAnglePoint = getTriangleFromNetForce(word, netForceW);

    tmpWPosition = moveOnHypotenus(
      tmpWPosition,
      netForceW,
      rightAnglePoint,
      step
    );

    tmpW.x = tmpWPosition[0];
    tmpW.y = tmpWPosition[1];

    isCollision = allCollision(word, passRect);
  }
};

export const distanceBetweenWord = (
  w1: { id: string; text: string; x: number; y: number },
  w2: { id: string; text: string; x: number; y: number }
) => {
  return Math.sqrt(Math.pow(w2.x - w1.x, 2) + Math.pow(w2.y - w1.y, 2));
};

export const distanceBetweenPoint = (
  w1: [x: number, y: number],
  w2: [x: number, y: number]
) => {
  return Math.sqrt(Math.pow(w2[0] - w1[0], 2) + Math.pow(w2[1] - w1[1], 2));
};

export const collision = (
  w1: { id: string; text: string; x: number; y: number },
  w2: { id: string; text: string; x: number; y: number }
) => {
  const positionW1 = getCoordinateOfParent(w1.id);
  const positionW2 = getCoordinateOfParent(w2.id);
  if (
    w1.x < w2.x + positionW2[2] &&
    w1.x + positionW1[2] > w2.x &&
    w1.y < w2.y + positionW2[3] &&
    positionW1[3] + w1.y > w2.y
  ) {
    console.log("collision");
    return 1;
  } else {
    console.log("No collision");
    return 0;
  }
};

export const allCollision = (
  word: { id: string; text: string; x: number; y: number },
  wordArray: any[]
): any => {
  wordArray.forEach((w: { id: string; text: string; x: number; y: number }) => {
    if (word.id !== w.id) {
      if (collision(word, w)) {
        console.log("collision");
        return 1;
      } else {
        console.log("No collision");

        return 0;
      }
    }
    return 0;
  });
};
