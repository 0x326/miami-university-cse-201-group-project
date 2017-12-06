import Ghost from './Ghost';
import Drawable from './Drawable';
import { Direction } from './MovableEntity';
import { Seq, List } from 'immutable';
import UndirectedWeightedGraph from './UndirectedWeightedGraph';

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

  /**
   * Creates an Pinky object
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
    // Nothing to mount
  }

  unmount(): void {
    // Nothing to unmount
  }

  chooseClosestPacManVertex(map: Drawable[][]) {
    return Pinky.findClosestVertex(map, this.pacManLocation, Seq([this.pacManDirection]));
  }
}

export default Pinky;
