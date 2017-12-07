import * as React from 'react';
import { Set, List } from 'immutable';
import * as Request from 'request-promise-native';
import { convert as unitsCssConvert } from 'units-css';
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
  'pellet': 10,
  'powerPellet': 50,
  'ghost': 250
};

const mazeChunks = {
  topLeft: [
    require('./maps/top-left-1.csv') as string,
    require('./maps/top-left-2.csv') as string,
    require('./maps/top-left-3.csv') as string,
    require('./maps/top-left-4.csv') as string
  ],
  topRight: [
    require('./maps/top-right-1.csv') as string,
    require('./maps/top-right-2.csv') as string,
    require('./maps/top-right-3.csv') as string,
    require('./maps/top-right-4.csv') as string
  ],
  centerLeft: [
    require('./maps/center-left.csv') as string
  ],
  centerRight: [
    require('./maps/center-right.csv') as string
  ],
  bottomLeft: [
    require('./maps/bottom-left-1.csv') as string,
    require('./maps/bottom-left-2.csv') as string,
    require('./maps/bottom-left-3.csv') as string,
    require('./maps/bottom-left-4.csv') as string
  ],
  bottomRight: [
    require('./maps/bottom-right-1.csv') as string,
    require('./maps/bottom-right-2.csv') as string,
    require('./maps/bottom-right-3.csv') as string,
    require('./maps/bottom-right-4.csv') as string
  ]
};

const ghostRespawningPoint = [14, 16];

/**
 * A portion of a a logical grid.
 *
 * A chunk is a sixth of the logical grid (2 X 3 partition)
 */
type Chunk = Drawable[][];
const chunkColumns = 14;
const chunkRows = 11;

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
  static logicalColumns = 28;
  static logicalRows = 33;

  boardChunks = {
    topLeft: List<Chunk>(),
    topRight: List<Chunk>(),
    centerLeft: List<Chunk>(),
    centerRight: List<Chunk>(),
    bottomLeft: List<Chunk>(),
    bottomRight: List<Chunk>()
  };
  stationaryEntities: Drawable[][];
  pacMan: PacMan;
  ghosts: Ghost[];

  timeOfLastUpdate: number = 0;

  level: number = 1;
  score: number;
  pelletsEaten: number = 0;
  pelletsToEat: number = 0;
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
    this.pacMan = new PacMan([14, 22], this.keyboardListener);
    this.ghosts = [
      new Blinky([14, 19]),
      new Inky([10, 16]),
      new Pinky([14, 16]),
      new Clyde([18, 16])
    ];
    this.resetBoard();
    this.score = 0;
  }

  render() {
    const pixelRatio = window.devicePixelRatio || 1;
    if (!this.state.resourcesLoaded) {
      return (
        <div>
          Loading resources...
        </div>
      );
    } else {
      return (
        <canvas
          width={unitsCssConvert('px', this.props.width) * pixelRatio}
          height={unitsCssConvert('px', this.props.height) * pixelRatio}
          style={{
            width: this.props.width,
            height: this.props.height
          }}
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
    if (this.props.active) {
     if (!this.state.resourcesLoaded) {
        const resourcesLoadedPromise = new Promise((resolve, reject) => {
          const baseURL = window.location.origin;
          let chunkAreaPromises = [];

          for (const chunkArea in mazeChunks) {
            if (mazeChunks.hasOwnProperty(chunkArea)) {
              const chunkURLs: string[] = mazeChunks[chunkArea];
              let parseChunkPromises: Promise<Drawable[][]>[] = [];

              for (const chunkURL of chunkURLs) {
                const parseChunkPromise = Request(baseURL + chunkURL)
                  .then(csv => Board.parseMap(csv));

                parseChunkPromises.push(parseChunkPromise);
              }

              const chunkAreaPromise = Promise.all(parseChunkPromises)
                .then(chunks => chunks.forEach(chunk => {
                  this.boardChunks[chunkArea] = this.boardChunks[chunkArea].push(chunk);
              }));

              chunkAreaPromises.push(chunkAreaPromise);
            }
          }

          Promise.all(chunkAreaPromises).then(() => resolve());
        });

        resourcesLoadedPromise.then(() => {
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
    if (this.props.active === true && prevProps.active !== true) {
      if (this.state.resourcesLoaded) {
        window.requestAnimationFrame((currentTime) => this.updateGameState(currentTime));
      }
    }
  }

  componentWillUnmount() {
  }

  resetBoard(): void {
    this.pelletsEaten = 0;
    this.pelletsToEat = 0;
    // TODO: Populate board
    for (let x = 8; x <= 20; x++) {
      this.stationaryEntities[x][8] = new Wall;
      this.stationaryEntities[x][10] = new Wall;
      this.stationaryEntities[x][14] = new Wall;
      this.stationaryEntities[x][20] = new Wall;
    }
    for (let y = 8; y <= 20; y++) {
      this.stationaryEntities[8][y] = new Wall;
      this.stationaryEntities[20][y] = new Wall;
    }
    delete this.stationaryEntities[9][10];
    delete this.stationaryEntities[19][10];
    delete this.stationaryEntities[9][14];
    delete this.stationaryEntities[19][14];
    for (let y = 12; y <= 13; y++) {
      this.stationaryEntities[10][y] = new Wall;
      this.stationaryEntities[18][y] = new Wall;
    }
    this.stationaryEntities[14][11] = new Wall;
    this.stationaryEntities[14][12] = new Wall;
    delete this.stationaryEntities[15][20];

    this.stationaryEntities[9][9] = new PowerPellet;
    this.stationaryEntities[19][9] = new PowerPellet;
    this.stationaryEntities[9][19] = new PowerPellet;
    this.stationaryEntities[19][19] = new PowerPellet;
    this.pelletsToEat += 4;

    for (let y = 10; y <= 18; y++) {
      this.stationaryEntities[9][y] = new Pellet;
      this.stationaryEntities[19][y] = new Pellet;
      this.pelletsToEat += 2;
    }
    for (let x = 10; x <= 18; x++) {
      this.stationaryEntities[x][9] = new Pellet;
      this.stationaryEntities[x][19] = new Pellet;
      this.pelletsToEat += 2;
    }
    this.moveEntitiesToStartingLocation();
  }

  moveEntitiesToStartingLocation(): void {
    this.pacMan.logicalLocation = [14, 22];
    this.ghosts = [
      new Blinky([14, 19]),
      new Inky([10, 16]),
      new Pinky([14, 16]),
      new Clyde([18, 16])
    ];
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
    } else if (this.props.active) {
      if (this.pelletsEaten === this.pelletsToEat) {
        this.level++;
        this.resetBoard();
      }
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
      this.pelletsEaten++;
      delete this.stationaryEntities[x][y];
    } else if (stationaryItem instanceof PowerPellet) {
      scoreIncrement += scoringTable.powerPellet;
      this.pelletsEaten++;
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

  /**
   * Converts a map file (CSV format) to a Chunk representation.
   *
   * @param fileContents The contents of the CSV map file
   */
  static parseMap(fileContents: string): Chunk {
    const chunk: Chunk = createMultiDimensionalArray([chunkColumns, chunkRows]);

    // tslint:disable:no-any
    for (const [lineNumber, lineContents] of fileContents.split(/\r?\n/).entries() as any) {
      for (const [columnNumber, cellContent] of lineContents.split(/,/).entries()) {
        let item: Drawable;

        if (cellContent === '') {
          continue;
        } else if (cellContent === 'X') {
          item = new Wall;
        } else if (cellContent === '.') {
          item = new Pellet;
        } else if (cellContent === 'O') {
          item = new PowerPellet;
        } else {
          throw new Error(`Invalid map character '${cellContent}'`);
        }

        if (columnNumber >= chunk.length) {
          throw new Error(`Chunk more columns than the ${chunkColumns} expected`);
        } else if (lineNumber >= chunk[columnNumber].length) {
          throw new Error(`Chunk has more lines than the ${chunkRows} expected`);
        }

        chunk[columnNumber][lineNumber] = item;
      }
    }

    return chunk;
  }
}

export default Board;
