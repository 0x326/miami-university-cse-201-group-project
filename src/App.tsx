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
        <div>
          Score: {this.state.score}
        </div>
        <Board onScoreChange={(newScore: number) => this.setState({
          score: newScore
          })} />
      </div>
    );
  }
}

export default App;
