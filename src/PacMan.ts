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
    constructor(initialLocation: Point2D.Double) {
        super(initialLocation);
    }

    /**
     * Gets the current logical location of this MovableEntity.
     *
     * @return The current location
     */
    getLogicalLocation(): Point2D.Double {
        return null;
    }
}

export default PacMan;
