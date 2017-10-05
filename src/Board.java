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

    private Timer gameTimer;

    public Board(int gameTickLength) {
        stationaryEntities = new Drawable[27][31];  // 27 X 31 board
        // TODO: Populate board
        pacMan = new PacMan(new Point2D.Double(1, 1));
        ghosts = new Ghost[]{
            new Blinky(new Point2D.Double(14, 19)),
            new Inky(new Point2D.Double(10, 16)),
            new Pinky(new Point2D.Double(14, 16)),
            new Clyde(new Point2D.Double(18, 16))
        };

        gameTimer = new Timer(gameTickLength, (ActionEvent evt) -> updateGameState());
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

    private void updateGameState() {
        // TODO: Move Pac-Man
        // TODO: Move ghosts
        // Repaint board
        repaint();
    }
}
