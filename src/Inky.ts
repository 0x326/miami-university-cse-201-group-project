import Ghost from './Ghost';
import Drawable from './Drawable';

/**
 * Course: CSE 201 A
 * Instructor: Dr. Sobel
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class Inky extends Ghost {
    /**
     * Creates a MovableEntity
     *
     * @param initialLocation The starting location of this entity.
     */
    constructor(initialLocation: [number, number]) {
        super(initialLocation);
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
}

export default Inky;
