import * as React from 'react';
import './App.css';
import Board from './Board';

enum GameState {
  TitleScreen,
  PlayingGame,
  GameOver,
  ListScores
}

interface Props {
}

interface State {
  gameState: GameState;
  score: number;
}

class App extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      gameState: GameState.TitleScreen,
      score: 0,
    };
  }

  render() {
    if (this.state.gameState === GameState.TitleScreen) {
      return (
        <div className="App">
          <title>
            Pac-Man
          </title>
          <div>
            <button>
              Start
            </button>
          </div>
        </div>
      );
    } else if (this.state.gameState === GameState.PlayingGame) {
      return (
        <div className="App">
          <div className="header">
            Score: {this.state.score}
          </div>
          <div className="center">
            <div className="board">
              <Board
                width="500 cm"
                height="500 cm"
                active={true}
                onScoreChange={(newScore: number) => this.setState({
                  score: newScore
                })}
                onGameFinish={() => {

                }}
              />
            </div>
          </div>
          <div className="footer">
            <button>
              Quit Game
            </button>
          </div>
        </div>
      );
    } else if (this.state.gameState === GameState.GameOver) {
      return (
        <div className="App">
          <div className="header">
            Game Over
          </div>
          <div className="center">
            <div>
              Your score is {this.state.score}
            </div>
            <div>
              Play Again?
            </div>
          </div>
          <div className="footer">
            <button>
              Play Again
            </button>
            <button>
              Quit
            </button>
          </div>
        </div>
      );
    } else if (this.state.gameState === GameState.ListScores) {
      return (
        <div className="App">
          <div className="header">
            Game Over
          </div>
          <div className="center">
            {/* TODO: Add scores here */}
          </div>
          <div className="footer">
            <button>
              Quit
            </button>
          </div>
        </div>
      );
    } else {
      // Note: This should never happen
      return null;
    }
  }
}

export default App;
