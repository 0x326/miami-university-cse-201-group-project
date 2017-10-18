/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
interface Drawable {
    /**
     * Draw this object on the graphic at the given location.
     *
     * @param board               The graphic to draw on
     * @param location            The location at which to draw
     * @param maxSize             The maximum size of the image.
     *                            The image drawn should be proportional to mazSize to support scaling.
     * @param neighboringEntities A collection of adjacent entities.
     *                            Use this if the image depends on its surroundings
     */
    draw(board: CanvasRenderingContext2D, location: [number, number], maxSize: number, neighboringEntities: Drawable[]): void;
}

export default Drawable;
