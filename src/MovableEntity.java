import java.awt.*;
import java.awt.geom.Point2D;
import java.util.Collection;

/**
 * Course: CSE 201 A
 * Instructor: Dr. Sobel
 * <p>
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
public abstract class MovableEntity implements Drawable {

    private Point2D.Double logicalLocation;

    /**
     * Creates a MovableEntity
     * @param initialLocation The starting location of this entity.
     */
    public MovableEntity(Point2D.Double initialLocation) {
        logicalLocation = initialLocation;
    }

    /**
     * Gets the current logical location of this MovableEntity.
     *
     * @return The current location
     */
    public Point2D.Double getLogicalLocation() {
        return logicalLocation;
    }

    /**
     * Gives this MovableEntity a chance to move.
     * The move should be proportional to the amount of time passed from the previous move.
     *
     * @param timePassed The amount of elapsed time from the previous move.
     *                   This time may be subject to a maximum value at the discretion of the callee.
     * @param map        The game board map.  It is not to be modified.  Use it to detect collision and honor boundaries.
     */
    public void move(double timePassed, Drawable[][] map) {

    }

    /**
     * Draw this object on the graphic at the given location.
     *
     * @param board               The graphic to draw on
     * @param location            The location at which to draw
     * @param maxSize             The maximum size of the image.
     *                            The image drawn should be proportional to mazSize to support scaling.
     * @param neighboringEntities A collection of adjacent entities.
     */
    @Override
    public void draw(Graphics board, Point2D.Double location, double maxSize, Collection<Drawable> neighboringEntities) {

    }
}
