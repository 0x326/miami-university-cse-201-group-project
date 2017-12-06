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

});
