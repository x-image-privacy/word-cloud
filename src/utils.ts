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

export const distance = (
  w1: { id: string; text: string; x: number; y: number },
  w2: { id: string; text: string; x: number; y: number }
) => {
  return Math.sqrt(Math.pow(w2.x - w1.x, 2) + Math.pow(w2.y - w1.y, 2));
};

export const allCollision = (
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

export const collision = (
  w1: { id: string; text: string; x: number; y: number },
  w2: { id: string; text: string; x: number; y: number },
  w1H: number,
  w1W: number,
  w2H: number,
  w2W: number
) => {
  if (
    w1.x < w2.x + w2W &&
    w1.x + w1W > w2.x &&
    w1.y < w2.y + w2H &&
    w1H + w1.y > w2.y
  ) {
    console.log("collision");
    return true;
  } else {
    console.log("No collision");
    return false;
  }
};
