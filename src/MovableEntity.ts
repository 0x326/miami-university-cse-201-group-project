import Drawable from './Drawable';
import Wall from './Wall';

/**
 * Course: CSE 201 A
 * Instructor: Dr. Sobel
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
abstract class MovableEntity {

    logicalLocation: [number, number];

    /**
     * Creates a MovableEntity
     * @param initialLocation The starting location of this entity.
     */
    constructor(initialLocation: [number, number]) {
        this.logicalLocation = initialLocation;
    }

    /**
     * Gets the current logical location of this MovableEntity.
     *
     * @return The current location
     */
    getLogicalLocation(): [number, number] {
        return this.logicalLocation;
    }

    /**
     * Gives this MovableEntity a chance to move.
     * The move should be proportional to the amount of time passed from the previous move.
     *
     * @param timePassed The amount of elapsed time from the previous move.
     *                   This time may be subject to a maximum value at the discretion of the callee.
     * @param map        The game board map.  It is not to be modified.  Use it to detect collision and honor boundaries.
     */
    move(timePassed: number, map: Drawable[][]): void {

    }

    /**
     * Checks to see which adjacent cells this entity can legally move
     * @param map The grid of stationary entities
     */
    getMovementOptions(map: Drawable[][]) {
        return {
            top: !(map[this.logicalLocation[0]][this.logicalLocation[1] + 1] instanceof Wall),
            left: !(map[this.logicalLocation[0] - 1][this.logicalLocation[1]] instanceof Wall),
            right: !(map[this.logicalLocation[0] + 1][this.logicalLocation[1]] instanceof Wall),
            bottom: !(map[this.logicalLocation[0]][this.logicalLocation[1] - 1] instanceof Wall),
        };
    }

    /**
     * Draw this object on the graphic at the given location.
     *
     * @param board               The graphic to draw on
     * @param maxSize             The maximum size of the image.
     *                            The image drawn should be proportional to mazSize to support scaling.
     */
    draw(board: CanvasRenderingContext2D, maxSize: number) {

    }
}

export default MovableEntity;
