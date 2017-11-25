/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class KeyboardListener {
  registeredKeys: Map<string, (isPressed: boolean) => void>;
  private target: EventTarget;
  private keyDownHandler: (keypressEvent: KeyboardEvent) => void;
  private keyUpHandler: (keypressEvent: KeyboardEvent) => void;

  /**
   * Creates a MovableEntity
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(target: EventTarget) {
    this.target = target;
    this.registeredKeys = new Map();
    this.keyDownHandler = (keypressEvent: KeyboardEvent) => {
      let key = keypressEvent.key;
      if (this.registeredKeys[key]) {
        this.registeredKeys[key](true);
      }
    }
    this.keyUpHandler = (keypressEvent: KeyboardEvent) => {
      let key = keypressEvent.key;
      if (this.registeredKeys[key]) {
        this.registeredKeys[key](false);
      }
    }
    target.addEventListener('keydown', this.keyDownHandler);
    target.addEventListener('keyup', this.keyUpHandler);
  }

  registerKey(key: string, callback: (isPressed: boolean) => void): void {
    this.registeredKeys[key] = callback;
  }

  unregisterKey(key: string) {
    this.registeredKeys.delete(key);
  }

  detachFromTarget(): void {
    this.target.removeEventListener('keydown', this.keyDownHandler);
    this.target.removeEventListener('keyup', this.keyUpHandler);
  }
}

export default KeyboardListener;
