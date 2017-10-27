import * as React from 'react';
import PacMan from './PacMan';
import Ghost from './Ghost';
import Blinky from './Blinky';
import Inky from './Inky';
import Pinky from './Pinky';
import Clyde from './Clyde';
import Drawable from './Drawable';
import Wall from './Wall';
import Pellet from './Pellet';
import PowerPellet from './PowerPellet';
import {createMultiDimensionalArray} from './lib';

const scoringTable = {
    // TODO: Adjust scores
    'pellet': 1,
    'powerPellet': 2,
    'ghost': 5
};

const ghostRespawningPoint = [14, 16];

/**
 * Course: CSE 201 A
 * Instructor: Dr. Sobel
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class Board extends React.Component {
    stationaryEntities: Drawable[][];
    pacMan: PacMan;
    ghosts: Ghost[];

    score: number;
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
        this.score = 0;
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
        this.detectCollisions();
        // TODO: Repaint board
        // TODO: Determine when the game has ended

        if (this.gameFinished) {
            this.gameEndCallback();
        }
        window.requestAnimationFrame(this.updateGameState)
    }

    detectCollisions(): void {
        let [x, y] = this.pacMan.getLogicalLocation();

        let stationaryItem = this.stationaryEntities[x][y];
        if (stationaryItem instanceof Wall) {
            throw 'pacMan is on a wall';
        }
        else if (stationaryItem instanceof Pellet) {
            this.score += scoringTable.pellet;
            this.stationaryEntities[x][y];  // TODO: Replace item
        }
        else if (stationaryItem instanceof PowerPellet) {
            this.score += scoringTable.powerPellet;
            this.stationaryEntities[x][y];  // TODO: Replace item
        }

        for (let ghost of this.ghosts) {
            let [ghostX, ghostY] = ghost.getLogicalLocation();
            if (x === ghostX && y === ghostY) {
                if (ghost.isVunerable()) {
                    ghost.logicalLocation[0] = ghostRespawningPoint[0];
                    ghost.logicalLocation[1] = ghostRespawningPoint[1];
                    ghost.makeDangerous();
                    this.score += scoringTable.ghost;
                }
                else {
                    this.gameFinished = true;
                    break;
                }
            }
        }
    }
}

export default Board;
