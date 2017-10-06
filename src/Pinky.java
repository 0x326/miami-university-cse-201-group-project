import java.awt.geom.Point2D;

/**
 * Course: CSE 201 A
 * Instructor: Dr. Sobel
 * <p>
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
public class Pinky extends Ghost {
    /**
     * Creates a MovableEntity
     *
     * @param initialLocation The starting location of this entity.
     */
    public Pinky(Point2D.Double initialLocation) {
        super(initialLocation);
    }

    /**
     * Gets the current logical location of this MovableEntity.
     *
     * @return The current location
     */
    @Override
    public Point2D.Double getLogicalLocation() {
        return null;
    }
}
