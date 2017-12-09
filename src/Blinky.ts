import Ghost from './Ghost';
import { Direction } from './MovableEntity';
import { Seq } from 'immutable';
import MapGraph from './MapGraph';

const BlinkyImage = require('./Images/Blinky.png');

/**
 * The Blinky ghost.
 *
 * @author John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly
 * @class Blinky
 * @extends {Ghost}
 */
class Blinky extends Ghost {
  protected normalSpriteURI: string = BlinkyImage;

  /**
   * Creates an instance of Blinky.
   * @param {[number, number]} initialLocation The starting location
   * @param {[number, number]} pacManLocation Pac-Man's current location
   * @param {Direction} pacManDirection Pac-Man's current direction
   * @param {MapGraph} boardGraph The currently loaded board
   * @memberof Blinky
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
