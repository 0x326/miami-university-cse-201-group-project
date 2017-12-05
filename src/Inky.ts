import Ghost from './Ghost';
import Drawable from './Drawable';
import { Direction } from './MovableEntity';
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
}

export default Inky;
