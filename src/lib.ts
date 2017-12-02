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
    throw 'Points do not lay on an orthogonal axis';
  } else if (dx !== 0) {
    return dx;
  } else {
    return dy;
  }
}

export {
  createMultiDimensionalArray,
  initializeMutliDimensionalArray,
  computeOrthogonalDistance
};
