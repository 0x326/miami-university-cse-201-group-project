import Drawable, { Neighbors } from './Drawable';

/**
 * Represents a power-pellet.
 *
 * @author John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly
 * @class PowerPellet
 * @implements {Drawable}
 */
class PowerPellet implements Drawable {
  /**
   * Draw this object on the graphic at the given location.
   *
   * @param {CanvasRenderingContext2D} board The graphic to draw on
   * @param {[number, number]} location The location at which to draw
   * @param {number} maxSize The maximum size of the image.
   *                         The image drawn should be proportional to mazSize to support scaling.
   * @param {Neighbors} neighboringEntities A collection of adjacent entities.
   * @memberof PowerPellet
   */
  draw(board: CanvasRenderingContext2D, location: [number, number], maxSize: number, neighboringEntities: Neighbors): void {
    if (performance.now() % 400 > 200) {
      const center = [
        location[0] + maxSize / 2,
        location[1] + maxSize / 2
      ];

      board.fillStyle = '#673AB7';
      board.beginPath();
      board.arc(center[0], center[1], maxSize / 2, 0, 2 * Math.PI);
      board.fill();
    }
  }
}

export default PowerPellet;
