import * as React from 'react';
import { List } from 'immutable';
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
  gameOver: boolean;
  score: number;
  finalScores: List<number>;
}

class App extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      gameState: GameState.TitleScreen,
      gameOver: false,
      score: 0,
      finalScores: List()
    };
  }

  render() {
    if (this.state.gameState === GameState.TitleScreen) {
      return (
        <div className="App title">
          <h1 className="header">
            Pac-Man
          </h1>
          <div>
            <button
              onClick={() => this.setState({
                  gameState: GameState.PlayingGame,
                  score: 0
              })}
            >
              Start
            </button>
          </div>
        </div>
      );
    } else if (this.state.gameState === GameState.PlayingGame) {
      return (
        <div className="App">
          <div className="header">
            <div>
              Score: {this.state.score}
            </div>
            <div>
              High: {Math.max(this.state.score, this.state.finalScores.max() || 0)}
            </div>
          </div>
          <div className="center">
            <div className="board">
              <Board
                width="11cm"
                height="13cm"
                active={!this.state.gameOver}
                onScoreChange={(newScore: number) => this.setState({
                  score: newScore
                })}
                onGameFinish={() => this.setState({
                  gameOver: true
                })}
              />
            </div>
          </div>
          <div className="footer">
            {this.state.gameOver &&
              <div>
              Game Over
              </div>
            }
            <button
              onClick={() => this.setState({
                gameState: GameState.GameOver
              })}
            >
              Quit Game
            </button>
          </div>
        </div>
      );
    } else if (this.state.gameState === GameState.GameOver) {
      return (
        <div className="App gameOver">
          <div className="header">
            Game Over
          </div>
          <div className="center">
            <div>
              Your score is {this.state.score}.
            </div>
            <div>
              Play Again?
            </div>
          </div>
          <div className="footer">
            <button
              onClick={() => this.setState((prevState) => ({
                finalScores: prevState.finalScores.push(prevState.score),
                score: 0,
                gameState: GameState.PlayingGame,
                gameOver: false
              }))}
            >
              Play Again
            </button>
            <button
              onClick={() => this.setState((prevState) => ({
                finalScores: prevState.finalScores.push(prevState.score),
                gameState: GameState.ListScores
              }))}
            >
              Quit
            </button>
          </div>
        </div>
      );
    } else if (this.state.gameState === GameState.ListScores) {
      return (
        <div className="App listScores">
          <div className="header">
            Game Over
          </div>
          <div className="center">
            <div>
              Your scores:
            </div>
            <ol className="scoreList">
              {this.state.finalScores.map((score, index) => (
                <li key={index}>
                  Game {index !== undefined ? index + 1 : '?'}: {score}
                </li>
              ))}
            </ol>
            <div>
              High: {this.state.finalScores.max()}
            </div>
          </div>
          <div className="footer">
            <button
              onClick={() => this.setState({
                score: 0,
                gameState: GameState.PlayingGame,
                gameOver: false
              })}
            >
              Play Again
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
