import MovableEntity, { Direction } from './MovableEntity';
import Drawable from './Drawable';
import KeyboardListener from './KeyboardListener';

// Pacman's animation sprites
const HalfOpenRight = require('./Pacman_halfopen_right.png');
const HalfOpenLeft = require('./Pacman_halfopen_left.png');
const HalfOpenUp = require('./Pacman_halfopen_up.png');
const HalfOpenDown = require('./Pacman_halfopen_down.png');
const FullyOpenRight = require('./Pacman_fullyopen_right.png');
const FullyOpenLeft = require('./Pacman_fullyopen_left.png');
const FullyOpenUp = require('./Pacman_fullyopen_up.png');
const FullyOpenDown = require('./Pacman_fullyopen_down.png');
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
  private frameCount: number;
  // instance variable, initializes the sprite
  private sprite = new Image();

  /**
   * Creates a MovableEntity
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number], keyboardListener: KeyboardListener) {
    super(initialLocation);
    this.frameCount = 0;
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

    // determines the sprite to be drawn
    if (this.direction === Direction.North) {
      if (this.frameCount <= 5) {
        this.sprite.src = HalfOpenUp;
      } else if (this.frameCount <= 10) {
        this.sprite.src = FullyOpenUp;
      } else if (this.frameCount <= 15) {
        this.sprite.src = HalfOpenUp;
      } else {
        this.sprite.src = Closed;
      }
    } else if (this.direction === Direction.East) {
      if (this.frameCount <= 5) {
        this.sprite.src = HalfOpenRight;
      } else if (this.frameCount <= 10) {
        this.sprite.src = FullyOpenRight;
      } else if (this.frameCount <= 15) {
        this.sprite.src = HalfOpenRight;
      } else {
        this.sprite.src = Closed;
      }
    } else if (this.direction === Direction.South) {
      if (this.frameCount <= 5) {
        this.sprite.src = HalfOpenDown;
      } else if (this.frameCount <= 10) {
        this.sprite.src = FullyOpenDown;
      } else if (this.frameCount <= 15) {
        this.sprite.src = HalfOpenDown;
      } else {
        this.sprite.src = Closed;
      }
    } else {
      if (this.frameCount <= 5) {
        this.sprite.src = HalfOpenLeft;
      } else if (this.frameCount <= 10) {
        this.sprite.src = FullyOpenLeft;
      } else if (this.frameCount <= 15) {
        this.sprite.src = HalfOpenLeft;
      } else {
        this.sprite.src = Closed;
      }
    }

    // animation stops when PacMan stops
    if (!this.stopped) {
      this.frameCount++;
    }
    if (this.frameCount === 20) {
      this.frameCount = 0;
    }
    // draws the sprite
    board.drawImage(this.sprite, (drawLocation[0] - (maxSize / 2)), (drawLocation[1] - (maxSize / 2)), maxSize, maxSize);
  }

  chooseDirection(map: Drawable[][]): void {
    // Do nothing
    // Direction is decided by keyboard
  }
}

export default PacMan;
