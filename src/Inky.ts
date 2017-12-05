import Ghost from './Ghost';
import Drawable from './Drawable';
import { Direction, directionSeq } from './MovableEntity';
import { Seq } from 'immutable';

/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class Inky extends Ghost {
  private isRunningAway = false;

  /**
   * Creates a MovableEntity
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number], pacManLocation: [number, number], pacManDirection: Direction) {
    super(initialLocation, pacManLocation, pacManDirection);
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
