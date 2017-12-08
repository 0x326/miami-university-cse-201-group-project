import Ghost from './Ghost';
import Drawable from './Drawable';
import { Direction } from './MovableEntity';
import { Seq, List } from 'immutable';
import UndirectedWeightedGraph from './UndirectedWeightedGraph';

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

  private timer: number;
  private mode = Behavior.Normal;
  protected normalSpriteURI: string = ClydeImage;

  /**
   * Creates an Clyde object
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number],
              pacManLocation: [number, number],
              pacManDirection: Direction,
              boardGraph: UndirectedWeightedGraph<List<number>>) {
    super(initialLocation, pacManLocation, pacManDirection, boardGraph);
  }

  mount(): void {
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
    if (this.mode === Behavior.Normal) {
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

  chooseClosestPacManVertex(map: Drawable[][]) {
    return Clyde.findClosestVertex(map, this.pacManLocation, Seq([-this.pacManDirection]));
  }
}

enum Behavior {
  Normal = 0,
  HeadingNorth = 1,
  HeadingWest = -1
}

export default Clyde;
