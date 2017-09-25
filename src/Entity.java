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
public interface Entity {
    /**
     * Draw this object on the graphic at the given location.
     *
     * @param board               The graphic to draw on
     * @param location            The location at which to draw
     * @param maxSize             The maximum size of the image.
     *                            The image drawn should be proportional to mazSize to support scaling.
     * @param neighboringEntities A collection of adjacent entities.
     *                            Use this if the image depends on its surroundings
     */
    void draw(Graphics board, Point2D.Double location, double maxSize, Collection<Drawable> neighboringEntities);
}
