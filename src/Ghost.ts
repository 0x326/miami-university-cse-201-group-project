import { List, Seq } from 'immutable';
import MovableEntity, { Direction, directionSeq } from './MovableEntity';
import Drawable from './Drawable';
import UndirectedWeightedGraph from './UndirectedWeightedGraph';
import Wall from './Wall';
import { computeOrthogonalDistance, computeDirection, isPointOnLine, slope, movePoint, subtractPoints } from './lib';

const VulnerableImg = require('./Images/Vulnerable.png');
const BlinkingImg = require('./Images/Blinking.png');

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
   * Used to enforce strict adherance to the grid
   */
  private lastLogicalLocation: [number, number];
  /**
   * Time to switch from blue to white (or vice versa) in milliseconds.
   */
  readonly flashingInterval = 100;
  protected abstract normalSpriteURI: string;
  // used for alternating between two blinking sprites
  private isFlashingWhite = false;

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
    this.lastLogicalLocation = initialLocation;
    this._pacManLocation = <[number, number]> pacManLocation.slice();
    this.pacManDirection = pacManDirection;
    this.boardGraph = boardGraph;
    this.stopped = false;
    this.speed = 2.3;
  }

  get logicalLocation() {
    const locationDivergence = subtractPoints(this.exactLocation, this.lastLogicalLocation);
    const distance = Math.max(...locationDivergence.map(val => Math.abs(val)));

    if (distance >= 1) {
      // Update this.lastLogicalLocation
      const directionOfChange = computeDirection(this.lastLogicalLocation, this.exactLocation);
      this.lastLogicalLocation = movePoint(this.lastLogicalLocation,
                                           directionOfChange,
                                           Math.floor(distance));
    }

    return this.lastLogicalLocation;
  }

  set logicalLocation(location: [number, number]) {
    super.logicalLocation = location;
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
  * @return Whether this Ghost is vulnerable and blinking
  */
  isVulnerableBlinking(): boolean {
    return this.state === VulnerabilityState.VulnerableBlinking;
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
      const blinker = () => {
        if (this.state === VulnerabilityState.VulnerableBlinking) {
          this.isFlashingWhite = !this.isFlashingWhite;
          window.setTimeout(blinker, this.flashingInterval);
        }
      };
      window.setTimeout(blinker, this.flashingInterval);
    } else {
      throw new Error('Ghost is already blinking');
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
   *              The image drawn should be proportional to maxSize to support scaling.
   */
  draw(board: CanvasRenderingContext2D, maxSize: number) {
    switch (this.state) {
      case VulnerabilityState.VulnerableBlinking:
        if (this.isFlashingWhite) {
          this.sprite.src = BlinkingImg;
          break;
        }
        // Fall through

      case VulnerabilityState.Vulnerable:
        this.sprite.src = VulnerableImg;
        break;

      default:
        this.sprite.src = this.normalSpriteURI;
        break;
    }
    super.draw(board, maxSize);
  }

  static findClosestVertex(map: Drawable[][], logicalLocation: [number, number], preferredDirections= Seq<Direction>([])) {
    const options = Ghost.getMovementOptions(map, logicalLocation);
    // tslint:disable:no-any
    const optionsArray: [string, boolean][] = (Object as any).values(options).filter((val: boolean) => val === true);
    const numberOfOptions = optionsArray.length;

    let closestVertexLocation = logicalLocation;
    // We are not a vertex if we only have two ways to go (ex: O--*--O)
    const isEdge = numberOfOptions === 2 && (
      (options[Direction.North] === true && options[Direction.South] === true) ||
      (options[Direction.East] === true && options[Direction.West] === true));
    if (isEdge) {
      const [x, y] = logicalLocation;
      let minimumDistance: number = Infinity;

      const updateMinimumDistance = (direction: Direction) => {
        const nextWall = Ghost.findUpcomingEntity(map, logicalLocation, direction,
                                                  entity => entity instanceof Wall);
        if (nextWall === undefined) {
          return;
        }
        const [a, b] = movePoint(nextWall, -direction);
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

    if (secondVertex !== undefined && isPointOnLine(this.logicalLocation,
                                                    secondVertex.toJS(),
                                                    [a, b])) {
      // Since the second vertex is in sight, we can focus on it
      this.direction = computeDirection(this.logicalLocation, secondVertex.toJS());
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
