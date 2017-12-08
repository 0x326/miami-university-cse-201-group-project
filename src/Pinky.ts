import Ghost from './Ghost';
import Drawable from './Drawable';
import { Direction } from './MovableEntity';
import { Seq } from 'immutable';
import MapGraph from './MapGraph';

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
  constructor(initialLocation: [number, number],
              pacManLocation: [number, number],
              pacManDirection: Direction,
              boardGraph: MapGraph) {
    super(initialLocation, pacManLocation, pacManDirection, boardGraph);
  }

  mount(): void {
    this.timeWhenStartedMoving = performance.now();
  }

  unmount(): void {
    // Nothing to unmount
  }

  chooseClosestPacManVertex() {
    return this.boardGraph.findClosestVertex(this.pacManLocation, Seq([this.pacManDirection]));
  }

  chooseDirection(map: Drawable[][]): void {
    const timeMoving = performance.now() - this.timeWhenStartedMoving;
    const waitingTime = 6000;

    // initial ghost movement, moves back and forth for six seconds
    if (timeMoving < waitingTime) {
      // Ghosts move back and forth every quarter of a second
      if (Math.floor(timeMoving / 250) % 2 == 0) {
        this.direction = Direction.West;
      } else {
        this.direction = Direction.East;
      }
    } else {
      super.chooseDirection(map);
    }
  }
}

export default Pinky;
