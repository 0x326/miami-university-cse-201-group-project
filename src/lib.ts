function createMultiDimensionalArray<T>(dimensionSizes: number[], initializer: (position: number[]) => T) {
    return _createMultiDimensionalArray(dimensionSizes.reverse(), initializer, []);
}

function _createMultiDimensionalArray<T>(dimensionSizes: number[], initializer: (position: number[]) => T, position: number[]) {
    if (dimensionSizes.length === 1) {
        let size = dimensionSizes[0];
        let array = new Array(size);
        for (let i = 0; i < array.length; i++) {
            array[i] = initializer(position.concat(i));
        }
        return array;
    }
    else {
        let array = new Array(dimensionSizes.pop());
        for (let i = 0; i < array.length; i++) {
            array[i] = _createMultiDimensionalArray(dimensionSizes, initializer, position.concat(i));
        }
        return array;
    }
}

export {createMultiDimensionalArray};
