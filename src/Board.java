import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.geom.Point2D;

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

    private Timer gameTimer = null;
    private LambdaFunction gameEndCallback;

    public Board() {
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
    public void startGame(int gameTickLength, LambdaFunction callback) {
        gameEndCallback = callback;
        gameTimer = new Timer(gameTickLength, (ActionEvent evt) -> updateGameState());
    }

    /**
     * Gets the current score of the game.
     *
     * @return The score of the game
     */
    public int getScore() {
        return 0;
    }

    private void updateGameState() {
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
