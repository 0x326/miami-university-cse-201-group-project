import Ghost from './Ghost';
import Drawable from './Drawable';
import { Direction } from './MovableEntity';

const BlinkyImage = require('./Blinky.png');

/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class Blinky extends Ghost {
    // instance variable, initializes the sprite
    sprite = new Image(); 
  /**
   * Creates a Blinky object
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number]) {
    super(initialLocation);
  }
    
  /**
   * Draw this object on the graphic at the given location.
   *
   * @param board         The graphic to draw on
   * @param maxSize       The maximum size of the image.
   *              The image drawn should be proportional to mazSize to support scaling.
   */
  draw(board: CanvasRenderingContext2D, maxSize: number) {
    //super.draw(board, maxSize);
    let drawLocation: [number, number] = [
      this.logicalLocation[0] * maxSize - maxSize,
      this.logicalLocation[1] * maxSize - maxSize
    ];
      //I'll fix this once I get the sprite working
      /*
    switch (this.state) {
      case super.isVunerable():
        board.fillStyle = '#03A9F4';
        break;

      case super.isVulnerableBlinking():
        board.fillStyle = '#FF9800';
        break;

      default:
        board.fillStyle = '#F44336';
        break;
        */
      
      //image is not being loaded because reasons
    this.sprite.src = BlinkyImage;
    board.drawImage(this.sprite, drawLocation[0], drawLocation[1], maxSize, maxSize);
      
      //image is meant to replace drawn shapes
    /*
    board.beginPath();
    board.arc(drawLocation[0], drawLocation[1], maxSize / 3, 0, 2 * Math.PI);
    board.fill();
    */
    
  }

  chooseDirection(map: Drawable[][]): void {
    const options = this.getMovementOptions(map);
    if (options[this.direction] === false) {
      if (options[Direction.North] === true) {
        this.direction = Direction.North;
      } else if (options[Direction.West] === true) {
        this.direction = Direction.West;
      } else if (options[Direction.South] === true) {
        this.direction = Direction.South;
      } else {
        this.direction = Direction.East;
      }
    }
  }
}

export default Blinky;