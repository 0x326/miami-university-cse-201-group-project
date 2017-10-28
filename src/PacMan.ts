import MovableEntity, { Direction } from './MovableEntity';
import Drawable from './Drawable';
import KeyboardListener from './KeyboardListener';

/**
 * Course: CSE 201 A
 * Instructor: Dr. Sobel
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
    }

    /**
     * Creates a MovableEntity
     *
     * @param initialLocation The starting location of this entity.
     */
    constructor(initialLocation: [number, number], keyboardListener: KeyboardListener) {
        super(initialLocation);
        this.stopped
        this.direction = Direction.North;
        for (let key in PacMan.KeyMap) {
            keyboardListener.registerKey(key, (isPressed: boolean) => {
                if (isPressed) {
                    this.direction = PacMan.KeyMap[key];
                    this.stopped = false;
                } else {
                    this.stopped = true;
                }
            });
        }
    }

    /**
     * Gets the current logical location of this MovableEntity.
     *
     * @return The current location
     */
    getLogicalLocation(): [number, number] {
        return [0, 0];
    }

    chooseDirection(map: Drawable[][]): void {
        // Do nothing
        // Direction is decided by keyboard
    }
}

export default PacMan;
