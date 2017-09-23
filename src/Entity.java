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
    void draw(Graphics board, Point2D.Double position, Collection<Entity> neighboringEntities);
}
