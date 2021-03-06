import { computeDirection, isPointOnLine } from './lib';
import { Direction } from './MovableEntity';

describe('computeDirection', () => {

  it('works for orthgonal points', () => {
    expect(computeDirection([0, 0], [0, 1])).toBe(Direction.South);
    expect(computeDirection([0, 0], [0, -1])).toBe(Direction.North);
    expect(computeDirection([0, 0], [1, 0])).toBe(Direction.East);
    expect(computeDirection([0, 0], [-1, 0])).toBe(Direction.West);

    expect(computeDirection([0, 1], [0, 0])).toBe(Direction.North);
    expect(computeDirection([0, -1], [0, 0])).toBe(Direction.South);
    expect(computeDirection([1, 0], [0, 0])).toBe(Direction.West);
    expect(computeDirection([-1, 0], [0, 0])).toBe(Direction.East);
  });

  it('works for slightly-off points', () => {
    expect(computeDirection([0, 0], [1, 100])).toBe(Direction.South);
    expect(computeDirection([0, 0], [1, -100])).toBe(Direction.North);
    expect(computeDirection([0, 0], [100, 1])).toBe(Direction.East);
    expect(computeDirection([0, 0], [-100, 1])).toBe(Direction.West);

    expect(computeDirection([1, 100], [0, 0])).toBe(Direction.North);
    expect(computeDirection([1, -100], [0, 0])).toBe(Direction.South);
    expect(computeDirection([100, 1], [0, 0])).toBe(Direction.West);
    expect(computeDirection([-100, 1], [0, 0])).toBe(Direction.East);
  });

  it('works for real data', () => {
    expect(computeDirection([14, 31], [14, 15])).toBe(Direction.North);
  });

});

describe('isPointOnLine', () => {

  it('works for simple examples', () => {
    expect(isPointOnLine([2, 2], [1, 1], [3, 3])).toBe(true);
    expect(isPointOnLine([1, 1], [2, 2], [3, 3])).toBe(true);
    expect(isPointOnLine([0, 0], [2, 1], [4, 2])).toBe(true);
  });

  it('works for real data', () => {
    expect(isPointOnLine([15, 19], [15, 21], [15, 19])).toBe(true);
  });

});
