import Drawable from './Drawable';
import Wall from './Wall';

/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
abstract class MovableEntity {

  logicalLocation: [number, number];
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
   * Creates a MovableEntity
   * @param initialLocation The starting location of this entity.
   * @param direction The initial direction that this entity is facing
   */
  constructor(initialLocation: [number, number], direction: Direction = Direction.North) {
    this.logicalLocation = initialLocation;
    this.direction = direction;
  }

  /**
   * Gets the current logical location of this MovableEntity.
   *
   * @return The current location
   */
  getLogicalLocation(): [number, number] {
    return <[number, number]> this.logicalLocation.map(Math.round);
  }

  abstract chooseDirection(map: Drawable[][]): void;

  /**
   * Gives this MovableEntity a chance to move.
   * The move should be proportional to the amount of time passed from the previous move.
   *
   * @param timePassed The amount of elapsed time from the previous move in milliseconds.
   *           This time may be subject to a maximum value at the discretion of the callee.
   * @param map    The game board map.  It is not to be modified.  Use it to detect collision and honor boundaries.
   */
  move(timePassed: number, map: Drawable[][]): void {
    if (this.stopped) {
      return;
    }

    this.chooseDirection(map);

    const [upcomingWallColumn, upcomingWallRow] = this.direction !== this.lastDirection ?
                                                  this.findUpcomingWall(map) :
                                                  this.lastUpcomingWall;

    // Remember result of search for next time
    this.lastUpcomingWall = [upcomingWallColumn, upcomingWallRow];
    this.lastDirection = this.direction;

    let maximumAllowableIncrement;
    if (this.direction === Direction.North || this.direction === Direction.South) {
      maximumAllowableIncrement = Math.abs(upcomingWallRow - this.logicalLocation[1]);
    } else {
      maximumAllowableIncrement = Math.abs(upcomingWallColumn - this.logicalLocation[0]);
    }
    // Allow the entity to make full use of their logical coordinate
    // (Might permit a slight visual overlap if items are drawn edge-to-edge)
    // Makes sure the increment is not negative
    maximumAllowableIncrement = Math.max(maximumAllowableIncrement - 0.51, 0);

    const increment = Math.min(this.speed * timePassed / 1000, maximumAllowableIncrement);

    if (this.direction === Direction.North) {
      this.logicalLocation[1] -= increment;
    } else if (this.direction === Direction.South) {
      this.logicalLocation[1] += increment;
    } else if (this.direction === Direction.West) {
      this.logicalLocation[0] -= increment;
    } else {
      this.logicalLocation[0] += increment;
    }
  }

  /**
   * Checks to see which adjacent cells this entity can legally move
   * @param map The grid of stationary entities
   */
  getMovementOptions(map: Drawable[][]) {
    const logicalLocation = this.getLogicalLocation();
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
   * @param board         The graphic to draw on
   * @param maxSize       The maximum size of the image.
   *              The image drawn should be proportional to mazSize to support scaling.
   */
  draw(board: CanvasRenderingContext2D, maxSize: number) {
    let drawLocation: [number, number] = [
      this.logicalLocation[0] * maxSize - maxSize,
      this.logicalLocation[1] * maxSize - maxSize
    ];

    board.beginPath();
    board.drawImage(this.sprite, (drawLocation[0] - (maxSize / 2)), (drawLocation[1] - (maxSize / 2)), maxSize, maxSize);
  }

  private findUpcomingWall(map: Drawable[][]): [number, number] {
    const [logicalColumn, logicalRow] = this.getLogicalLocation();

    let columnNumber = logicalColumn;
    let rowNumber = logicalRow;
    while (0 <= columnNumber && columnNumber < map.length &&
      0 <= rowNumber && rowNumber < map[columnNumber].length) {
      if (map[columnNumber][rowNumber] instanceof Wall) {
        break;
      }

      if (this.direction === Direction.North) {
        rowNumber--;
      } else if (this.direction === Direction.South) {
        rowNumber++;
      } else if (this.direction === Direction.East) {
        columnNumber++;
      } else {
        columnNumber--;
      }
    }

    return [columnNumber, rowNumber];
  }

}

enum Direction {
  North,
  South,
  East,
  West
}

export default MovableEntity;
export { Direction };
