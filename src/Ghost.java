/**
 * Course: CSE 201 A
 * Instructor: Dr. Sobel
 * <p>
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
public abstract class Ghost implements MovableEntity {
    private enum VulnerabilityState {
        VULNERABLE,
        VULNERABLE_BLINKING,
        DANGEROUS
    }

    private VulnerabilityState state = VulnerabilityState.DANGEROUS;

    public boolean isVunerable() {
        return state != VulnerabilityState.DANGEROUS;
    }

    public void makeVulnerable() {
        state = VulnerabilityState.VULNERABLE;
    }

    public void startWarning() {
        if (state == VulnerabilityState.VULNERABLE) {
            state = VulnerabilityState.VULNERABLE_BLINKING;
        }
        else {
            throw new RuntimeException();
        }
    }

    public void makeDangerous() {
        state = VulnerabilityState.DANGEROUS;
    }
}
