import { List, Seq } from 'immutable';
import MovableEntity, { Direction, directionSeq } from './MovableEntity';
import Drawable from './Drawable';
import UndirectedWeightedGraph from './UndirectedWeightedGraph';
import Wall from './Wall';
import { computeOrthogonalDistance, computeDirection, isPointOnLine, slope } from './lib';

/**
 * Course: CSE 201 A
 * Instructor: Dr. Kiper
 *
 * CSE 201 Project
 *
 * @author Noah Dirig, Laurel Sexton, Gauthier Kelly, John Meyer
 */
abstract class Ghost extends MovableEntity {
  state: VulnerabilityState = VulnerabilityState.Dangerous;
  private _pacManLocation: [number, number];
  pacManDirection: Direction;
  boardGraph: UndirectedWeightedGraph<List<number>>;

  /**
   * Creates a MovableEntity
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number],
              pacManLocation: [number, number],
              pacManDirection: Direction,
              boardGraph: UndirectedWeightedGraph<List<number>>) {
    super(initialLocation);
    this._pacManLocation = <[number, number]> pacManLocation.slice();
    this.pacManDirection = pacManDirection;
    this.boardGraph = boardGraph;
    this.stopped = false;
    this.speed = 2.3;
  }

  get pacManLocation() {
    return this._pacManLocation;
  }
  set pacManLocation(location: [number, number]) {
    this._pacManLocation[0] = location[0];
    this._pacManLocation[1] = location[1];
  }

  /**
   * @return Whether this Ghost is vulnerable
   */
  isVunerable(): boolean {
    return this.state !== VulnerabilityState.Dangerous;
  }

  /**
   * Makes this Ghost vulnerable
   */
  makeVulnerable(): void {
    this.state = VulnerabilityState.Vulnerable;
  }

  /**
   * Makes this Ghost start blinking.
   * If this method is called when the ghost is not vulnerable, an exception will be thrown.
   */
  startWarning(): void {
    if (this.state === VulnerabilityState.Vulnerable) {
      this.state = VulnerabilityState.VulnerableBlinking;
    } else {
      throw new Error();
    }
  }

  /**
   * Removes this Ghost from its vulnerable state.
   */
  makeDangerous(): void {
    this.state = VulnerabilityState.Dangerous;
  }

  /**
   * Draw this object on the graphic at the given location.
   *
   * @param board         The graphic to draw on
   * @param maxSize       The maximum size of the image.
   *              The image drawn should be proportional to mazSize to support scaling.
   */
  draw(board: CanvasRenderingContext2D, maxSize: number) {
    super.draw(board, maxSize);
    let drawLocation: [number, number] = [
      this.exactLocation[0] * maxSize - maxSize,
      this.exactLocation[1] * maxSize - maxSize
    ];

    switch (this.state) {
      case VulnerabilityState.Vulnerable:
        board.fillStyle = '#03A9F4';
        break;

      case VulnerabilityState.VulnerableBlinking:
        board.fillStyle = '#FF9800';
        break;

      default:
        board.fillStyle = '#F44336';
        break;
    }
    board.beginPath();
    board.arc(drawLocation[0], drawLocation[1], maxSize / 3, 0, 2 * Math.PI);
    board.fill();
  }

  static findClosestVertex(map: Drawable[][], logicalLocation: [number, number], preferredDirections= Seq<Direction>([])) {
    const options = Ghost.getMovementOptions(map, logicalLocation);
    // tslint:disable:no-any
    const optionsArray: [string, boolean][] = (Object as any).values(options).filter((val: boolean) => val === true);
    const numberOfOptions = optionsArray.length;

    let closestVertexLocation = logicalLocation;
    // We are not a vertex if we only have two ways to go (ex: O--*--O)
    if (numberOfOptions === 2) {
      const [x, y] = logicalLocation;
      let minimumDistance: number = Infinity;

      const updateMinimumDistance = (direction: Direction) => {
        const nextWall = Ghost.findUpcomingEntity(map, logicalLocation, direction,
                                                  entity => entity instanceof Wall);
        if (nextWall === undefined) {
          return;
        }
        const [a, b] = nextWall;
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
      } else {
        // Otherwise, try all directions
        directionSeq.forEach(direction => {
          if (direction !== undefined && options[direction] === true) {
            updateMinimumDistance(direction);
          }
        });
      }
    }

    return List(closestVertexLocation);
  }

  chooseDirection(map: Drawable[][]): void {
    const options = Ghost.getMovementOptions(map, this.logicalLocation);

    // Check to see whether Pac-Man is within sight
    const pacManLineSlope = slope(this._pacManLocation, this.logicalLocation);
    if (pacManLineSlope === 0 || pacManLineSlope === Infinity) {
      const direction = computeDirection(this.logicalLocation, this._pacManLocation);

      if (options[direction] === true) {
        const upcomingEntity = Ghost.findUpcomingEntity(map, this.logicalLocation, direction,
                                                        entity => entity instanceof Wall);
        if (upcomingEntity !== undefined) {
          const [a, b] = upcomingEntity;

          // computeOrthogonalDistance should never return undefined in our case
          // (if it does, it is an bug). For type safety, default values are given that,
          // if used, should make the if expression false
          const distanceToWall = Math.abs(computeOrthogonalDistance([a, b], this.logicalLocation) || 0);
          const distanceToPacMan = Math.abs(computeOrthogonalDistance(this._pacManLocation, this.logicalLocation) || Infinity);

          if (distanceToPacMan < distanceToWall) {
            // Pac-Man is within sight! Follow him
            this.direction = direction;
            return;
          }
        }
      }
    }

    // Compute route
    const ghostVertex = Ghost.findClosestVertex(map, this.logicalLocation);
    const pacManVertex = this.chooseClosestPacManVertex(map);
    const routeVertices = this.boardGraph.computeShortestRoute(ghostVertex, pacManVertex);

    // Determine whether we are along the first edge (between routeVertices[0] and routeVertices[1])
    const [firstVertex, secondVertex] = routeVertices.slice(0, 2).toArray();
    const [a, b] = firstVertex.toArray();
    const [c, d] = secondVertex.toArray();

    if (isPointOnLine(this.logicalLocation, [c, d], [a, b])) {
      // First vertex is behind us now. Go to the second one
      this.direction = computeDirection(this.logicalLocation, [c, d]);
    } else {
      // We still need to go to the first vertex
      this.direction = computeDirection(this.logicalLocation, [a, b]);
    }

  }

  abstract chooseClosestPacManVertex(map: Drawable[][]): List<number>;

}

enum VulnerabilityState {
  Vulnerable,
  VulnerableBlinking,
  Dangerous
}

export default Ghost;
