// Course: CSE 201 A
// Instructor: Dr. Kiper
// Date: 2017/12/08
// Names: John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly

import Drawable from './Drawable';
import Wall from './Wall';
import { Seq } from 'immutable';
import { movePoint } from './lib';
import MazeMapGraph from './MapGraph';

/**
 * Represents a moving game object
 *
 * @author John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly
 * @abstract
 * @class MovableEntity
 */
abstract class MovableEntity {

  exactLocation: [number, number];
  direction: Direction;
  stopped: boolean = true;

  /**
   * The speed of this MovableEntity in logical coordinates per second.
   */
  speed: number = 2;

  protected sprite = new Image();

  /**
   * Used by the move method for caching purposes.
   */
  private lastDirection: Direction;

  /**
   * The cached value.
   */
  private lastUpcomingWall: [number, number];

  /**
   * Creates an instance of MovableEntity.
   * @param {[number, number]} initialLocation The starting location of this entity.
   * @param {Direction} [direction=Direction.North] The initial direction that this entity is facing
   * @memberof MovableEntity
   */
  constructor(initialLocation: [number, number], direction: Direction = Direction.North) {
    this.exactLocation = <[number, number]> initialLocation.slice();
    this.direction = direction;
  }

  /**
   * Sets up any timers that may be used by the object.
   *
   * Analogous to React's `componentDidMount()`.
   *
   * @abstract
   * @memberof MovableEntity
   */
  abstract mount(): void;

  /**
   * Tears down any timers that were setup in `mount()`
   *
   * Analogous to React's `componentWillUnmount()`.
   *
   * @abstract
   * @memberof MovableEntity
   */
  abstract unmount(): void;

  /**
   * The current logical location of this MovableEntity.
   *
   * @memberof MovableEntity
   */
  get logicalLocation() {
    return <[number, number]> this.exactLocation.map(Math.round);
  }
  set logicalLocation(location: [number, number]) {
    this.exactLocation[0] = location[0];
    this.exactLocation[1] = location[1];
  }

  /**
   * Chooses a direction based on the current game map
   *
   * @abstract
   * @param {Drawable[][]} map The map off of which to choose
   * @memberof MovableEntity
   */
  abstract chooseDirection(map: Drawable[][]): void;

  /**
   * Gives this MovableEntity a chance to move.
   *
   * The move should be proportional to the amount of time passed from the previous move.
   *
   * @param {number} timePassed The amount of elapsed time from the previous move in milliseconds.
   *                            This time may be subject to a maximum value at the discretion of the callee.
   * @param {Drawable[][]} map The game board map.  It is not to be modified.  Use it to detect collision and honor boundaries.
   * @returns {void}
   * @memberof MovableEntity
   */
  move(timePassed: number, map: Drawable[][]): void {
    if (this.stopped) {
      return;
    }

    this.chooseDirection(map);

    let upcomingWall: [number, number] | undefined;
    if (this.direction !== this.lastDirection) {
      upcomingWall = MazeMapGraph.findUpcomingEntity(map, this.logicalLocation, this.direction,
                                                     entity => entity instanceof Wall);
      if (upcomingWall === undefined) {
        upcomingWall = [Infinity, Infinity];
      }
    } else {
      upcomingWall = this.lastUpcomingWall;
    }

    const [upcomingWallColumn, upcomingWallRow] = upcomingWall;

    // Remember result of search for next time
    this.lastUpcomingWall = [upcomingWallColumn, upcomingWallRow];
    this.lastDirection = this.direction;

    let maximumAllowableIncrement;
    if (this.direction === Direction.North || this.direction === Direction.South) {
      maximumAllowableIncrement = Math.abs(upcomingWallRow - this.exactLocation[1]);
    } else {
      maximumAllowableIncrement = Math.abs(upcomingWallColumn - this.exactLocation[0]);
    }
    // Allow the entity to make full use of their logical coordinate
    // (Might permit a slight visual overlap if items are drawn edge-to-edge)
    // Makes sure the increment is not negative
    maximumAllowableIncrement = Math.max(maximumAllowableIncrement - 0.51, 0);

    const increment = Math.min(this.speed * timePassed / 1000, maximumAllowableIncrement);

    this.exactLocation = movePoint(this.exactLocation, this.direction, increment);
  }

  /**
   * Checks to see which adjacent cells this entity can legally move
   *
   * @static
   * @param {Drawable[][]} map The grid of stationary entities
   * @param {[number, number]} logicalLocation The location to check
   * @returns
   * @memberof MovableEntity
   */
  static getMovementOptions(map: Drawable[][], logicalLocation: [number, number]) {
    const leftColumn = map[logicalLocation[0] - 1];
    const middleColumn = map[logicalLocation[0]];
    const rightColumn = map[logicalLocation[0] + 1];

    return {
      [Direction.North]: !(middleColumn && middleColumn[logicalLocation[1] - 1] instanceof Wall),
      [Direction.West]: !(leftColumn && leftColumn[logicalLocation[1]] instanceof Wall),
      [Direction.East]: !(rightColumn && rightColumn[logicalLocation[1]] instanceof Wall),
      [Direction.South]: !(middleColumn && middleColumn[logicalLocation[1] + 1] instanceof Wall),
    };
  }

  /**
   * Draw this object on the graphic at the given location.
   *
   * @param {CanvasRenderingContext2D} board The graphic to draw on
   * @param {number} maxSize The maximum size of the image.
   *                         The image drawn should be proportional to mazSize to support scaling.
   * @memberof MovableEntity
   */
  draw(board: CanvasRenderingContext2D, maxSize: number) {
    // Top-left corner
    let drawLocation: [number, number] = [
      this.exactLocation[0] * maxSize,
      this.exactLocation[1] * maxSize
    ];

    board.beginPath();
    board.drawImage(this.sprite, drawLocation[0], drawLocation[1], maxSize, maxSize);
  }

}

enum Direction {
  North = -2,
  South = 2,
  East = 1,
  West = -1
}

const directionSeq = Seq([Direction.North, Direction.South, Direction.East, Direction.West]);

export default MovableEntity;
export { Direction, directionSeq };
