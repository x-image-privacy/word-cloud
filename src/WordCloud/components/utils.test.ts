import { describe, expect, it } from 'vitest';

import { CONTAINER_WIDTH } from './constants';
import { Coordinate, Rectangle } from './types';
import {
  allCollision,
  areCentersTooClose,
  boundParent,
  cumulativeBins,
  getAreaRectangle,
  getDistance,
  getMoveDirection,
  getTheCircle,
  placeFirstWord,
  randomInterval,
  rangeWithStep,
  slideWords,
} from './utils';

const origin: Coordinate = {
  x: 0,
  y: 0,
};

const originRectangle: Rectangle = {
  x: 0,
  y: 0,
  width: 1,
  height: 1,
};

const rectangle: Rectangle = {
  x: 1,
  y: 0,
  width: 10,
  height: 5,
};

describe('areCentersTooClose', () => {
  it('No collisions', () => {
    expect(
      areCentersTooClose({ cx: 0, cy: 2 }, { cx: -5.5, cy: -3 }, 6.5, 4),
    ).toBe(false);
    expect(areCentersTooClose({ cx: 0, cy: 0 }, { cx: 6, cy: 0 }, 2, 2)).toBe(
      false,
    );
    expect(areCentersTooClose({ cx: 0, cy: 0 }, { cx: 0, cy: 6 }, 2, 2)).toBe(
      false,
    );
    expect(areCentersTooClose({ cx: 0, cy: 6 }, { cx: 0, cy: 0 }, 2, 2)).toBe(
      false,
    );
  });
  it('Collisions in X', () => {
    expect(areCentersTooClose({ cx: 0, cy: 0 }, { cx: 2, cy: 0 }, 3, 2)).toBe(
      true,
    );
    expect(areCentersTooClose({ cx: 0, cy: 0 }, { cx: 2, cy: 0 }, 2.1, 2)).toBe(
      true,
    );
    expect(areCentersTooClose({ cx: 2, cy: 0 }, { cx: 0, cy: 0 }, 2.1, 2)).toBe(
      true,
    );
  });
  it('Collisions in Y', () => {
    expect(areCentersTooClose({ cx: 0, cy: 0 }, { cx: 0, cy: 2 }, 2, 3)).toBe(
      true,
    );
    expect(areCentersTooClose({ cx: 0, cy: 0 }, { cx: 0, cy: 2 }, 2, 2.1)).toBe(
      true,
    );
    expect(areCentersTooClose({ cx: 0, cy: 2 }, { cx: 0, cy: 0 }, 2, 2.1)).toBe(
      true,
    );
  });
  it('Collisions in X and Y', () => {
    expect(
      areCentersTooClose({ cx: 0, cy: 0 }, { cx: 2, cy: 2 }, 2.5, 2.5),
    ).toBe(true);
    expect(
      areCentersTooClose({ cx: 0, cy: 0 }, { cx: -2, cy: -2 }, 2.5, 2.5),
    ).toBe(true);
    expect(
      areCentersTooClose({ cx: -2, cy: -2 }, { cx: 0, cy: 0 }, 2.5, 2.5),
    ).toBe(true);
  });
});

describe('Get move direction', () => {
  it('1 rectangle', () => {
    expect(
      getMoveDirection([{ x: 4, y: 6, width: 4, height: 4 }], {
        x: 3,
        y: 4,
        width: 3,
        height: 3,
      }),
    ).toEqual({ x: 1, y: 2 });
  });

  it('2 rectangles', () => {
    expect(
      getMoveDirection(
        [
          { x: 4, y: 6, width: 4, height: 4 },
          { x: 8, y: 5, width: 7, height: 7 },
        ],
        { x: 3, y: 4, width: 3, height: 3 },
      ),
    ).toEqual({
      x: 6,
      y: 3,
    });
  });

  it('Negative coordinate', () => {
    expect(
      getMoveDirection([{ x: -4, y: -6, width: 4, height: 4 }], {
        x: 3,
        y: -4,
        width: 3,
        height: 3,
      }),
    ).toEqual({
      x: -7,
      y: -2,
    });
  });

  it('Same coordinate', () => {
    expect(
      getMoveDirection([{ x: 0, y: 0, width: 4, height: 4 }], {
        x: 0,
        y: 0,
        width: 3,
        height: 3,
      }),
    ).toEqual({
      x: 0,
      y: 0,
    });
  });
});

describe('All collision', () => {
  it('Collision with self', () => {
    expect(allCollision(originRectangle, [originRectangle])).toBe(true);
  });

  it('No collision with 2 rectangles', () => {
    expect(
      allCollision(originRectangle, [{ x: 4, y: 4, width: 2, height: 2 }]),
    ).toBe(false);
  });

  it('Collision with 2 rectangles', () => {
    expect(
      allCollision(originRectangle, [
        { x: 2, y: 2, width: 4, height: 4 },
        { x: 6, y: 6, width: 2, height: 2 },
      ]),
    ).toBe(false);
    expect(
      allCollision({ x: 1.1, y: 1.1, width: 1, height: 1 }, [
        { x: 2, y: 2, width: 4, height: 4 },
        { x: 6, y: 6, width: 2, height: 2 },
      ]),
    ).toBe(true);
    expect(
      allCollision({ x: 5.9, y: 5.9, width: 1, height: 1 }, [
        { x: 2, y: 2, width: 4, height: 4 },
        { x: 6, y: 6, width: 2, height: 2 },
      ]),
    ).toBe(true);
    expect(
      allCollision({ x: 5.9, y: 4, width: 1, height: 1 }, [
        { x: 2, y: 2, width: 4, height: 4 },
        { x: 6, y: 6, width: 2, height: 2 },
      ]),
    ).toBe(true);
    expect(
      allCollision({ x: 4, y: 5.9, width: 1, height: 1 }, [
        { x: 2, y: 2, width: 4, height: 4 },
        { x: 6, y: 6, width: 2, height: 2 },
      ]),
    ).toBe(true);
  });
});

describe('Get distance', () => {
  it('Naive test', () => {
    expect(
      getDistance({ x: 1, y: 1 }, { x: 1, y: 1, width: 4, height: 4 }),
    ).toEqual(0);
  });

  it('Naive test', () => {
    expect(
      getDistance({ x: 10, y: 5 }, { x: 1, y: 5, width: 4, height: 4 }),
    ).toEqual(9);
  });
});

describe('Get the circle', () => {
  it('Center of mass one word', () => {
    expect(getTheCircle([{ x: 1, y: 1, width: 4, height: 4 }])).toEqual({
      x: 1,
      y: 1,
      radius: CONTAINER_WIDTH / 2,
    });
  });

  it('Center of mass multiple words', () => {
    expect(
      getTheCircle([
        { x: 1, y: 1, width: 4, height: 4 },
        { x: 3, y: 4, width: 4, height: 4 },
        { x: 2, y: 2, width: 4, height: 4 },
        { x: -2, y: 1, width: 4, height: 4 },
      ]),
    ).toEqual({
      x: 1,
      y: 2,
      radius: CONTAINER_WIDTH / 2,
    });
  });

  it('Center of mass update radius', () => {
    expect(
      getTheCircle([
        { x: 0, y: 0, width: 4, height: 4 },
        { x: 800, y: 0, width: 4, height: 4 },
      ]),
    ).toEqual({
      x: 400,
      y: 0,
      radius: 400,
    });
  });
});

describe('Random interval', () => {
  it('Less than or equal of max of interval', () => {
    expect(randomInterval(1, 4)).toBeLessThanOrEqual(4);
  });
  it('Greater than or equal of min of interval', () => {
    expect(randomInterval(1, 4)).toBeGreaterThanOrEqual(1);
  });
});

describe('CumulativeBins', () => {
  it('With same value', () => {
    expect(cumulativeBins([1, 1, 1, 1])).toEqual([1, 2, 3, 4]);
  });

  it('With different value', () => {
    expect(cumulativeBins([4, 2, 1, 3])).toEqual([4, 6, 7, 10]);
  });

  it('With negative value', () => {
    expect(cumulativeBins([4, -2, 1, 3])).toEqual([4, 2, 3, 6]);
  });
});

describe('slideWords', () => {
  describe('Slide one word', () => {
    it('No move', () => {
      expect(
        slideWords(
          [
            {
              id: '1',
              text: '1',
              coef: 0.5,
              rect: originRectangle,
            },
          ],
          { x: 0, y: 0 },
        ),
      ).toEqual([
        {
          id: '1',
          text: '1',
          coef: 0.5,
          rect: originRectangle,
        },
      ]);
    });
    it('On one direction', () => {
      expect(
        slideWords(
          [
            {
              id: '1',
              text: '1',
              coef: 0.5,
              rect: { x: 0, y: 0, width: 1, height: 1 },
            },
          ],
          { x: 0, y: 2 },
        ),
      ).toEqual([
        {
          id: '1',
          text: '1',
          coef: 0.5,
          rect: { x: 0, y: 2, width: 1, height: 1 },
        },
      ]);
      expect(
        slideWords(
          [
            {
              id: '1',
              text: '1',
              coef: 0.5,
              rect: { x: 1, y: 4, width: 4, height: 4 },
            },
          ],
          { x: 0, y: -2 },
        ),
      ).toEqual([
        {
          id: '1',
          text: '1',
          coef: 0.5,
          rect: { x: 1, y: 2, width: 4, height: 4 },
        },
      ]);
      expect(
        slideWords(
          [
            {
              id: '1',
              text: '1',
              coef: 0.5,
              rect: { x: 2, y: 0, width: 1, height: 1 },
            },
          ],
          { x: 2, y: 0 },
        ),
      ).toEqual([
        {
          id: '1',
          text: '1',
          coef: 0.5,
          rect: { x: 4, y: 0, width: 1, height: 1 },
        },
      ]);
      expect(
        slideWords(
          [
            {
              id: '1',
              text: '1',
              coef: 0.5,
              rect: { x: 2, y: 0, width: 1, height: 1 },
            },
          ],
          { x: -2, y: 0 },
        ),
      ).toEqual([
        {
          id: '1',
          text: '1',
          coef: 0.5,
          rect: { x: 0, y: 0, width: 1, height: 1 },
        },
      ]);
    });

    it('On multiple direction', () => {
      expect(
        slideWords(
          [
            {
              id: '1',
              text: '1',
              coef: 0.5,
              rect: { x: 2, y: 0, width: 1, height: 1 },
            },
          ],
          { x: 2, y: 4 },
        ),
      ).toEqual([
        {
          id: '1',
          text: '1',
          coef: 0.5,
          rect: { x: 4, y: 4, width: 1, height: 1 },
        },
      ]);
      expect(
        slideWords(
          [
            {
              id: '1',
              text: '1',
              coef: 0.5,
              rect: { x: 2, y: 4, width: 1, height: 1 },
            },
          ],
          { x: -2, y: -2 },
        ),
      ).toEqual([
        {
          id: '1',
          text: '1',
          coef: 0.5,
          rect: { x: 0, y: 2, width: 1, height: 1 },
        },
      ]);
      expect(
        slideWords(
          [
            {
              id: '1',
              text: '1',
              coef: 0.5,
              rect: { x: 2, y: 0, width: 1, height: 1 },
            },
          ],
          { x: -1, y: 4 },
        ),
      ).toEqual([
        {
          id: '1',
          text: '1',
          coef: 0.5,
          rect: { x: 1, y: 4, width: 1, height: 1 },
        },
      ]);
    });
  });

  describe('Slide multiple word', () => {
    it('On the bottom and right', () => {
      expect(
        slideWords(
          [
            {
              id: '1',
              text: '1',
              coef: 0.5,
              rect: { x: 1, y: 4, width: 4, height: 4 },
            },
            {
              id: '2',
              text: '2',
              coef: 0.5,
              rect: { x: 6, y: 9, width: 4, height: 4 },
            },
          ],
          { x: 1, y: 2 },
        ),
      ).toEqual([
        {
          id: '1',
          text: '1',
          coef: 0.5,
          rect: { x: 2, y: 6, width: 4, height: 4 },
        },
        {
          id: '2',
          text: '2',
          coef: 0.5,
          rect: { x: 7, y: 11, width: 4, height: 4 },
        },
      ]);
      expect(
        slideWords(
          [
            {
              id: '1',
              text: '1',
              coef: 0.5,
              rect: { x: 1, y: 4, width: 4, height: 4 },
            },
            {
              id: '2',
              text: '2',
              coef: 0.5,
              rect: { x: 6, y: 9, width: 4, height: 4 },
            },
          ],
          { x: -1, y: -2 },
        ),
      ).toEqual([
        {
          id: '1',
          text: '1',
          coef: 0.5,
          rect: { x: 0, y: 2, width: 4, height: 4 },
        },
        {
          id: '2',
          text: '2',
          coef: 0.5,
          rect: { x: 5, y: 7, width: 4, height: 4 },
        },
      ]);
    });
  });
});

describe('BoundParent', () => {
  it('With one rectangle', () => {
    expect(boundParent([{ x: 2, y: 2, width: 2, height: 2 }])).toEqual({
      x: 2,
      y: 2,
      width: 2,
      height: 2,
    });
  });
  it('With two rectangles', () => {
    expect(
      boundParent([
        { x: 7, y: 8, width: 4, height: 4 },
        { x: 3, y: 5, width: 4, height: 4 },
      ]),
    ).toEqual({ x: 3, y: 5, width: 8, height: 7 });
  });
  it('no negative widths', () => {
    expect(
      boundParent([
        { x: -4, y: -10, width: 4, height: 4 },
        { x: -2, y: -12, width: 1, height: 4 },
      ]),
    ).toEqual({ x: -4, y: -12, width: 4, height: 6 });
  });
});

describe('Range with step', () => {
  it('Start equal to end', () => {
    expect(rangeWithStep(1, 1, 2)).toEqual([1]);
  });
  it('End bigger than start', () => {
    expect(rangeWithStep(4, 1, 2)).toEqual([]);
  });
  it('No step', () => {
    expect(rangeWithStep(0, 10, 1)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
  it('Step of 2', () => {
    expect(rangeWithStep(0, 9, 2)).toEqual([0, 2, 4, 6, 8]);
  });
});

describe('Get area rectangle', () => {
  it('Get area', () => {
    expect(getAreaRectangle(rectangle)).toEqual(50);
  });
});

describe('Place first item', () => {
  it('Put in centre', () => {
    expect(placeFirstWord(rectangle, 0, 0)).toEqual({
      x: 0,
      y: 0,
      width: 10,
      height: 5,
    });
  });
});
