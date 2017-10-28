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

    /**
     * Creates a MovableEntity
     *
     * @param initialLocation The starting location of this entity.
     */
    constructor(target: EventTarget) {
        this.registeredKeys = new Map();
        target.addEventListener('keydown', (keypressEvent: KeyboardEvent) => {
            let key = keypressEvent.key;
            if (this.registeredKeys[key]) {
                this.registeredKeys[key](true);
            }
        });
        target.addEventListener('keyup', (keypressEvent: KeyboardEvent) => {
            let key = keypressEvent.key;
            if (this.registeredKeys[key]) {
                this.registeredKeys[key](false);
            }
        });
    }

    registerKey(key: string, callback: (isPressed: boolean) => void): void {
        this.registeredKeys[key] = callback;
    }

    unregisterKey(key: string) {
        this.registeredKeys.delete(key);
    }
}

export default KeyboardListener;
