import Ghost from './Ghost';
import Drawable from './Drawable';
import { Direction, directionSeq } from './MovableEntity';
import { Seq } from 'immutable';
import MapGraph from './MapGraph';

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

  private timer: number;
  private isRunningAway = false;
  protected normalSpriteURI: string = InkyImage;
  // used for telling the ghost when to exit the spawn box
  private timeWhenStartedMoving: number = performance.now();

  /**
   * Creates an Inky object
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number],
              pacManLocation: [number, number],
              pacManDirection: Direction,
              boardGraph: MapGraph) {
    super(initialLocation, pacManLocation, pacManDirection, boardGraph);
  }

  mount(): void {
    this.timeWhenStartedMoving = performance.now();
    const stateDuration = 3000;
    this.timer = window.setInterval(() => {
      this.isRunningAway = !this.isRunningAway;
    },                              stateDuration);
  }

  unmount(): void {
    window.clearInterval(this.timer);
  }

  chooseClosestPacManVertex() {
    return this.boardGraph.findClosestVertex(this.pacManLocation, Seq([-this.pacManDirection]));
  }

  chooseDirection(map: Drawable[][]): void {
    super.chooseDirection(map);

    const timeMoving = performance.now() - this.timeWhenStartedMoving;
    const waitingTime = 3000;

    // initial ghost movement, moves back and forth for three seconds
    if (timeMoving < waitingTime) {
      // Ghosts move back and forth every quarter of a second
      if (Math.floor(timeMoving / 250) % 2 == 0) {
        this.direction = Direction.West;
      } else {
        this.direction = Direction.East;
      }
    } else if (this.isRunningAway) {
      // Choose any other valid option than the one selected
      const options = Inky.getMovementOptions(map, this.logicalLocation);
      this.direction = directionSeq.filter(direction => direction !== this.direction)
        .filter(direction => direction !== undefined && options[direction] === true)
        .first();
    }
  }
}

export default Inky;
