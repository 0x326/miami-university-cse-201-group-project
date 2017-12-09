interface Neighbors {
  topLeft: Drawable | undefined;
  top: Drawable | undefined;
  topRight: Drawable | undefined;

  left: Drawable | undefined;
  right: Drawable | undefined;

  bottomLeft: Drawable | undefined;
  bottom: Drawable | undefined;
  bottomRight: Drawable | undefined;
}

/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly
 */
interface Drawable {
  /**
   * Draw this object on the graphic at the given location.
   *
   * @param board         The graphic to draw on
   * @param location      The location at which to draw
   * @param maxSize       The maximum size of the image.
   *              The image drawn should be proportional to mazSize to support scaling.
   * @param neighboringEntities A collection of adjacent entities.
   *              Use this if the image depends on its surroundings
   */
  draw(board: CanvasRenderingContext2D, location: [number, number], maxSize: number, neighboringEntities: Neighbors): void;
}

export default Drawable;
export { Neighbors };
