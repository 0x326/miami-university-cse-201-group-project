import { Map } from 'immutable';
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
 * Represents Pac-Man
 *
 * @author John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly
 * @class PacMan
 * @extends {MovableEntity}
 */
class PacMan extends MovableEntity {

  static KeyMap = {
    'w': Direction.North,
    'a': Direction.West,
    's': Direction.South,
    'd': Direction.East
  };

  private keyboard: KeyboardListener;
  private keyListeners: Map<string, (isPressed: boolean) => void> = Map();
  // used for determining what animation sprite to display
  private timeWhenStartedMoving: number = performance.now();

  /**
   * Creates a MovableEntity
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number], keyboardListener: KeyboardListener) {
    super(initialLocation);
    this.keyboard = keyboardListener;
    for (let key in PacMan.KeyMap) {
      this.keyListeners = this.keyListeners.set(key, (isPressed: boolean) => {
        if (PacMan.KeyMap[key] === this.direction) {
          this.stopped = !isPressed;
        } else if (isPressed) {
          this.direction = PacMan.KeyMap[key];
          this.stopped = false;
          this.timeWhenStartedMoving = performance.now();
        }
      });
    }
    this.sprite.src = images[this.direction].half;
  }

  /**
   * Draw this object on the graphic at the given location.
   *
   * @param board         The graphic to draw on
   * @param maxSize       The maximum size of the image.
   *              The image drawn should be proportional to mazSize to support scaling.
   */
  draw(board: CanvasRenderingContext2D, maxSize: number) {
    // animation stops when PacMan stops
    if (!this.stopped) {
      // determines the sprite to be drawn
      const f = (x: number) => Math.abs((x / 100) % 2 - 1);
      const sprites = images[this.direction];
      const timeMoving = performance.now() - this.timeWhenStartedMoving;

      if (f(timeMoving) > 0.6) {
        this.sprite.src = sprites.full;
      } else if (f(timeMoving) > 0.3) {
        this.sprite.src = sprites.half;
      } else {
        this.sprite.src = Closed;
      }

    }
    super.draw(board, maxSize);
  }

  chooseDirection(map: Drawable[][]): void {
    // Do nothing
    // Direction is decided by keyboard
  }

  mount(): void {
    // tslint:disable:no-any
    for (const [key, callback] of this.keyListeners.entries() as any) {
      this.keyboard.registerKey(key, callback);
    }
  }

  unmount(): void {
    // tslint:disable:no-any
    for (const key of this.keyListeners.keys() as any) {
      this.keyboard.unregisterKey(key);
    }
  }
}

export default PacMan;
