import java.awt.geom.Point2D;

/**
 * Course: CSE 201 A
 * Instructor: Dr. Sobel
 * <p>
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
public interface MovableEntity extends Entity {
    Point2D.Double getLogicalLocation();
    void move(double timePassed);
}
