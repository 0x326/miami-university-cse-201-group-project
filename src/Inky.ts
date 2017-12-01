import Ghost from './Ghost';
import Drawable from './Drawable';
import { Direction } from './MovableEntity';

const InkyImage = require('./Images/Inky.png');

/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class Inky extends Ghost {
  protected normalSpriteURI: string = InkyImage;

  /**
   * Creates an Inky object
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number]) {
    super(initialLocation);
  }

  chooseDirection(map: Drawable[][]): void {
    const options = this.getMovementOptions(map);
    if (options[this.direction] === false) {
      if (options[Direction.South] === true) {
        this.direction = Direction.South;
      } else if (options[Direction.North] === true) {
        this.direction = Direction.North;
      } else if (options[Direction.East] === true) {
        this.direction = Direction.East;
      } else {
        this.direction = Direction.West;
      }
    }
  }
}

export default Inky;
