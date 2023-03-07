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

export const centerParent = (p: any) => {
  let xParent = 0;
  let yParent = 0;
  let wParent = 0;
  let hParent = 0;

  if (p) {
    xParent = p.getBoundingClientRect().x;
    yParent = p.getBoundingClientRect().y;
    wParent = p.getBoundingClientRect().width;
    hParent = p.getBoundingClientRect().height;

    const centerOfParentX = xParent + Math.floor(wParent / 2);
    const centerOfParentY = yParent + Math.floor(hParent / 2);

    return [centerOfParentX, centerOfParentY];
  }
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
