/**
 * A class for managing keyboard event listeners
 *
 * @author John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly
 * @class KeyboardListener
 */
class KeyboardListener {
  registeredKeys: Map<string, (isPressed: boolean) => void>;
  private target: EventTarget | undefined = undefined;
  private keyDownHandler: (keypressEvent: KeyboardEvent) => void;
  private keyUpHandler: (keypressEvent: KeyboardEvent) => void;

  /**
   * Creates an instance of KeyboardListener.
   * @memberof KeyboardListener
   */
  constructor() {
    this.registeredKeys = new Map();
    this.keyDownHandler = (keypressEvent: KeyboardEvent) => {
      let key = keypressEvent.key;
      if (this.registeredKeys[key]) {
        keypressEvent.preventDefault();
        this.registeredKeys[key](true);
      }
    };
    this.keyUpHandler = (keypressEvent: KeyboardEvent) => {
      let key = keypressEvent.key;
      if (this.registeredKeys[key]) {
        keypressEvent.preventDefault();
        this.registeredKeys[key](false);
      }
    };
  }

  /**
   * Registers the callback with the key
   *
   * @param {string} key The key to associate
   * @param {(isPressed: boolean) => void} callback The callback to call when it is pressed
   * @memberof KeyboardListener
   */
  registerKey(key: string, callback: (isPressed: boolean) => void): void {
    this.registeredKeys[key] = callback;
  }

  /**
   * Unregisters a key
   *
   * @param {string} key The key to disassociate
   * @memberof KeyboardListener
   */
  unregisterKey(key: string) {
    this.registeredKeys.delete(key);
  }

  /**
   * Attaches this object to the target
   *
   * @param {EventTarget} target
   * @memberof KeyboardListener
   */
  attach(target: EventTarget): void {
    if (this.target !== undefined) {
      // Detach from old target first
      this.detach();
    }

    this.target = target;
    target.addEventListener('keydown', this.keyDownHandler);
    target.addEventListener('keyup', this.keyUpHandler);
  }

  /**
   * Detaches this object from the attached target
   *
   * @memberof KeyboardListener
   */
  detach(): void {
    if (this.target !== undefined) {
      this.target.removeEventListener('keydown', this.keyDownHandler);
      this.target.removeEventListener('keyup', this.keyUpHandler);
    }
  }
}

export default KeyboardListener;
