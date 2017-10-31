import * as React from 'react';
import PacMan from './PacMan';
import Ghost from './Ghost';
import Blinky from './Blinky';
import Inky from './Inky';
import Pinky from './Pinky';
import Clyde from './Clyde';
import Drawable, { Neighbors } from './Drawable';
import Wall from './Wall';
import Pellet from './Pellet';
import PowerPellet from './PowerPellet';
import {createMultiDimensionalArray} from './lib';
import KeyboardListener from './KeyboardListener';

const scoringTable = {
    // TODO: Adjust scores
    'pellet': 1,
    'powerPellet': 2,
    'ghost': 5
};

const ghostRespawningPoint = [14, 16];

interface Props {
    width: number;
    height: number;
    onGameFinish: () => void;
    active: boolean;
}

/**
 * Course: CSE 201 A
 * Instructor: Dr. Sobel
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class Board extends React.Component<Props> {
    // 27 X 31 board
    static logicalColumns = 27;
    static logicalRows = 31;

    stationaryEntities: Drawable[][];
    pacMan: PacMan;
    ghosts: Ghost[];

    timeOfLastUpdate: number = 0;

    score: number;
    gameActive: boolean = false;
    gameFinished: boolean = false;

    canvasContext: CanvasRenderingContext2D
    keyboardListener: KeyboardListener;

    constructor() {
        super();
        this.keyboardListener = new KeyboardListener(document);
        this.stationaryEntities = createMultiDimensionalArray([Board.logicalColumns, Board.logicalRows])
        // TODO: Populate board
        this.pacMan = new PacMan([14, 22], this.keyboardListener);
        this.ghosts = [
            new Blinky([14, 19]),
            new Inky([10, 16]),
            new Pinky([14, 16]),
            new Clyde([18, 16])
        ];
        this.score = 0;
        this.updateGameState = this.updateGameState.bind(this);
    }

    render() {
        return (
            <canvas ref={(elem) => {
                if (elem !== null) {
                    let context = elem.getContext('2d');
                    if (context !== null) {
                        this.canvasContext = context;
                    }
                }
            }} />
        )
    }

    componentDidMount() {
        this.gameActive = this.props.active;
        if (this.gameActive) {
            window.requestAnimationFrame(this.updateGameState);
        }
    }

    componentDidUpdate(prevProps: Props, prevState: {}) {
        if (prevProps.active === true && !this.gameActive) {
            this.gameActive = true;
            window.requestAnimationFrame(this.updateGameState);
        } else if (prevProps.active === false) {
            this.gameActive = false;
        }
    }

    componentWillUnmount() {
        this.gameActive = false;
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
    updateGameState(currentTime: number): void {
        if (this.timeOfLastUpdate !== 0) {
            let elapsedTime = currentTime - this.timeOfLastUpdate;

            this.pacMan.move(elapsedTime, this.stationaryEntities);
            for (let ghost of this.ghosts) {
                ghost.move(elapsedTime, this.stationaryEntities);
            }

            this.detectCollisions();
            this.repaintCanvas();
            // TODO: Determine when the game has ended
        }
        this.timeOfLastUpdate = currentTime;
        if (this.gameFinished) {
            this.props.onGameFinish();
        } else if (this.gameActive) {
            window.requestAnimationFrame(this.updateGameState);
        }
    }

    detectCollisions(): void {
        let [x, y] = this.pacMan.getLogicalLocation();

        let stationaryItem = this.stationaryEntities[x][y];
        if (stationaryItem instanceof Wall) {
            // TODO: Add correction logic
            throw 'pacMan is on a wall';
        }
        else if (stationaryItem instanceof Pellet) {
            this.score += scoringTable.pellet;
            delete this.stationaryEntities[x][y];
        }
        else if (stationaryItem instanceof PowerPellet) {
            this.score += scoringTable.powerPellet;
            delete this.stationaryEntities[x][y];
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

    repaintCanvas(): void {
        this.canvasContext.clearRect(0, 0, this.props.width, this.props.height);

        let boundingBoxSize = Math.min(this.props.width / Board.logicalColumns, this.props.height / Board.logicalRows);
        for (let column in this.stationaryEntities) {
            for (let row in this.stationaryEntities[column]) {
                // Type cast
                let columnNumber = Number(column), rowNumber = Number(row);

                let item = this.stationaryEntities[columnNumber][rowNumber];
                // Create representation of surroundings
                let neighbors: Neighbors = {
                    topLeft: this.stationaryEntities[columnNumber - 1][rowNumber + 1],
                    top: this.stationaryEntities[columnNumber][rowNumber + 1],
                    topRight: this.stationaryEntities[columnNumber + 1][rowNumber + 1],

                    left: this.stationaryEntities[columnNumber - 1][rowNumber],
                    right: this.stationaryEntities[columnNumber + 1][rowNumber],

                    bottomLeft: this.stationaryEntities[columnNumber - 1][rowNumber - 1],
                    bottom: this.stationaryEntities[columnNumber][rowNumber - 1],
                    bottomRight: this.stationaryEntities[columnNumber + 1][rowNumber - 1],
                };
                item.draw(this.canvasContext, [columnNumber, rowNumber], boundingBoxSize, neighbors);
            }
        }
        for (let ghost of this.ghosts) {
            ghost.draw(this.canvasContext, boundingBoxSize);
        }
        this.pacMan.draw(this.canvasContext, boundingBoxSize);
    }
}

export default Board;
