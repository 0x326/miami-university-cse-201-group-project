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
  private target: EventTarget | undefined = undefined;
  private keyDownHandler: (keypressEvent: KeyboardEvent) => void;
  private keyUpHandler: (keypressEvent: KeyboardEvent) => void;

  constructor() {
    this.registeredKeys = new Map();
    this.keyDownHandler = (keypressEvent: KeyboardEvent) => {
      let key = keypressEvent.key;
      if (this.registeredKeys[key]) {
        keypressEvent.preventDefault();
        this.registeredKeys[key](true);
      }
    }
    this.keyUpHandler = (keypressEvent: KeyboardEvent) => {
      let key = keypressEvent.key;
      if (this.registeredKeys[key]) {
        keypressEvent.preventDefault();
        this.registeredKeys[key](false);
      }
    }
  }

  registerKey(key: string, callback: (isPressed: boolean) => void): void {
    this.registeredKeys[key] = callback;
  }

  unregisterKey(key: string) {
    this.registeredKeys.delete(key);
  }

  attach(target: EventTarget): void {
    if (this.target !== undefined) {
      // Detach from old target first
      this.detach();
    }

    this.target = target;
    target.addEventListener('keydown', this.keyDownHandler);
    target.addEventListener('keyup', this.keyUpHandler);
  }

  detach(): void {
    if (this.target !== undefined) {
      this.target.removeEventListener('keydown', this.keyDownHandler);
      this.target.removeEventListener('keyup', this.keyUpHandler);
    }
  }
}

export default KeyboardListener;
