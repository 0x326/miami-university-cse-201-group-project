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
