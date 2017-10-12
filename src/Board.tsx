import * as React from 'react';

/**
 * Course: CSE 201 A
 * Instructor: Dr. Sobel
 * <p>
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class Board extends React.Component {
    stationaryEntities: Drawable[][];
    pacMan: PacMan;
    ghosts: Ghost[];

    gameTimer: Timer;
    gameEndCallback: LambdaFunction;

    constructor() {
        super();
        stationaryEntities = new Drawable[27][31];  // 27 X 31 board
        // TODO: Populate board
        pacMan = new PacMan(new Point2D.Double(1, 1));
        ghosts = new Ghost[]{
            new Blinky(new Point2D.Double(14, 19)),
            new Inky(new Point2D.Double(10, 16)),
            new Pinky(new Point2D.Double(14, 16)),
            new Clyde(new Point2D.Double(18, 16))
        };

    }

    /**
     * Starts the game.  The game is finished when the callback is called.
     *
     * @param gameTickLength The length of each game tick
     * @param callback A lambda function to call when the game has ended.
     */
    startGame(int gameTickLength, LambdaFunction callback): void {
        gameEndCallback = callback;
        gameTimer = new Timer(gameTickLength, (ActionEvent evt) -> updateGameState());
    }

    /**
     * Gets the current score of the game.
     *
     * @return The score of the game
     */
    getScore(): int {
        return 0;
    }

    // TODO: Add time-since-last-update-parameter
    updateGameState(): void {
        // TODO: Move Pac-Man
        // TODO: Move ghosts
        // Repaint board
        repaint();

        if (false) { // TODO: Replace with 'when game has ended'
            gameTimer.stop();
            gameEndCallback.call();
        }
    }
}

export default Board;
