import Ghost from './Ghost';
import Drawable from './Drawable';
import { Direction } from './MovableEntity';

const PinkyImage = require('./Images/Pinky.png');

/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class Pinky extends Ghost {
  protected normalSpriteURI: string = PinkyImage;

  /**
   * Creates an Pinky object
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number]) {
    super(initialLocation);
  }

  chooseDirection(map: Drawable[][]): void {
    const options = this.getMovementOptions(map);
    if (options[this.direction] === false) {
      if (options[Direction.West] === true) {
        this.direction = Direction.West;
      } else if (options[Direction.East] === true) {
        this.direction = Direction.East;
      } else if (options[Direction.North] === true) {
        this.direction = Direction.North;
      } else {
        this.direction = Direction.South;
      }
    }
  }
}

export default Pinky;
