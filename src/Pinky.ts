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
class Pinky extends Ghost {
  /**
   * Creates a MovableEntity
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number], pacManLocation: [number, number]) {
    super(initialLocation, pacManLocation);
  }

  chooseDirection(map: Drawable[][]): void {
    const options = Pinky.getMovementOptions(map, this.logicalLocation);
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
