/**
 * Course: CSE 201 A
 * Instructor: Dr. Sobel
 * <p>
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
abstract class Ghost extends MovableEntity {
    state: VulnerabilityState = VulnerabilityState.DANGEROUS;

    /**
     * Creates a MovableEntity
     *
     * @param initialLocation The starting location of this entity.
     */
    constructor(initialLocation: Point2D.Double) {
        super(initialLocation);
    }

    /**
     * @return Whether this Ghost is vulnerable
     */
    isVunerable(): boolean {
        return state != VulnerabilityState.DANGEROUS;
    }

    /**
     * Makes this Ghost vulnerable
     */
    makeVulnerable(): void {
        state = VulnerabilityState.VULNERABLE;
    }

    /**
     * Makes this Ghost start blinking.
     * If this method is called when the ghost is not vulnerable, an exception will be thrown.
     */
    startWarning(): void {
        if (state == VulnerabilityState.VULNERABLE) {
            state = VulnerabilityState.VULNERABLE_BLINKING;
        } else {
            throw new RuntimeException();
        }
    }

    /**
     * Removes this Ghost from its vulnerable state.
     */
    makeDangerous(): void {
        state = VulnerabilityState.DANGEROUS;
    }

    private enum VulnerabilityState {
        VULNERABLE,
        VULNERABLE_BLINKING,
        DANGEROUS
    }
}

export default Ghost;
