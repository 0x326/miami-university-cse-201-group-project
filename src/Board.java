import javax.swing.*;

/**
 * Course: CSE 201 A
 * Instructor: Dr. Sobel
 * <p>
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
public class Board extends JPanel {
    private Drawable[][] stationaryEntities;
    private PacMan pacMan;
    private Ghost[] ghosts;

    public Board(int gameTickLength) {
        pacMan = new PacMan();
        ghosts = new Ghost[]{new Blinky(), new Clyde(), new Inky(), new Pinky()};
    }

    /**
     * Starts the game.  The game is finished when the callback is called.
     *
     * @param callback A lambda function to call when the game has ended.
     */
    public void startGame(LambdaFunction callback) {

        // Game has ended
        callback.call();
    }

    /**
     * Gets the current score of the game.
     *
     * @return The score of the game
     */
    public int getScore() {
        return 0;
    }
}
