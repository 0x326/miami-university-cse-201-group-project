import Ghost from './Ghost';
import { Direction } from './MovableEntity';
import { Seq } from 'immutable';
import MapGraph from './MapGraph';

const BlinkyImage = require('./Images/Blinky.png');

/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class Blinky extends Ghost {
  protected normalSpriteURI: string = BlinkyImage;

  /**
   * Creates a Blinky object
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
    // Nothing to mount
  }

  unmount(): void {
    // Nothing to unmount
  }

  chooseClosestPacManVertex() {
    return this.boardGraph.findClosestVertex(this.pacManLocation, Seq([-this.pacManDirection]));
  }
}

export default Blinky;
