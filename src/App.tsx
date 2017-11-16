import * as React from 'react';
import './App.css';
import Board from './Board';

interface Props {
}

interface State {
  score: number
}

class App extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      score: 0
    }
  }

  render() {
    return (
      <div className="App">
        <div className="header">
          Score: {this.state.score}
        </div>
        <div className="board">
          <Board
            onScoreChange={(newScore: number) => this.setState({
              score: newScore
              })}
          />
        </div>
        <div className="footer" />
      </div>
    );
  }
}

export default App;
