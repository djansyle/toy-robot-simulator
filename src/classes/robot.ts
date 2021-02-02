import { TurnDirection, FacingDirection } from 'src/types';
import OperationError from './operation-error';
import Coordinates from './coordinates';

/**
 * Map for the next facing direction based on the turn direction.
 * Left of North is West, Right of West is North, etc.
 */
const FacingDirectionMap = [
  FacingDirection.North,
  FacingDirection.East,
  FacingDirection.South,
  FacingDirection.West,
];

/**
 * Delta coordinates for moving based of where the robot is facing
 */
const MoveDirectionDeltaMap: { [key in FacingDirection]: Coordinates } = {
  [FacingDirection.North]: new Coordinates(0, 1),
  [FacingDirection.East]: new Coordinates(1, 0),
  [FacingDirection.South]: new Coordinates(0, -1),
  [FacingDirection.West]: new Coordinates(-1, 0),
};

/**
 * Robot that will be placed or moved to the plane with 5x5 size.
 */
export default class Robot {
  private coordinates?: Coordinates;

  private facing?: FacingDirection;

  /**
   * Creates a deep copy of the current instance
   */
  public clone() {
    const robot = new Robot();
    if (this.coordinates) {
      robot.coordinates = this.coordinates.clone();
    }

    if (this.facing) {
      robot.facing = this.facing;
    }

    return robot;
  }

  /**
   * Places the robots to the given `coordinates` and `facing` direction
   * @param {Coordinates} coordinates
   * @param {FacingDirection} facing
   * @throws {OperationError}
   */
  public place(coordinates: Coordinates, facing: FacingDirection) {
    this.checkCoordinates(coordinates);

    const clone = this.clone();
    clone.coordinates = coordinates;
    clone.facing = facing;

    return clone;
  }

  /**
   * Checks the given coordinates whether it's a valid or not.
   * @param {Coordinates}
   * @throws {OperationError} when the coordinates will be out of bounds.
   */
  private checkCoordinates({ x, y }: Coordinates) {
    if (x > 5 || x < 0 || y > 5 || y < 0) {
      throw new OperationError();
    }
  }

  /**
   * Turns the robot 90 degrees for right and -90 degrees for left
   * @param {TurnDirection} direction
   * @throws {OperationError}
   */
  public turn(direction: TurnDirection) {
    if (!this.facing) {
      throw new OperationError();
    }

    const clone = this.clone();
    const idx = FacingDirectionMap.indexOf(this.facing) + direction;

    // When turning LEFT and currently facing on the North
    if (idx < 0) {
      clone.facing = FacingDirectionMap[3] as FacingDirection;
      return clone;
    }

    // When turning RIGHT and currently facing on WEST
    if (idx > 3) {
      clone.facing = FacingDirectionMap[0] as FacingDirection;
      return clone;
    }

    clone.facing = FacingDirectionMap[idx];
    return clone;
  }

  /**
   * Moves the robot 1 unit forward
   * @throws {OperationError}
   */
  public move() {
    // Cannot move when it's not placed yet
    if (!this.coordinates || !this.facing) {
      throw new OperationError();
    }

    const newCoordinates = this.coordinates.add(
      MoveDirectionDeltaMap[this.facing],
    );

    // Check whether the new coordinates are valid
    this.checkCoordinates(newCoordinates);

    const clone = this.clone();
    clone.coordinates = newCoordinates;
    return clone;
  }

  /**
   * Get the current position and facing of the robot
   * @throws {OperationError}
   */
  public report() {
    if (!this.coordinates || !this.facing) {
      throw new OperationError();
    }

    return `${this.coordinates.x},${this.coordinates.y},${this.facing}`;
  }
}
