import Drawable, { Neighbors } from './Drawable';

/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class PowerPellet implements Drawable {
  // used for determining what animation sprite to display
  private frameCount = 0;

  /**
   * Draw this object on the graphic at the given location.
   *
   * @param board         The graphic to draw on
   * @param location      The location at which to draw
   * @param maxSize       The maximum size of the image.
   *              The image drawn should be proportional to mazSize to support scaling.
   * @param neighboringEntities A collection of adjacent entities.
   */
  draw(board: CanvasRenderingContext2D, location: [number, number], maxSize: number, neighboringEntities: Neighbors): void {

    if (this.frameCount <= 10) {
      board.fillStyle = '#673AB7';
      board.beginPath();
      board.arc(location[0], location[1], maxSize / 2, 0, 2 * Math.PI);
      board.fill();
    } else {
      board.clearRect(location[0], location[1], maxSize / 2, 0);
    }
    this.frameCount++;
    if (this.frameCount === 20) {
      this.frameCount = 0;
    }
  }
}

export default PowerPellet;
