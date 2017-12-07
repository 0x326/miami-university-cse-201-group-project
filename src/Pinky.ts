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
  // used for telling the ghost when to exit the spawn box
  private timeWhenStartedMoving: number = performance.now();

  /**
   * Creates an Pinky object
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
    const waitingTime = 6000;

    // initial ghost movement, moves back and forth for six seconds
    if (timeMoving < waitingTime) {
      // magical numbers that make this work
      if (timeMoving % 601 < 30) {
        this.direction = Direction.West;
      } else if (timeMoving % 300 < 30) {
        this.direction = Direction.East;
      }
    } else if (options[this.direction] === false) {
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
