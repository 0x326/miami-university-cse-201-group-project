import * as React from 'react';
import './App.css';
import Board from './Board';

const logo = require('./logo.svg');

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
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div>
          {this.state.score}
        </div>
        <Board onScoreChange={(newScore: number) => this.setState({
          score: newScore
          })} />
      </div>
    );
  }
}

export default App;
