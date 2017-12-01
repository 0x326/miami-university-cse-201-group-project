import MovableEntity, { Direction } from './MovableEntity';
import Drawable from './Drawable';
import KeyboardListener from './KeyboardListener';

// Pacman's animation sprites
const images = {
  [Direction.North]: {
    full: require('./Images/Pacman_fullyopen_up.png'),
    half: require('./Images/Pacman_halfopen_up.png')
  },
  [Direction.South]: {
    full: require('./Images/Pacman_fullyopen_down.png'),
    half: require('./Images/Pacman_halfopen_down.png')
  },
  [Direction.East]: {
    full: require('./Images/Pacman_fullyopen_right.png'),
    half: require('./Images/Pacman_halfopen_right.png')
  },
  [Direction.West]: {
    full: require('./Images/Pacman_fullyopen_left.png'),
    half: require('./Images/Pacman_halfopen_left.png')
  }
};
const Closed = require('./Images/Pacman_closed.png');

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
  private timeMoving: number = 0;

  /**
   * Creates a MovableEntity
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number], keyboardListener: KeyboardListener) {
    super(initialLocation);
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
    // determines the sprite to be drawn
    const f = (x: number) => Math.abs((x / 10) % 2 - 1);
    const sprites = images[this.direction];

    if (f(this.timeMoving) > 0.6) {
      this.sprite.src = sprites.full;
    } else if (f(this.timeMoving) > 0.3) {
      this.sprite.src = sprites.half;
    } else {
      this.sprite.src = Closed;
    }

    // animation stops when PacMan stops
    if (!this.stopped) {
      this.timeMoving++;
    }
    if (this.timeMoving === 20) {
      this.timeMoving = 0;
    }

    super.draw(board, maxSize);
  }

  chooseDirection(map: Drawable[][]): void {
    // Do nothing
    // Direction is decided by keyboard
  }
}

export default PacMan;
