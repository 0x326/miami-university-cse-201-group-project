import Ghost from './Ghost';
import Drawable from './Drawable';
import { Direction } from './MovableEntity';

const InkyImage = require('./Inky.png');
const VulnerableImg = require('./Vulnerable.png');
const BlinkingImg = require('./Blinking.png');

/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class Inky extends Ghost {
    // used for alternating between two blinking sprites
    static frameCount : number;
    // instance variable, initializes the sprite
    private sprite = new Image();
  /**
   * Creates an Inky object
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number]) {
    super(initialLocation);
    Inky.frameCount = 0;
  }
    
  /**
   * Draw this object on the graphic at the given location.
   *
   * @param board         The graphic to draw on
   * @param maxSize       The maximum size of the image.
   *              The image drawn should be proportional to mazSize to support scaling.
   */
  draw(board: CanvasRenderingContext2D, maxSize: number) {
    // super.draw(board, maxSize);
    let drawLocation: [number, number] = [
      this.logicalLocation[0] * maxSize - maxSize,
      this.logicalLocation[1] * maxSize - maxSize
    ];
      // about to become dangerous again
      if (this.isVunerable() && this.isVulnerableBlinking()) {
          // alternate between blinking and vulnerable
          if (Inky.frameCount <= 7) {
              this.sprite.src = BlinkingImg;
          }
          else {
              this.sprite.src = VulnerableImg;
              if (Inky.frameCount === 14) {
                  Inky.frameCount = 0;
              }
          }
          Inky.frameCount++;
      }
      // vulnerable and not blinking
      else if (this.isVunerable()) {
          this.sprite.src = VulnerableImg;
      }
      else {
          this.sprite.src = InkyImage;
      }
    board.drawImage(this.sprite, (drawLocation[0] - (maxSize / 2)), (drawLocation[1] - (maxSize / 2)), maxSize, maxSize);
  }

  chooseDirection(map: Drawable[][]): void {
    const options = this.getMovementOptions(map);
    if (options[this.direction] === false) {
      if (options[Direction.North] === true) {
        this.direction = Direction.North;
      } else if (options[Direction.West] === true) {
        this.direction = Direction.West;
      } else if (options[Direction.South] === true) {
        this.direction = Direction.South;
      } else {
        this.direction = Direction.East;
      }
    }
  }
}

export default Inky;
