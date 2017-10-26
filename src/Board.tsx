import * as React from 'react';
import PacMan from './PacMan';
import Ghost from './Ghost';
import Blinky from './Blinky';
import Inky from './Inky';
import Pinky from './Pinky';
import Clyde from './Clyde';
import Drawable from './Drawable';
import {createMultiDimensionalArray} from './lib';

interface Props {
    onScoreChange: (newScore: number) => void
}

interface State {
}

/**
 * Course: CSE 201 A
 * Instructor: Dr. Sobel
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class Board extends React.Component<Props, State> {
    stationaryEntities: Drawable[][];
    pacMan: PacMan;
    ghosts: Ghost[];

    gameFinished: boolean = false;
    gameEndCallback: () => void;

    constructor() {
        super();
        this.stationaryEntities = createMultiDimensionalArray([27, 31], (position) => null) // 27 X 31 board
        // TODO: Populate board
        this.pacMan = new PacMan([1, 1]);
        this.ghosts = [
            new Blinky([14, 19]),
            new Inky([10, 16]),
            new Pinky([14, 16]),
            new Clyde([18, 16])
        ];

    }

    render() {
        return (
            <canvas ref="canvas" />
        );
    }

    /**
     * Starts the game.  The game is finished when the callback is called.
     *
     * @param gameTickLength The length of each game tick
     * @param callback A lambda function to call when the game has ended.
     */
    startGame(gameTickLength: number, callback: () => void): void {
        this.gameEndCallback = callback;
        window.requestAnimationFrame(this.updateGameState)
    }

    /**
     * Gets the current score of the game.
     *
     * @return The score of the game
     */
    getScore(): number {
        return 0;
    }

    // TODO: Add time-since-last-update-parameter
    updateGameState(): void {
        // TODO: Move Pac-Man
        // TODO: Move ghosts
        // TODO: Repaint board
        // TODO: Determine when the game has ended

        if (this.gameFinished) {
            this.gameEndCallback();
        }
        window.requestAnimationFrame(this.updateGameState)
    }
}

export default Board;
