import * as React from 'react';
import { Set, List, Map, Stack } from 'immutable';
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
import UndirectedWeightedGraph from './UndirectedWeightedGraph';

const scoringTable = {
  'pellet': 10,
  'powerPellet': 50,
  'ghost': 250
};

type Location = [number, number];
type ImmutableLocation = List<number>;

const pacManStartingLocation: Location = [14, 22];
const blinkyStartingLocation: Location = [14, 19];
const inkyStartingLocation: Location = [10, 16];
const pinkyStaringLocation: Location = [14, 16];
const clydeStartingLocation: Location = [18, 16];
const ghostRespawningPoint: Location = [14, 16];

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
class Board extends React.Component<Props> {
  // 27 X 31 board
  static logicalColumns = 28;
  static logicalRows = 33;

  stationaryEntities: Drawable[][];
  mapGraph: UndirectedWeightedGraph<List<number>>;
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
    this.keyboardListener = new KeyboardListener(document);
    this.stationaryEntities = createMultiDimensionalArray([Board.logicalColumns, Board.logicalRows]);
    this.pacMan = new PacMan(pacManStartingLocation, this.keyboardListener);
    this.ghosts = [
      new Blinky(blinkyStartingLocation, pacManStartingLocation),
      new Inky(inkyStartingLocation, pacManStartingLocation),
      new Pinky(pinkyStaringLocation, pacManStartingLocation),
      new Clyde(clydeStartingLocation, pacManStartingLocation)
    ];
    this.resetBoard();
    this.score = 0;
  }

  render() {
    const pixelRatio = window.devicePixelRatio || 1;
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

  componentDidMount() {
    if (this.props.active) {
      window.requestAnimationFrame((currentTime) => this.updateGameState(currentTime));
    }
  }

  componentDidUpdate(prevProps: Props, prevState: {}) {
    if (this.props.active === true && prevProps.active !== true) {
      window.requestAnimationFrame((currentTime) => this.updateGameState(currentTime));
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
      this.stationaryEntities[x][24] = new Wall;
    }
    for (let y = 8; y <= 24; y++) {
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

    // (window as any).a = this.parseGraph().map(val => val.toJS());
    const [mapVertices, mapEdges] = this.parseGraph();
    const mapGraph = new UndirectedWeightedGraph<List<number>>();
    mapVertices.valueSeq().forEach(vertex => vertex !== undefined &&
      mapGraph.addVertex(vertex));
    mapEdges.valueSeq().forEach(tuple => {
      if (tuple !== undefined) {
        const [vertexA, vertexB, cost] = tuple;
        mapGraph.addEdge(vertexA, vertexB, cost);
      }
    });
    this.mapGraph = mapGraph;
    this.moveEntitiesToStartingLocation();
  }

  parseGraph() {
    let previousLocations = Stack<ImmutableLocation>();

    const parseGraph = (location: ImmutableLocation):
      [Set<ImmutableLocation>, Set<[ImmutableLocation, ImmutableLocation, number]>] => {

      const map = this.stationaryEntities;
      const [x, y] = location.toArray();

      const leftColumn = map[x - 1];
      const middleColumn = map[x];
      const rightColumn = map[x + 1];

      const movementOptions = Map<ImmutableLocation, boolean>([
        [List([x, y - 1]), middleColumn && middleColumn[y - 1] instanceof Wall],
        [List([x - 1, y]), leftColumn && leftColumn[y] instanceof Wall],
        [List([x + 1, y]), rightColumn && rightColumn[y] instanceof Wall],
        [List([x, y + 1]), middleColumn && middleColumn[y + 1] instanceof Wall],
      ]);

      let vertices = Set<ImmutableLocation>();
      let edges = Set<[ImmutableLocation, ImmutableLocation, number]>();

      // Should this location be represented as a vertex in the graph?
      // 1: Yes
      // 2: No - it can be removed
      // 3: Yes
      // 4: Yes
      if (movementOptions.valueSeq().filter(val => val === true).count() !== 2) {
        vertices = vertices.add(location);

        if (previousLocations.count() > 0) {
          const previousLocation = previousLocations.last();
          const [prevX, prevY] = previousLocation.toArray();
          const [dx, dy] = [x - prevX, y - prevY].map(Math.abs);
          const cost = Math.max(dx, dy);  // One should be zero
          edges = edges.add([previousLocation, location, cost]);
        }
      }

      // tslint:disable:no-any
      for (const [newLocation, isWall] of movementOptions.entries() as any) {
        if (!isWall && !previousLocations.contains(newLocation)) {
          previousLocations = previousLocations.push(location);
          const [newVertices, newEdges] = parseGraph(newLocation);
          if (!newVertices.isEmpty()) {
            vertices = vertices.union(newVertices);
          }
          if (!newEdges.isEmpty()) {
            edges = edges.union(newEdges);
          }
        }
      }

      return [vertices, edges];
    };

    return parseGraph(List(pacManStartingLocation));
  }

  moveEntitiesToStartingLocation(): void {
    this.pacMan.logicalLocation = pacManStartingLocation;
    this.ghosts = [
      new Blinky(blinkyStartingLocation, pacManStartingLocation),
      new Inky(inkyStartingLocation, pacManStartingLocation),
      new Pinky(pinkyStaringLocation, pacManStartingLocation),
      new Clyde(clydeStartingLocation, pacManStartingLocation)
    ];
  }

  // TODO: Add time-since-last-update-parameter
  updateGameState(currentTime: number): void {
    if (this.timeOfLastUpdate !== 0) {
      let elapsedTime = currentTime - this.timeOfLastUpdate;

      this.pacMan.move(elapsedTime, this.stationaryEntities);
      for (let ghost of this.ghosts) {
        ghost.pacManLocation = this.pacMan.logicalLocation;
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
    let [x, y] = this.pacMan.logicalLocation;

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
