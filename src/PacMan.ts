import MovableEntity, { Direction } from './MovableEntity';
import Drawable from './Drawable';
import KeyboardListener from './KeyboardListener';

// Pacman's animation sprites

// Trying to only use three instead of nine
const HalfOpen = require('./Pacman_halfopen_right.png');
// const HalfOpenLeft = require('./Pacman_halfopen_left.png');
//const HalfOpenUp = require('./Pacman_halfopen_up.png');
// const HalfOpenDown = require('./Pacman_halfopen_down.png');
const FullyOpen = require('./Pacman_fullyopen_right.png');
// const FullyOpenLeft = require('./Pacman_fullyopen_left.png');
//const FullyOpenUp = require('./Pacman_fullyopen_up.png');
// const FullyOpenDown = require('./Pacman_fullyopen_down.png');
const Closed = require('./Pacman_closed.png');

/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class PacMan extends MovableEntity {

  static KeyMap = {
    'w': Direction.North,
    'a': Direction.West,
    's': Direction.South,
    'd': Direction.East
  };

    // used for determining what animation sprite to display
    static frameCount : number;
    // instance variable, initializes the sprite
    private sprite = new Image();

  /**
   * Creates a MovableEntity
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number], keyboardListener: KeyboardListener) {
    super(initialLocation);
    PacMan.frameCount = 0;
    this.direction = Direction.North;
    for (let key in PacMan.KeyMap) {
      keyboardListener.registerKey(key, (isPressed: boolean) => {
        if (PacMan.KeyMap[key] === this.direction) {
          this.stopped = !isPressed;
        } else if (isPressed) {
          this.direction = PacMan.KeyMap[key];
          this.stopped = false;
        }
      });
    }
  }

/**
   * Draw this object on the graphic at the given location.
   *
   * @param board         The graphic to draw on
   * @param maxSize       The maximum size of the image.
   *              The image drawn should be proportional to mazSize to support scaling.
   */
  draw(board: CanvasRenderingContext2D, maxSize: number) {
    // super.draw(board, maxSize);
    let drawLocation: [number, number] = [
      this.logicalLocation[0] * maxSize - maxSize,
      this.logicalLocation[1] * maxSize - maxSize
    ];
      
      
      if (PacMan.frameCount <= 5) {
          this.sprite.src = HalfOpen;
      }
      else if (PacMan.frameCount <= 10) {
          this.sprite.src = FullyOpen;

      }
      else if (PacMan.frameCount <= 15) {
          this.sprite.src = HalfOpen;
      }
      else {
          this.sprite.src = Closed;
      }
      
      /* Not sure how to rotate sprite
      if (this.direction === Direction.North) {
          this.sprite.style.transform = 'initial';
          this.sprite.style.transform = 'rotate(90deg)';
      }
      else if (this.direction === Direction.South) {
          this.sprite.style.transform = 'initial';
          this.sprite.style.transform = 'rotate(270deg)';
      }
      else if (this.direction === Direction.West) {
          this.sprite.style.transform = 'initial';
          this.sprite.style.transform = 'rotate(180deg)';
      }
      */
                   
      if (!this.stopped) {
          PacMan.frameCount++;
      }
      if (PacMan.frameCount === 20) {
          PacMan.frameCount = 0;
      }
      
    board.drawImage(this.sprite, (drawLocation[0] - (maxSize / 2)), (drawLocation[1] - (maxSize / 2)), maxSize, maxSize);
  }

  chooseDirection(map: Drawable[][]): void {
    // Do nothing
    // Direction is decided by keyboard
  }
}

export default PacMan;
