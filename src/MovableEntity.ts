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
  speed: number = 0.05;

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
    return this.logicalLocation;
  }

  abstract chooseDirection(map: Drawable[][]): void;

  /**
   * Gives this MovableEntity a chance to move.
   * The move should be proportional to the amount of time passed from the previous move.
   *
   * @param timePassed The amount of elapsed time from the previous move.
   *           This time may be subject to a maximum value at the discretion of the callee.
   * @param map    The game board map.  It is not to be modified.  Use it to detect collision and honor boundaries.
   */
  move(timePassed: number, map: Drawable[][]): void {
    if (this.stopped) {
      return;
    }

    this.chooseDirection(map);

    let xIncrement = 0, yIncrement = 0;
    if (this.direction === Direction.North) {
      yIncrement = - this.speed * timePassed;
    } else if (this.direction === Direction.West) {
      xIncrement = - this.speed * timePassed;
    } else if (this.direction === Direction.South) {
      yIncrement = this.speed * timePassed;
    } else {
      xIncrement = this.speed * timePassed;
    }
    this.logicalLocation = [this.logicalLocation[0] + xIncrement, this.logicalLocation[1] + yIncrement];

  }

  /**
   * Checks to see which adjacent cells this entity can legally move
   * @param map The grid of stationary entities
   */
  getMovementOptions(map: Drawable[][]) {
    return {
      top: !(map[this.logicalLocation[0]][this.logicalLocation[1] + 1] instanceof Wall),
      left: !(map[this.logicalLocation[0] - 1][this.logicalLocation[1]] instanceof Wall),
      right: !(map[this.logicalLocation[0] + 1][this.logicalLocation[1]] instanceof Wall),
      bottom: !(map[this.logicalLocation[0]][this.logicalLocation[1] - 1] instanceof Wall),
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

    board.fillStyle = '#9E9E9E';
    board.fillRect(drawLocation[0] - maxSize / 2, drawLocation[1] - maxSize / 2, maxSize, maxSize);
    board.strokeStyle = '#BDBDBD';
    board.moveTo(drawLocation[0], drawLocation[1]);
    if (this.direction === Direction.North) {
      board.lineTo(drawLocation[0], drawLocation[1] - maxSize / 2);
    } else if (this.direction === Direction.South) {
      board.lineTo(drawLocation[0], drawLocation[1] + maxSize / 2);
    } else if (this.direction === Direction.East) {
      board.lineTo(drawLocation[0] + maxSize / 2, drawLocation[1]);
    } else {
      board.lineTo(drawLocation[0] - maxSize / 2, drawLocation[1]);
    }
    board.stroke();
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
