import MovableEntity, { Direction } from './MovableEntity';
import Drawable from './Drawable';
import { Listener as KeypressListener } from 'keypress.js';

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

    stopped: boolean = true;
    speed: number = 1;

    /**
     * Creates a MovableEntity
     *
     * @param initialLocation The starting location of this entity.
     */
    constructor(initialLocation: [number, number], keyboardListener: KeypressListener) {
        super(initialLocation);
        this.stopped
        this.direction = Direction.North;
        for (let key in PacMan.KeyMap) {
            keyboardListener.register_combo({
                keys: key,
                on_keydown: () => {
                    this.direction = PacMan.KeyMap[key];
                    this.stopped = false;
                },
                on_keyup: () => this.stopped = true
            })
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

    /**
     * Gives this MovableEntity a chance to move.
     * The move should be proportional to the amount of time passed from the previous move.
     *
     * @param timePassed The amount of elapsed time from the previous move.
     *                   This time may be subject to a maximum value at the discretion of the callee.
     * @param map        The game board map.  It is not to be modified.  Use it to detect collision and honor boundaries.
     */
    move(timePassed: number, map: Drawable[][]): void {
        if (this.stopped) {
            return;
        }

        let xIncrement = 0, yIncrement = 0;
        if (this.direction == Direction.North) {
            yIncrement = this.speed * timePassed;
        } else if (this.direction == Direction.West) {
            xIncrement = - this.speed * timePassed;
        } else if (this.direction == Direction.South) {
            yIncrement = - this.speed * timePassed;
        } else {
            xIncrement = this.speed * timePassed;
        }
        this.logicalLocation = [this.logicalLocation[0] + xIncrement, this.logicalLocation[1] + yIncrement];
    }
}

export default PacMan;
