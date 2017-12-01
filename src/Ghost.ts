import MovableEntity from './MovableEntity';

const VulnerableImg = require('./Images/Vulnerable.png');
const BlinkingImg = require('./Images/Blinking.png');

/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
abstract class Ghost extends MovableEntity {
  state: VulnerabilityState = VulnerabilityState.Dangerous;
  protected abstract normalSpriteURI: string;
  // used for alternating between two blinking sprites
  private frameCount: number = 0;


  /**
   * Creates a MovableEntity
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number]) {
    super(initialLocation);
    this.stopped = false;
    this.speed = 2.3;
  }

  /**
   * @return Whether this Ghost is vulnerable
   */
  isVunerable(): boolean {
    return this.state !== VulnerabilityState.Dangerous;
  }

  /**
  * @return Whether this Ghost is vulnerable and blinking
  */
  isVulnerableBlinking(): boolean {
    return this.state === VulnerabilityState.VulnerableBlinking;
  }

  /**
   * Makes this Ghost vulnerable
   */
  makeVulnerable(): void {
    this.state = VulnerabilityState.Vulnerable;
  }

  /**
   * Makes this Ghost start blinking.
   * If this method is called when the ghost is not vulnerable, an exception will be thrown.
   */
  startWarning(): void {
    if (this.state === VulnerabilityState.Vulnerable) {
      this.state = VulnerabilityState.VulnerableBlinking;
    } else {
      throw new Error();
    }
  }

  /**
   * Removes this Ghost from its vulnerable state.
   */
  makeDangerous(): void {
    this.state = VulnerabilityState.Dangerous;
  }

  /**
   * Draw this object on the graphic at the given location.
   *
   * @param board         The graphic to draw on
   * @param maxSize       The maximum size of the image.
   *              The image drawn should be proportional to maxSize to support scaling.
   */
  draw(board: CanvasRenderingContext2D, maxSize: number) {
    switch (this.state) {
      case VulnerabilityState.VulnerableBlinking:
        this.frameCount++;
        this.frameCount %= 14;
        if (this.frameCount <= 7) {
          this.sprite.src = BlinkingImg;
          break;
        }
        // Fall through

      case VulnerabilityState.Vulnerable:
        this.sprite.src = VulnerableImg;
        break;

      default:
        this.sprite.src = this.normalSpriteURI;
        break;
    }
    super.draw(board, maxSize);
  }
}

enum VulnerabilityState {
  Vulnerable,
  VulnerableBlinking,
  Dangerous
}

export default Ghost;
