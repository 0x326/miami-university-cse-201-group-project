// Course: CSE 201 A
// Instructor: Dr. Kiper
// Date: 2017/12/08
// Names: John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly

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
import MazeMapGraph from './MapGraph';

const scoringTable = {
  'pellet': 10,
  'powerPellet': 50,
  'ghost': 250
};

type Location = [number, number];

const pacManStartingLocation: Location = [14, 19];
const blinkyStartingLocation: Location = [14, 13];
const inkyStartingLocation: Location = [12, 16];
const pinkyStaringLocation: Location = [14, 16];
const clydeStartingLocation: Location = [15, 16];
const ghostRespawningPoint: Location = [14, 16];

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
 * Represents the game board.
 *
 * A bridge between React and our object-oriented design.
 *
 * @author John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly
 * @class Board
 * @extends {React.Component<Props, State>}
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
  mapGraph: MazeMapGraph;
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

  constructor(props: Props) {
    super(props);
    this.state = {
      resourcesLoaded: false
    };
    this.keyboardListener = new KeyboardListener();
    this.stationaryEntities = createMultiDimensionalArray([Board.logicalColumns, Board.logicalRows]);
    this.pacMan = new PacMan(pacManStartingLocation, this.keyboardListener);
    this.ghosts = [
      new Blinky(blinkyStartingLocation, pacManStartingLocation, this.pacMan.direction, this.mapGraph),
      new Inky(inkyStartingLocation, pacManStartingLocation, this.pacMan.direction, this.mapGraph),
      new Pinky(pinkyStaringLocation, pacManStartingLocation, this.pacMan.direction, this.mapGraph),
      new Clyde(clydeStartingLocation, pacManStartingLocation, this.pacMan.direction, this.mapGraph)
    ];
    this.moveEntitiesToStartingLocation();
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
    this.keyboardListener.attach(document);
    this.pacMan.mount();
    for (const ghost of this.ghosts) {
      ghost.mount();
    }
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
          this.buildBoard();
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
    this.pacMan.unmount();
    for (const ghost of this.ghosts) {
      ghost.unmount();
    }
    this.keyboardListener.detach();
  }

  /**
   * Generates a pseudorandom board
   *
   * @memberof Board
   */
  buildBoard(): void {
    this.pelletsEaten = 0;
    this.pelletsToEat = 0;

    let selectedMazeChunks: {
      topLeft: Chunk | undefined,
      topRight: Chunk | undefined,
      centerLeft: Chunk | undefined,
      centerRight: Chunk | undefined,
      bottomLeft: Chunk | undefined,
      bottomRight: Chunk | undefined
    } = {
      topLeft: undefined,
      topRight: undefined,
      centerLeft: undefined,
      centerRight: undefined,
      bottomLeft: undefined,
      bottomRight: undefined
    };

    for (const chunkArea in this.boardChunks) {
      if (this.boardChunks.hasOwnProperty(chunkArea)) {
        const boardChunksArea: List<Drawable[][]> = this.boardChunks[chunkArea];
        const selectedIndex = Math.floor(boardChunksArea.count() * Math.random());
        const selectedChunk = boardChunksArea.get(selectedIndex);
        selectedMazeChunks[chunkArea] = selectedChunk;
      }
    }

    const chunkOffset = {
      topLeft: [0, 0],
      topRight: [chunkColumns, 0],
      centerLeft: [0, chunkRows],
      centerRight: [chunkColumns, chunkRows],
      bottomLeft: [0, 2 * chunkRows],
      bottomRight: [chunkColumns, 2 * chunkRows]
    };

    for (const chunkArea in selectedMazeChunks) {
      if (selectedMazeChunks.hasOwnProperty(chunkArea)) {
        const chunk: Chunk | undefined = selectedMazeChunks[chunkArea];
        if (chunk !== undefined) {
          const offset: [number, number] = chunkOffset[chunkArea];
          const [xOffset, yOffset] = offset;

          for (let i = 0; i < chunkColumns; i++) {
            for (let j = 0; j < chunkRows; j++) {
              const entity = chunk[i][j];

              if (entity instanceof Pellet || entity instanceof PowerPellet) {
                this.pelletsToEat++;
              }

              if (entity !== undefined) {
                this.stationaryEntities[xOffset + i][yOffset + j] = entity;
              }
            }
          }
        }
      }
    }

    this.mapGraph = new MazeMapGraph(this.stationaryEntities, List(pacManStartingLocation));
    this.moveEntitiesToStartingLocation();

    for (const ghost of this.ghosts) {
      ghost.boardGraph = this.mapGraph;
    }
  }

  /**
   * Repositions MovableEntities to their staring locations
   *
   * @memberof Board
   */
  moveEntitiesToStartingLocation(): void {
    this.pacMan.logicalLocation = pacManStartingLocation;
    this.ghosts[0].logicalLocation = blinkyStartingLocation;
    this.ghosts[1].logicalLocation = inkyStartingLocation;
    this.ghosts[2].logicalLocation = pinkyStaringLocation;
    this.ghosts[3].logicalLocation = clydeStartingLocation;
  }

  /**
   * Updates the game state. Called on every frame
   *
   * @param {number} currentTime The current time
   * @memberof Board
   */
  updateGameState(currentTime: number): void {
    if (this.timeOfLastUpdate !== 0) {
      let elapsedTime = currentTime - this.timeOfLastUpdate;

      this.pacMan.move(elapsedTime, this.stationaryEntities);
      for (let ghost of this.ghosts) {
        ghost.pacManLocation = this.pacMan.logicalLocation;
        ghost.pacManDirection = this.pacMan.direction;
        ghost.move(elapsedTime, this.stationaryEntities);
      }

      this.detectCollisions();
      // TODO: Determine when the game has ended
    }
    this.repaintCanvas();
    this.timeOfLastUpdate = currentTime;
    if (this.gameFinished) {
      this.props.onGameFinish();
    } else if (this.props.active) {
      if (this.pelletsEaten === this.pelletsToEat) {
        this.level++;
        this.buildBoard();
      }
      window.requestAnimationFrame((time) => this.updateGameState(time));
    }
  }

  /**
   * Perform collision detection
   *
   * @memberof Board
   */
  detectCollisions(): void {
    let [x, y] = this.pacMan.logicalLocation;

    let stationaryItem = this.stationaryEntities[x] ? this.stationaryEntities[x][y] : undefined;
    let scoreIncrement = 0;
    if (stationaryItem instanceof Wall) {
      // TODO: Add correction logic
      throw new Error('pacMan is on a wall');
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
      let [ghostX, ghostY] = ghost.logicalLocation;
      if (x === ghostX && y === ghostY) {
        if (ghost.isVunerable()) {
          ghost.logicalLocation = ghostRespawningPoint;
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

  /**
   * Render the game to the <canvas> element
   *
   * @memberof Board
   */
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

        // Top-left corner
        let drawLocation: [number, number] = [
          columnNumber * boundingBoxSize,
          rowNumber * boundingBoxSize
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
   * @static
   * @param {string} fileContents The contents of the CSV map file
   * @returns {Chunk}
   * @memberof Board
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
