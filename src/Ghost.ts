import { List } from 'immutable';
import MovableEntity, { Direction } from './MovableEntity';
import Drawable from './Drawable';
import DirectedWeightedGraph from './DirectedWeightedGraph'
import Wall from './Wall';
import { computeOrthogonalDistance } from './lib';

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
  private boardGraph: DirectedWeightedGraph<List<number>>;

  /**
   * Creates a MovableEntity
   *
   * @param initialLocation The starting location of this entity.
   */
  constructor(initialLocation: [number, number]) {
    super(initialLocation);
    this.stopped = false;
    this.speed = 2.3;
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
      this.logicalLocation[0] * maxSize - maxSize,
      this.logicalLocation[1] * maxSize - maxSize
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

  findClosestVertex(map: Drawable[][]) {
    const options = this.getMovementOptions(map);
    // tslint:disable:no-any
    const optionsArray: [string, boolean][] = (Object as any).values(options).filter((val: boolean) => val === true);
    const numberOfOptions = optionsArray.length;

    let closestVertexLocation = this.logicalLocation;
    if (numberOfOptions === 2) {
      const [x, y] = this.logicalLocation;
      let minimumDistance: number = Infinity;

      const updateMinimumDistance = (direction: Direction) => {
        const [a, b] = this.findUpcomingEntity(map, direction, entity => entity instanceof Wall);
        const distance = computeOrthogonalDistance([a, b], [x, y]);
        if (distance < minimumDistance) {
          closestVertexLocation = [a, b];
          minimumDistance = distance;
        }
      };

      if (options[Direction.North] === true) {
        updateMinimumDistance(Direction.North);
      } else if (options[Direction.South] === true) {
        updateMinimumDistance(Direction.South);
      } else if (options[Direction.West] === true) {
        updateMinimumDistance(Direction.West);
      } else {
        updateMinimumDistance(Direction.East);
      }
    }

    return List(closestVertexLocation);
  }

}

enum VulnerabilityState {
  Vulnerable,
  VulnerableBlinking,
  Dangerous
}

export default Ghost;
