import javax.swing.*;

interface LambdaFunction {
    void call();
}

public class PacManMain extends JFrame {
    /**
     * Instantiates a this PacManMain object and starts the Pac-Man UI.
     *
     * @param args Commandline arguments
     */
    public static void main(String[] args) {
        JFrame window = new PacManMain();
        window.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        window.setVisible(true);
    }
}
