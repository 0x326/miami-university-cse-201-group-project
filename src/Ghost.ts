import MovableEntity from './MovableEntity';

/**
 * Course: CSE 201 A
 * Instructor: Dr. Sobel
 *
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
    constructor(initialLocation: [number, number]) {
        super(initialLocation);
    }

    /**
     * @return Whether this Ghost is vulnerable
     */
    isVunerable(): boolean {
        return this.state != VulnerabilityState.DANGEROUS;
    }

    /**
     * Makes this Ghost vulnerable
     */
    makeVulnerable(): void {
        this.state = VulnerabilityState.VULNERABLE;
    }

    /**
     * Makes this Ghost start blinking.
     * If this method is called when the ghost is not vulnerable, an exception will be thrown.
     */
    startWarning(): void {
        if (this.state == VulnerabilityState.VULNERABLE) {
            this.state = VulnerabilityState.VULNERABLE_BLINKING;
        } else {
            throw new Error();
        }
    }

    /**
     * Removes this Ghost from its vulnerable state.
     */
    makeDangerous(): void {
        this.state = VulnerabilityState.DANGEROUS;
    }

}

enum VulnerabilityState {
    VULNERABLE,
    VULNERABLE_BLINKING,
    DANGEROUS
}

export default Ghost;
