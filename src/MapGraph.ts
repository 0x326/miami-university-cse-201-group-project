// Course: CSE 201 A
// Instructor: Dr. Kiper
// Date: 2017/12/08
// Names: John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly

import UndirectedWeightedGraph from './UndirectedWeightedGraph';
import { computeOrthogonalDistance, movePoint } from './lib';
import { Direction, directionSeq } from './MovableEntity';
import Drawable from './Drawable';
import { Seq, List, Set, Map } from 'immutable';
import Wall from './Wall';

type MazeMap = Drawable[][];
type ImmutableLocation = List<number>;

/**
 * A special graph where edges are either horizontal or vertical
 *
 * @class MazeMapGraph
 * @extends {UndirectedWeightedGraph<ImmutableLocation>}
 */
class MazeMapGraph extends UndirectedWeightedGraph<ImmutableLocation> {
  private map: MazeMap;

  /**
   * Creates an instance of MazeMapGraph.
   * @param {MazeMap} map The map to parse
   * @param {List<number>} startingLocation Pac-Man's starting location
   * @memberof MazeMapGraph
   */
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

  /**
   * Converts the map into a graph
   *
   * @private
   * @param {List<number>} startingLocation Pac-Man's starting location
   * @returns {[Set<ImmutableLocation>, Set<[ImmutableLocation, ImmutableLocation, number]>]}
   * @memberof MazeMapGraph
   */
  private parseGraph(startingLocation: List<number>): [Set<ImmutableLocation>, Set<[ImmutableLocation, ImmutableLocation, number]>] {
    const map = this.map;

    let vertices = Set<ImmutableLocation>();
    let edges = Set<[ImmutableLocation, ImmutableLocation, number]>();

    // Breadth-first search
    let vertexQueue = List<ImmutableLocation>([startingLocation]);
    while (!vertexQueue.isEmpty()) {
      const vertex = vertexQueue.first();
      vertexQueue = vertexQueue.shift();
      vertices = vertices.add(vertex);

      const [x, y] = vertex.toJS();

      if (x < 0 || map.length < x || y < 0 || Math.max(...map.map(arr => arr.length)) < y) {
        throw new Error('location of out bounds');
      }

      const leftColumn = map[x - 1];
      const middleColumn = map[x];
      const rightColumn = map[x + 1];

      const movementOptions = Map<Direction, boolean>([
        [Direction.North, middleColumn && !(middleColumn[y - 1] instanceof Wall)],
        [Direction.West, leftColumn && !(leftColumn[y] instanceof Wall)],
        [Direction.East, rightColumn && !(rightColumn[y] instanceof Wall)],
        [Direction.South, middleColumn && !(middleColumn[y + 1] instanceof Wall)],
      ]);

      directionSeq.forEach(direction => {
        if (direction !== undefined && movementOptions.get(direction) === true) {
          const adajacentPoint = movePoint([x, y], direction);
          const nextVertexLocation = MazeMapGraph.findUpcomingEntity(map, adajacentPoint, direction, (entity, entityLocation) => {
            return entityLocation !== undefined && !this.isEdge(entityLocation);
          });

          if (nextVertexLocation !== undefined) {
            const nextVertex = List(nextVertexLocation);
            const [c, d] = nextVertexLocation;

            const cost = Math.abs(computeOrthogonalDistance([x, y], [c, d]) || 1);
            edges = edges.add([vertex, nextVertex, cost]);

            if (!vertexQueue.contains(nextVertex) && !vertices.contains(nextVertex)) {
              vertexQueue = vertexQueue.push(nextVertex);
            }
          }
        }
      });
    }

    return [vertices, edges];
  }

  /**
   * Looks ahead to see the next entity that meets the given condition
   *
   * @static
   * @param {MazeMap} map The map to search
   * @param {[number, number]} logicalLocation The starting location
   * @param {Direction} direction The direction to look
   * @param {(entity: Drawable, location?: [number, number]) => boolean} criteria The condition
   * @returns {([number, number] | undefined)} The matching entity, if found
   * @memberof MazeMapGraph
   */
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

  /**
   * Given a location on a maze, finds the closest equivalent graph vertex
   *
   * @param {[number, number]} logicalLocation The location to represent
   * @param {Seq.Indexed<Direction>} [preferredDirections=Seq([])] Preferred directions to look
   * @returns The location of the closest vertex
   * @memberof MazeMapGraph
   */
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

  /**
   * Determines whether a point on a maze is represented as an edge.
   *
   * @private
   * @param {[number, number]} logicalLocation The location to check
   * @returns True if is edge
   * @memberof MazeMapGraph
   */
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
   *
   * @private
   * @param {[number, number]} logicalLocation The location to check
   * @returns
   * @memberof MazeMapGraph
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
