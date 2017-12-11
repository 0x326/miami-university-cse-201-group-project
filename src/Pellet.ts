// Course: CSE 201 A
// Instructor: Dr. Kiper
// Date: 2017/12/08
// Names: John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly

import Drawable, { Neighbors } from './Drawable';

/**
 * Represents a Pellet
 *
 * @author John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly
 * @class Pellet
 * @implements {Drawable}
 */
class Pellet implements Drawable {
  /**
   * Draw this object on the graphic at the given location.
   *
   * @param {CanvasRenderingContext2D} board The graphic to draw on
   * @param {[number, number]} location The location at which to draw
   * @param {number} maxSize The maximum size of the image.
   *                         The image drawn should be proportional to mazSize to support scaling.
   * @param {Neighbors} neighboringEntities A collection of adjacent entities.
   * @memberof Pellet
   */
  draw(board: CanvasRenderingContext2D, location: [number, number], maxSize: number, neighboringEntities: Neighbors): void {
    const center = [
      location[0] + maxSize / 2,
      location[1] + maxSize / 2
    ];
    board.fillStyle = '#FFC107';
    board.beginPath();
    board.arc(center[0], center[1], 3 * maxSize / 8, 0, 2 * Math.PI);
    board.fill();
  }
}

export default Pellet;
