import { List } from 'immutable';
import MovableEntity, { Direction, directionSeq } from './MovableEntity';
import Drawable from './Drawable';
import MapGraph from './MapGraph';
import Wall from './Wall';
import { computeOrthogonalDistance, computeDirection, isPointOnLine, slope, movePoint, subtractPoints } from './lib';
import MazeMapGraph from './MapGraph';

const VulnerableImg = require('./Images/Vulnerable.png');
const BlinkingImg = require('./Images/Blinking.png');

/**
 * Represents a ghost
 *
 * @author John Meyer, Noah Dirig, Laurel Sexton, Goat Knox Kelly
 * @abstract
 * @class Ghost
 * @extends {MovableEntity}
 */
abstract class Ghost extends MovableEntity {
  state: VulnerabilityState = VulnerabilityState.Dangerous;
  private _pacManLocation: [number, number];
  pacManDirection: Direction;
  boardGraph: MapGraph;

  /**
   * Used to enforce strict adherance to the grid
   *
   * @private
   * @type {[number, number]}
   * @memberof Ghost
   */
  private lastLogicalLocation: [number, number];
  /**
   * Time to switch from blue to white (or vice versa) in milliseconds.
   *
   * @memberof Ghost
   */
  readonly flashingInterval = 100;
  protected abstract normalSpriteURI: string;
  // used for alternating between two blinking sprites
  private isFlashingWhite = false;

  /**
   * Creates an instance of Ghost.
   * @param {[number, number]} initialLocation The starting location
   * @param {[number, number]} pacManLocation Pac-Man's current location
   * @param {Direction} pacManDirection Pac-Man's current direction
   * @param {MapGraph} boardGraph The currently loaded board
   * @memberof Ghost
   */
  constructor(initialLocation: [number, number],
              pacManLocation: [number, number],
              pacManDirection: Direction,
              boardGraph: MapGraph) {
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
   * @returns {boolean} Whether this Ghost is vulnerable
   * @memberof Ghost
   */
  isVunerable(): boolean {
    return this.state !== VulnerabilityState.Dangerous;
  }

  /**
   * @returns {boolean} Whether this Ghost is vulnerable and blinking
   * @memberof Ghost
   */
  isVulnerableBlinking(): boolean {
    return this.state === VulnerabilityState.VulnerableBlinking;
  }

  /**
   * Makes this Ghost vulnerable
   *
   * @memberof Ghost
   */
  makeVulnerable(): void {
    this.state = VulnerabilityState.Vulnerable;
    this.speed = 1.5;
  }

  /**
   * Makes this Ghost start blinking.
   * If this method is called when the ghost is not vulnerable, an exception will be thrown.
   *
   * @memberof Ghost
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
   *
   * @memberof Ghost
   */
  makeDangerous(): void {
    this.state = VulnerabilityState.Dangerous;
    this.speed = 2.3;
  }

  /**
   * Draw this object on the graphic at the given location.
   *
   * @param {CanvasRenderingContext2D} board The graphic to draw on
   * @param {number} maxSize The maximum size of the image.
   *                         The image drawn should be proportional to maxSize to support scaling.
   * @memberof Ghost
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

  /**
   * Chooses a direction based on the current game map
   *
   * @param {Drawable[][]} map The map off of which to choose
   * @memberof MovableEntity
   */
  chooseDirection(map: Drawable[][]): void {
    const options = Ghost.getMovementOptions(map, this.logicalLocation);

    // Check to see whether Pac-Man is within sight
    const pacManLineSlope = slope(this._pacManLocation, this.logicalLocation);
    if (pacManLineSlope === 0 || pacManLineSlope === Infinity) {
      const direction = computeDirection(this.logicalLocation, this._pacManLocation);

      if (options[direction] === true) {
        const upcomingEntity = MazeMapGraph.findUpcomingEntity(map, this.logicalLocation, direction,
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
    const ghostVertex = this.boardGraph.findClosestVertex(this.logicalLocation);
    const pacManVertex = this.chooseClosestPacManVertex();
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

    // if a PowerPellet is eaten, the ghosts flee from PacMan
    if (this.state === VulnerabilityState.Vulnerable ||
        this.state === VulnerabilityState.VulnerableBlinking) {

      // as long as there is no wall, go the opposite direction
      if (options[-this.direction] === true) {
        this.direction = -this.direction;
      } else {
        // Otherwise, go any other direction
        this.direction = directionSeq.filter(direction => direction !== this.direction)
          .filter(direction => direction !== undefined && options[direction] === true)
          .first();
      }
    }
  }

  /**
   * Chooses the vertex closest to Pac-Man.
   *
   * @abstract
   * @returns {List<number>}
   * @memberof Ghost
   */
  abstract chooseClosestPacManVertex(): List<number>;

}

enum VulnerabilityState {
  Vulnerable,
  VulnerableBlinking,
  Dangerous
}

export default Ghost;
