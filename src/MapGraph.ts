import UndirectedWeightedGraph from './UndirectedWeightedGraph';
import { computeOrthogonalDistance, movePoint } from './lib';
import { Direction, directionSeq } from './MovableEntity';
import Drawable from './Drawable';
import { Seq, List, Set, Stack, Map } from 'immutable';
import Wall from './Wall';

type MazeMap = Drawable[][];
type ImmutableLocation = List<number>;

class MazeMapGraph extends UndirectedWeightedGraph<ImmutableLocation> {
  private map: MazeMap;

  constructor(map: MazeMap, startingLocation: List<number>) {
    super();
    this.map = map;

    const [mapVertices, mapEdges] = this.parseGraph(startingLocation);
    mapVertices.valueSeq().forEach(vertex => vertex !== undefined &&
      this.addVertex(vertex));
    mapEdges.valueSeq().forEach(tuple => {
      if (tuple !== undefined) {
        const [vertexA, vertexB, cost] = tuple;
        this.addEdge(vertexA, vertexB, cost);
      }
    });
  }

  private parseGraph(startingLocation: List<number>): [Set<ImmutableLocation>, Set<[ImmutableLocation, ImmutableLocation, number]>] {
    let vertices = Set<ImmutableLocation>();
    let edges = Set<[ImmutableLocation, ImmutableLocation, number]>();

    // In the case of a prolonged edge (such as a long tunnel),
    // keeps track of the last seen vertex so that when we see another vertex,
    // we remember which vertex directed us to it.
    let lastKnownVertex: ImmutableLocation | undefined = undefined;

    // To save on computational time, only visit each location once
    let visitedLocations = Stack<ImmutableLocation>();

    const parseGraph = (location: ImmutableLocation): void => {

      const map = this.map;
      const [x, y] = location.toArray();

      if (x < 0 || map.length < x || y < 0 || Math.max(...map.map(arr => arr.length)) < y) {
        throw new Error('location of out bounds');
      }

      const leftColumn = map[x - 1];
      const middleColumn = map[x];
      const rightColumn = map[x + 1];
      const north = List([x, y - 1]);
      const west = List([x - 1, y]);
      const east = List([x + 1, y]);
      const south = List([x, y + 1]);

      const movementOptions = Map<ImmutableLocation, boolean>([
        [north, middleColumn && !(middleColumn[y - 1] instanceof Wall)],
        [west, leftColumn && !(leftColumn[y] instanceof Wall)],
        [east, rightColumn && !(rightColumn[y] instanceof Wall)],
        [south, middleColumn && !(middleColumn[y + 1] instanceof Wall)],
      ]);

      // Should this location be represented as a vertex in the graph?
      // 0: Yes (but if this happens, it is likely an error)
      // 1: Yes
      // 2: No - it can be removed
      // 3: Yes
      // 4: Yes
      const isEdge = movementOptions.valueSeq().filter(val => val === true).count() === 2 && (
        (movementOptions.get(north) === true && movementOptions.get(south) === true) ||
        (movementOptions.get(east) === true && movementOptions.get(west) === true));
      if (!isEdge) {
        vertices = vertices.add(location);

        const addEdgeFromCurrentLocation = (otherLocation: ImmutableLocation) => {
          const orthogonalDistance = computeOrthogonalDistance(location.toJS(), otherLocation.toJS());
          if (orthogonalDistance !== undefined) {
            const cost = Math.abs(orthogonalDistance);
            edges = edges.add([otherLocation, location, cost]);
          }
        };

        if (lastKnownVertex !== undefined) {
          // Add lastKnown in the case we came here via a prolonged edge
          // Note: if we happened to come from an adajacent vertex, this will be redundant
          addEdgeFromCurrentLocation(lastKnownVertex);
        }

        // Link adajacent vertices with an edge
        // tslint:disable:no-any
        for (const [adajacentLocation, isOpen] of movementOptions.entries() as any) {
          if (isOpen === true && vertices.contains(adajacentLocation)) {
            addEdgeFromCurrentLocation(adajacentLocation);
          }
        }

        // Update lastKnownVertex for the next time we encounter a prolonged edge
        lastKnownVertex = location;
      }

      // tslint:disable:no-any
      for (const [adajacentLocation, isOpen] of movementOptions.entries() as any) {
        if (isOpen && !visitedLocations.contains(adajacentLocation)) {
          visitedLocations = visitedLocations.push(adajacentLocation);
          parseGraph(adajacentLocation);
        }
      }

      return;
    };

    parseGraph(startingLocation);
    return [vertices, edges];
  }

  static findUpcomingEntity(map: MazeMap,
                            logicalLocation: [number, number],
                            direction: Direction,
                            criteria: (entity: Drawable, location?: [number, number]) => boolean): [number, number] | undefined {
    const [logicalColumn, logicalRow] = logicalLocation;

    let columnNumber = logicalColumn;
    let rowNumber = logicalRow;
    while (0 <= columnNumber && columnNumber < map.length &&
      0 <= rowNumber && rowNumber < map[columnNumber].length) {
      if (criteria(map[columnNumber][rowNumber], [columnNumber, rowNumber])) {
        return [columnNumber, rowNumber];
      }

      [columnNumber, rowNumber] = movePoint([columnNumber, rowNumber], direction);
    }

    return undefined;
  }

  findClosestVertex(logicalLocation: [number, number], preferredDirections: Seq.Indexed<Direction> = Seq([])) {
    const options = this.getMovementOptions(logicalLocation);

    let closestVertexLocation = logicalLocation;
    // We are not a vertex if we only have two ways to go (ex: O--*--O)
    if (this.isEdge(logicalLocation)) {
      const [x, y] = logicalLocation;
      let minimumDistance: number = Infinity;

      const updateMinimumDistance = (direction: Direction) => {
        const nextVertex = MazeMapGraph.findUpcomingEntity(this.map, logicalLocation, direction,
                                                           (entity, location) => location !== undefined && !this.isEdge(location));
        if (nextVertex === undefined) {
          return;
        }
        const [a, b] = nextVertex;
        const distance = computeOrthogonalDistance([a, b], [x, y]);
        if (distance !== undefined && distance < minimumDistance) {
          closestVertexLocation = [a, b];
          minimumDistance = distance;
        }
      };

      if (!preferredDirections.isEmpty()) {
        // Give preferance to user-specified directions
        preferredDirections.forEach(direction => {
          if (direction !== undefined && options[direction] === true) {
            updateMinimumDistance(direction);
          }
        });

        if (minimumDistance !== Infinity) {
          // We actually found a vertex in a preferred direction
          return List(closestVertexLocation);
        }
      }

      // Try all directions
      directionSeq.forEach(direction => {
        if (direction !== undefined && options[direction] === true) {
          updateMinimumDistance(direction);
        }
      });
    }

    return List(closestVertexLocation);
  }

  private isEdge(logicalLocation: [number, number]) {
    const options = this.getMovementOptions(logicalLocation);
    // tslint:disable:no-any
    const optionsArray: [string, boolean][] = (Object as any).values(options).filter((val: boolean) => val === true);
    const numberOfOptions = optionsArray.length;

    // We are not a vertex if we only have two ways to go (ex: O--*--O)
    return numberOfOptions === 2 && (
      (options[Direction.North] === true && options[Direction.South] === true) ||
      (options[Direction.East] === true && options[Direction.West] === true));
  }

  /**
   * Checks to see which adjacent cells this entity can legally move
   * @param map The grid of stationary entities
   */
  private getMovementOptions(logicalLocation: [number, number]) {
    const map = this.map;
    const leftColumn = map[logicalLocation[0] - 1];
    const middleColumn = map[logicalLocation[0]];
    const rightColumn = map[logicalLocation[0] + 1];

    return {
      [Direction.North]: !(middleColumn && middleColumn[logicalLocation[1] - 1] instanceof Wall),
      [Direction.West]: !(leftColumn && leftColumn[logicalLocation[1]] instanceof Wall),
      [Direction.East]: !(rightColumn && rightColumn[logicalLocation[1]] instanceof Wall),
      [Direction.South]: !(middleColumn && middleColumn[logicalLocation[1] + 1] instanceof Wall),
    };
  }
}

export default MazeMapGraph;
