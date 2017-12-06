import Ghost from './Ghost';
import Drawable from './Drawable';
import { Direction } from './MovableEntity';
import { Seq, List } from 'immutable';
import UndirectedWeightedGraph from './UndirectedWeightedGraph';

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

  /**
   * Creates a MovableEntity
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
    this.timer = window.setInterval(() => {
      this.mode = (this.mode + 1) % 3;
    });
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
  HeadingWest = 2
}

export default Clyde;
