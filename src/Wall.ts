import Drawable, { Neighbors } from './Drawable';

/**
 * Represents a wall.
 *
 * @author John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly
 * @class Wall
 * @implements {Drawable}
 */
class Wall implements Drawable {
  /**
   * Draw this object on the graphic at the given location.
   *
   * @param {CanvasRenderingContext2D} board The graphic to draw on
   * @param {[number, number]} location The location at which to draw
   * @param {number} maxSize The maximum size of the image.
   *                         The image drawn should be proportional to mazSize to support scaling.
   * @param {Neighbors} neighboringEntities A collection of adjacent entities.
   * @memberof Wall
   */
  draw(board: CanvasRenderingContext2D, location: [number, number], maxSize: number, neighboringEntities: Neighbors): void {
    board.fillStyle = '#3F51B5';
    board.fillRect(location[0], location[1], maxSize, maxSize);
  }
}

export default Wall;
