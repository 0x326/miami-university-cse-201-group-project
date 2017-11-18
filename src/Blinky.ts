import Ghost from './Ghost';
import Drawable from './Drawable';
import { Direction } from './MovableEntity';

/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class Blinky extends Ghost {
  /**
   * Creates a MovableEntity
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number]) {
    super(initialLocation);
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

export default Blinky;
