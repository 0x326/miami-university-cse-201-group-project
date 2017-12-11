// Course: CSE 201 A
// Instructor: Dr. Kiper
// Date: 2017/12/08
// Names: John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly

import Ghost from './Ghost';
import Drawable from './Drawable';
import { Direction } from './MovableEntity';
import { Seq } from 'immutable';
import MapGraph from './MapGraph';

const PinkyImage = require('./Images/Pinky.png');

/**
 * Represents Pinky
 *
 * @author John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly
 * @class Pinky
 * @extends {Ghost}
 */
class Pinky extends Ghost {
  protected normalSpriteURI: string = PinkyImage;
  // used for telling the ghost when to exit the spawn box
  private timeWhenStartedMoving: number = performance.now();

  /**
   * Creates an instance of Pinky.
   * @param {[number, number]} initialLocation The starting location
   * @param {[number, number]} pacManLocation Pac-Man's current location
   * @param {Direction} pacManDirection Pac-Man's current direction
   * @param {MapGraph} boardGraph The currently loaded board
   * @memberof Pinky
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
