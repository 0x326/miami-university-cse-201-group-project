import Ghost from './Ghost';
import Drawable from './Drawable';
import { Direction, directionSeq } from './MovableEntity';
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
class Inky extends Ghost {

  private timer: number;
  private isRunningAway = false;

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
    const stateDuration = 3000;
    this.timer = window.setInterval(() => {
      this.isRunningAway = !this.isRunningAway;
    }, stateDuration);
  }

  unmount(): void {
    window.clearInterval(this.timer);
  }

  chooseClosestPacManVertex(map: Drawable[][]) {
    return Inky.findClosestVertex(map, this.pacManLocation, Seq([-this.pacManDirection]));
  }

  chooseDirection(map: Drawable[][]): void {
    super.chooseDirection(map);

    if (!this.isRunningAway) {
      // Choose any other valid option than the one selected
      const options = Inky.getMovementOptions(map, this.logicalLocation);
      this.direction = directionSeq.filter(direction => direction !== this.direction)
        .filter(direction => direction !== undefined && options[direction] === true)
        .first();
    }
  }
}

export default Inky;
