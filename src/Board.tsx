import * as React from 'react';
import { Set } from 'immutable';
import PacMan from './PacMan';
import Ghost from './Ghost';
import Blinky from './Blinky';
import Inky from './Inky';
import Pinky from './Pinky';
import Clyde from './Clyde';
import Drawable, { Neighbors } from './Drawable';
import Wall from './Wall';
import Pellet from './Pellet';
import PowerPellet from './PowerPellet';
import { createMultiDimensionalArray } from './lib';
import KeyboardListener from './KeyboardListener';

const scoringTable = {
  // TODO: Adjust scores
  'pellet': 1,
  'powerPellet': 2,
  'ghost': 5
};

const ghostRespawningPoint = [14, 16];

interface State {
  resourcesLoaded: boolean;
}

interface Props {
  width: string;
  height: string;
  onScoreChange: (newScore: number) => void;
  onGameFinish: () => void;
  active: boolean;
}

/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
class Board extends React.Component<Props, State> {
  // 27 X 31 board
  static logicalColumns = 27;
  static logicalRows = 31;

  loadResources: Promise<undefined>;

  stationaryEntities: Drawable[][];
  pacMan: PacMan;
  ghosts: Ghost[];

  timeOfLastUpdate: number = 0;

  score: number;
  gameActive: boolean = false;
  gameFinished: boolean = false;

  canvasContext: CanvasRenderingContext2D;
  keyboardListener: KeyboardListener;

  vulnerableGhosts: Set<Ghost>;
  ghostWarningTimer: number;
  ghostRecoveryTimer: number;

  constructor() {
    super();
    this.state = {
      resourcesLoaded: false
    };
    this.keyboardListener = new KeyboardListener(document);
    this.stationaryEntities = createMultiDimensionalArray([Board.logicalColumns, Board.logicalRows]);
    // TODO: Populate board
    for (let i = 0; i < 10; i++) {
      this.stationaryEntities[i][5] = new Wall;
    }
    for (let i = 5; i < 15; i++) {
      this.stationaryEntities[i][10] = new Pellet;
    }
    for (let i = 10; i < 20; i++) {
      this.stationaryEntities[i][20] = new PowerPellet;
    }
    this.pacMan = new PacMan([14, 22], this.keyboardListener);
    this.ghosts = [
      new Blinky([14, 19]),
      new Inky([10, 16]),
      new Pinky([14, 16]),
      new Clyde([18, 16])
    ];
    this.score = 0;
  }

  render() {
    if (!this.state.resourcesLoaded) {
      return (
        <div>
          Loading resources...
        </div>
      );
    } else {
      return (
        <canvas
          width={this.props.width}
          height={this.props.height}
          ref={(elem) => {
            if (elem !== null) {
              let context = elem.getContext('2d');
              if (context !== null) {
                this.canvasContext = context;
              }
            }
          }}
        />
      );
    }
  }

  componentDidMount() {
    this.gameActive = this.props.active;
    if (this.gameActive) {
      if (!this.state.resourcesLoaded) {
        this.loadResources = new Promise((resolve, reject) => {
          // TODO: Load resources
          resolve();
        });

        this.loadResources.then(() => {
          this.setState({
            resourcesLoaded: true
          });
          window.requestAnimationFrame((currentTime) => this.updateGameState(currentTime));
        });
      } else {
        window.requestAnimationFrame((currentTime) => this.updateGameState(currentTime));
      }
    }
  }

  componentDidUpdate(prevProps: Props, prevState: {}) {
    if (prevProps.active === true && !this.gameActive) {
      this.gameActive = true;
      if (this.state.resourcesLoaded) {
        window.requestAnimationFrame((currentTime) => this.updateGameState(currentTime));
      }
    } else if (prevProps.active === false) {
      this.gameActive = false;
    }
  }

  componentWillUnmount() {
    this.gameActive = false;
  }

  // TODO: Add time-since-last-update-parameter
  updateGameState(currentTime: number): void {
    if (this.timeOfLastUpdate !== 0) {
      let elapsedTime = currentTime - this.timeOfLastUpdate;

      this.pacMan.move(elapsedTime, this.stationaryEntities);
      for (let ghost of this.ghosts) {
        ghost.move(elapsedTime, this.stationaryEntities);
      }

      this.detectCollisions();
      this.repaintCanvas();
      // TODO: Determine when the game has ended
    }
    this.timeOfLastUpdate = currentTime;
    if (this.gameFinished) {
      this.props.onGameFinish();
    } else if (this.gameActive) {
      window.requestAnimationFrame((time) => this.updateGameState(time));
    }
  }

  detectCollisions(): void {
    let [x, y] = this.pacMan.getLogicalLocation();

    let stationaryItem = this.stationaryEntities[x] ? this.stationaryEntities[x][y] : undefined;
    let scoreIncrement = 0;
    if (stationaryItem instanceof Wall) {
      // TODO: Add correction logic
      throw 'pacMan is on a wall';
    } else if (stationaryItem instanceof Pellet) {
      scoreIncrement += scoringTable.pellet;
      delete this.stationaryEntities[x][y];
    } else if (stationaryItem instanceof PowerPellet) {
      scoreIncrement += scoringTable.powerPellet;
      delete this.stationaryEntities[x][y];

      // TODO: Calculate time until recovery
      const timeUntilRecovery = 5000;
      const timeUntilWarning = timeUntilRecovery - 1000;

      // Clear previous timers
      if (this.ghostWarningTimer) {
        window.clearTimeout(this.ghostWarningTimer);
      }
      if (this.ghostRecoveryTimer) {
        window.clearTimeout(this.ghostRecoveryTimer);
      }
      // Set new timers
      this.ghostWarningTimer = window.setTimeout(() =>
        this.vulnerableGhosts.forEach(ghost => ghost && ghost.startWarning()),
                                                 timeUntilWarning);
      this.ghostRecoveryTimer = window.setTimeout(() =>
        this.vulnerableGhosts.forEach(ghost => ghost && ghost.makeDangerous()),
                                                  timeUntilRecovery);
      // Make ghosts vulnerable
      this.ghosts.forEach(ghost => ghost.makeVulnerable());
      this.vulnerableGhosts = Set(this.ghosts);
    }

    for (let ghost of this.ghosts) {
      let [ghostX, ghostY] = ghost.getLogicalLocation();
      if (x === ghostX && y === ghostY) {
        if (ghost.isVunerable()) {
          ghost.logicalLocation[0] = ghostRespawningPoint[0];
          ghost.logicalLocation[1] = ghostRespawningPoint[1];
          this.vulnerableGhosts = this.vulnerableGhosts.remove(ghost);
          ghost.makeDangerous();
          scoreIncrement += scoringTable.ghost;
        } else {
          this.gameFinished = true;
          break;
        }
      }
    }

    if (scoreIncrement > 0) {
      // Update score
      this.score += scoreIncrement;
      this.props.onScoreChange(this.score);
    }
  }

  repaintCanvas(): void {
    let canvasWidth = this.canvasContext.canvas.width;
    let canvasHeight = this.canvasContext.canvas.height;
    this.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

    let boundingBoxSize = Math.min(canvasWidth / Board.logicalColumns,
                                   canvasHeight / Board.logicalRows);
    for (let column in this.stationaryEntities) {
      for (let row in this.stationaryEntities[column]) {
        // Type cast
        let columnNumber = Number(column), rowNumber = Number(row);

        let item = this.stationaryEntities[columnNumber][rowNumber];
        // Create representation of surroundings
        let leftColumn = this.stationaryEntities[columnNumber - 1];
        let middleColumn = this.stationaryEntities[columnNumber];
        let rightColumn = this.stationaryEntities[columnNumber + 1];
        let neighbors: Neighbors = {
          topLeft: leftColumn ? leftColumn[rowNumber + 1] : undefined,
          top: middleColumn ? middleColumn[rowNumber + 1] : undefined,
          topRight: rightColumn ? rightColumn[rowNumber + 1] : undefined,

          left: leftColumn ? leftColumn[rowNumber] : undefined,
          right: rightColumn ? rightColumn[rowNumber] : undefined,

          bottomLeft: leftColumn ? leftColumn[rowNumber - 1] : undefined,
          bottom: middleColumn ? middleColumn[rowNumber - 1] : undefined,
          bottomRight: rightColumn ? rightColumn[rowNumber - 1] : undefined,
        };

        let drawLocation: [number, number] = [
          columnNumber * boundingBoxSize - boundingBoxSize,
          rowNumber * boundingBoxSize - boundingBoxSize
        ];
        item.draw(this.canvasContext, drawLocation, boundingBoxSize, neighbors);
      }
    }
    for (let ghost of this.ghosts) {
      ghost.draw(this.canvasContext, boundingBoxSize);
    }
    this.pacMan.draw(this.canvasContext, boundingBoxSize);
  }
}

export default Board;
