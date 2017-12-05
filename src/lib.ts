import { Direction } from './MovableEntity';

function createMultiDimensionalArray(dimensionSizes: number[]) {
  return _createMultiDimensionalArray(dimensionSizes.reverse(), []);
}

function _createMultiDimensionalArray(dimensionSizes: number[], position: number[]) {
  if (dimensionSizes.length === 1) {
    let size = dimensionSizes[0];
    let array = new Array(size);
    return array;
  } else {
    let array = new Array(dimensionSizes.pop());
    for (let i = 0; i < array.length; i++) {
      array[i] = _createMultiDimensionalArray(dimensionSizes, position.concat(i));
    }
    return array;
  }
}

function initializeMutliDimensionalArray<T>(array: Array<any>, initializer: (position: number[]) => T, position: number[] = []) {
  for (let index = 0; index < array.length; index++) {
    if (index === NaN) {
      continue;
    } else if (array[index] instanceof Array) {
      initializeMutliDimensionalArray(array[index], initializer, position.concat(index));
    } else {
      array[index] = initializer(position.concat(index));
    }
  }
}

function computeOrthogonalDistance(point2: [number, number], point1: [number, number]) {
  const [x1, y1] = point1;
  const [x2, y2] = point2;
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx !== 0 && dy !== 0) {
    return undefined;
  } else if (dx !== 0) {
    return dx;
  } else {
    return dy;
  }
}

function computeDirection(from: [number, number], to: [number, number]) {
  const [x1, y1] = to;
  const [x2, y2] = from;
  const dx = x2 - x1;
  const dy = y2 - y1;

  const theta = Math.atan2(dy, dx);
  if (-Math.PI / 4 < theta && theta <= Math.PI / 4) {
    return Direction.East;
  } else if (Math.PI / 4 < theta && theta <= 3 * Math.PI / 4) {
    return Direction.North;
  } else if (-3 * Math.PI < theta && theta <= -Math.PI / 4) {
    return Direction.South;
  } else {
    return Direction.West;
  }
}

function isPointOnLine(testPoint: [number, number], linePoint2: [number, number], linePoint1: [number, number], precision: number = 1e-6) {
  const [x1, y1] = linePoint1;
  const [x2, y2] = linePoint2;
  const dx = x2 - x1;
  const dy = y2 - y1;

  const slope = dx / dy;

  const [a, b] = testPoint;

  return Math.abs((b - y1) - slope * (a - x1)) < precision;
}

function slope(linePoint2: [number, number], linePoint1: [number, number]) {
  const [x1, y1] = linePoint1;
  const [x2, y2] = linePoint2;
  const dx = x2 - x1;
  const dy = y2 - y1;

  return dx / dy;
}

export {
  createMultiDimensionalArray,
  initializeMutliDimensionalArray,
  computeOrthogonalDistance,
  computeDirection,
  isPointOnLine,
  slope
};
