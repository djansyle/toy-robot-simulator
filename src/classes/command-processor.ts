import { FacingDirection, TurnDirection } from 'src/types';
import EventEmitter from 'events';
import Coordinates from './coordinates';
import Robot from './robot';

/**
 * Process and validates the commands that will be issued to the robot
 * @class
 */
export default class CommandProcessor extends EventEmitter {
  private robot: Robot = new Robot();

  /**
   * Parses and process the command to the robot.
   * @param {string} command
   * @emits {string} message from the robot
   */
  process(command: string) {
    const match = /PLACE (\d+),(\d+),(.+)/gm.exec(command);
    if (match) {
      const [, x, y, facing] = match;

      const parsedX = parseInt(x, 10);
      const parsedY = parseInt(y, 10);
      const facingDirection = facing as FacingDirection;
      const validFacingDirection = Object.values(FacingDirection).includes(
        facingDirection,
      );

      if (
        !Number.isNaN(parsedX) &&
        !Number.isNaN(parsedY) &&
        validFacingDirection
      ) {
        this.robot = this.robot.place(
          new Coordinates(parsedX, parsedY),
          facingDirection,
        );

        return true;
      }

      return false;
    }

    if (command === 'LEFT') {
      this.robot = this.robot.turn(TurnDirection.Left);
      return true;
    }

    if (command === 'RIGHT') {
      this.robot = this.robot.turn(TurnDirection.Right);
      return true;
    }

    if (command === 'REPORT') {
      this.emit('data', this.robot.report());
      return true;
    }

    if (command === 'MOVE') {
      this.robot = this.robot.move();
      return true;
    }

    return false;
  }
}
