import Ghost from './Ghost';
import Drawable from './Drawable';
import { Direction } from './MovableEntity';

const ClydeImage = require('./Images/Clyde.png');

/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class Clyde extends Ghost {
  protected normalSpriteURI: string = ClydeImage;
  // used for telling the ghost when to exit the spawn box
  private timeWhenStartedMoving: number = performance.now();

  /**
   * Creates an Clyde object
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number]) {
    super(initialLocation);
    this.timeWhenStartedMoving = performance.now();
    this.direction = Direction.West;
  }

  chooseDirection(map: Drawable[][]): void {
    const options = this.getMovementOptions(map);
    const timeMoving = performance.now() - this.timeWhenStartedMoving;
    const waitingTime = 9000;

    // initial ghost movement, moves back and forth for nine seconds
    if (timeMoving < waitingTime) {
      // Ghosts move back and forth every quarter of a second
      if (Math.floor(timeMoving / 250) % 2 == 0) {
        this.direction = Direction.West;
      } else {
        this.direction = Direction.East;
      }
    } else if (options[this.direction] === false) {
      if (options[Direction.East] === true) {
        this.direction = Direction.East;
      } else if (options[Direction.South] === true) {
        this.direction = Direction.South;
      } else if (options[Direction.West] === true) {
        this.direction = Direction.West;
      } else {
        this.direction = Direction.North;
      }
    }
  }
}

export default Clyde;
