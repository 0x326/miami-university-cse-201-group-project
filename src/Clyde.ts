// Course: CSE 201 A
// Instructor: Dr. Kiper
// Date: 2017/12/08
// Names: John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly

import Ghost from './Ghost';
import Drawable from './Drawable';
import { Direction } from './MovableEntity';
import { Seq } from 'immutable';
import MapGraph from './MapGraph';

const ClydeImage = require('./Images/Clyde.png');

/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly
 */
class Clyde extends Ghost {

  private timer: number;
  private mode = Behavior.Normal;
  protected normalSpriteURI: string = ClydeImage;
  // used for telling the ghost when to exit the spawn box
  private timeWhenStartedMoving: number = performance.now();

  /**
   * Creates an instance of Clyde.
   * @param {[number, number]} initialLocation The starting location
   * @param {[number, number]} pacManLocation Pac-Man's current location
   * @param {Direction} pacManDirection Pac-Man's current direction
   * @param {MapGraph} boardGraph The currently loaded board
   * @memberof Clyde
   */
  constructor(initialLocation: [number, number],
              pacManLocation: [number, number],
              pacManDirection: Direction,
              boardGraph: MapGraph) {
    super(initialLocation, pacManLocation, pacManDirection, boardGraph);
  }

  mount(): void {
    this.timeWhenStartedMoving = performance.now();
    const stateDuration = 5000;
    let timeSinceLastMajorTransition = performance.now();

    const makeNormal = () => {
      this.mode = Behavior.Normal;
      this.timer = window.setTimeout(makeAbnormal, stateDuration);
    };

    const makeAbnormal = () => {
      if (this.mode === Behavior.Normal) {
        timeSinceLastMajorTransition = performance.now();
        this.mode = Behavior.HeadingNorth;
      } else {
        this.mode = -this.mode;
      }

      const now = performance.now();
      if (now - timeSinceLastMajorTransition > stateDuration) {
        makeNormal();
        timeSinceLastMajorTransition = now;
      } else {
        this.timer = window.setTimeout(makeAbnormal, 500);
      }
    };

    makeNormal();
  }

  unmount(): void {
    window.clearInterval(this.timer);
  }

  chooseDirection(map: Drawable[][]): void {
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
    } else if (this.mode === Behavior.Normal) {
      super.chooseDirection(map);
    } else {
      const options = Clyde.getMovementOptions(map, this.logicalLocation);

      if (this.mode === Behavior.HeadingNorth && options[Direction.North] === true) {
        // We prefer north (even if others were options too)
        this.direction = Direction.North;
      } else if (this.mode === Behavior.HeadingWest && options[Direction.West] === true) {
        // We prefer west (even if others were options too)
        this.direction = Direction.West;
      } else if (options[Direction.North] === true) {
        // Since we can't get our preference, we'll take what we can get
        this.direction = Direction.North;
      } else if (options[Direction.West] === true) {
        this.direction = Direction.West;
      }
    }
  }

  chooseClosestPacManVertex() {
    return this.boardGraph.findClosestVertex(this.pacManLocation, Seq([-this.pacManDirection]));
  }
}

enum Behavior {
  Normal = 0,
  HeadingNorth = 1,
  HeadingWest = -1
}

export default Clyde;
