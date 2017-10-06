import java.awt.geom.Point2D;

/**
 * Course: CSE 201 A
 * Instructor: Dr. Sobel
 * <p>
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
public abstract class Ghost extends MovableEntity {
    private VulnerabilityState state = VulnerabilityState.DANGEROUS;

    /**
     * Creates a MovableEntity
     *
     * @param initialLocation The starting location of this entity.
     */
    public Ghost(Point2D.Double initialLocation) {
        super(initialLocation);
    }

    /**
     * @return Whether this Ghost is vulnerable
     */
    public boolean isVunerable() {
        return state != VulnerabilityState.DANGEROUS;
    }

    /**
     * Makes this Ghost vulnerable
     */
    public void makeVulnerable() {
        state = VulnerabilityState.VULNERABLE;
    }

    /**
     * Makes this Ghost start blinking.
     * If this method is called when the ghost is not vulnerable, an exception will be thrown.
     */
    public void startWarning() {
        if (state == VulnerabilityState.VULNERABLE) {
            state = VulnerabilityState.VULNERABLE_BLINKING;
        } else {
            throw new RuntimeException();
        }
    }

    /**
     * Removes this Ghost from its vulnerable state.
     */
    public void makeDangerous() {
        state = VulnerabilityState.DANGEROUS;
    }

    private enum VulnerabilityState {
        VULNERABLE,
        VULNERABLE_BLINKING,
        DANGEROUS
    }
}
