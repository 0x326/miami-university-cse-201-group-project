import MovableEntity from './MovableEntity';

/**
 * Course: CSE 201 A
 * Instructor: Dr. Sobel
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class PacMan extends MovableEntity {

    /**
     * Creates a MovableEntity
     *
     * @param initialLocation The starting location of this entity.
     */
    constructor(initialLocation: [number, number]) {
        super(initialLocation);
    }

    /**
     * Gets the current logical location of this MovableEntity.
     *
     * @return The current location
     */
    getLogicalLocation(): [number, number] {
        return [0, 0];
    }
}

export default PacMan;
