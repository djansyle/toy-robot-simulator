/* eslint-disable @typescript-eslint/no-unused-expressions */
import 'test/common';

import { expect } from 'chai';
import sinon from 'sinon';
import Coordinates from 'src/classes/coordinates';
import Robot from 'src/classes/robot';
import { FacingDirection, TurnDirection } from 'src/types';
import OperationError from 'src/classes/operation-error';

describe('Robot Class', function () {
  beforeEach(function () {
    this.robot = new Robot();
  });

  describe('#place', function () {
    beforeEach(async function () {
      this.checkCoordinateStub = (this.sandbox as sinon.SinonSandbox).stub(
        this.robot,
        'checkCoordinates',
      );

      this.robot = this.robot.place(
        new Coordinates(1, 2),
        FacingDirection.North,
      );
    });

    it('SHOULD call the #checkCoordinates', function () {
      const stub = this.checkCoordinateStub as sinon.SinonStub;
      expect(stub.calledOnce).to.be.true;
      expect(stub.args).to.have.deep.nested.property(
        '0.0',
        new Coordinates(1, 2),
      );
    });

    it('SHOULD assign the new coordinates', function () {
      expect(this.robot)
        .to.have.property('coordinates')
        .deep.equal(new Coordinates(1, 2));
    });

    it('SHOULD assign the new facing', function () {
      expect(this.robot).to.have.property('facing', FacingDirection.North);
    });
  });

  describe('#checkCoordinates', function () {
    it('SHOULD throw error, GIVEN coordinates are invalid', function () {
      [
        new Coordinates(-1, 0),
        new Coordinates(0, -1),
        new Coordinates(-1, -1),
        new Coordinates(6, 0),
        new Coordinates(0, 6),
        new Coordinates(6, 6),
      ].forEach((coords) => {
        expect(() => this.robot.checkCoordinates(coords)).to.be.throw(
          OperationError,
        );
      });
    });

    it('SHOULD not throw an error, GIVEN coordinates are valid', function () {
      [
        new Coordinates(0, 0),
        new Coordinates(1, 0),
        new Coordinates(4, 5),
        new Coordinates(5, 5),
        new Coordinates(0, 5),
        new Coordinates(0, 3),
      ].forEach((coords) => {
        expect(() => this.robot.checkCoordinates(coords)).to.not.throw;
      });
    });
  });

  describe('#turn', function () {
    it('SHOULD turn to the correct facing', function () {
      [
        {
          facing: FacingDirection.North,
          turn: TurnDirection.Left,
          expected: FacingDirection.West,
        },
        {
          facing: FacingDirection.North,
          turn: TurnDirection.Right,
          expected: FacingDirection.East,
        },
        {
          facing: FacingDirection.East,
          turn: TurnDirection.Left,
          expected: FacingDirection.North,
        },
        {
          facing: FacingDirection.East,
          turn: TurnDirection.Right,
          expected: FacingDirection.South,
        },

        {
          facing: FacingDirection.South,
          turn: TurnDirection.Left,
          expected: FacingDirection.East,
        },
        {
          facing: FacingDirection.South,
          turn: TurnDirection.Right,
          expected: FacingDirection.West,
        },

        {
          facing: FacingDirection.West,
          turn: TurnDirection.Left,
          expected: FacingDirection.South,
        },
        {
          facing: FacingDirection.West,
          turn: TurnDirection.Right,
          expected: FacingDirection.North,
        },
      ].forEach(({ facing, turn, expected }) => {
        expect(
          new Robot().place(new Coordinates(0, 0), facing).turn(turn),
        ).to.have.property('facing', expected);
      });
    });

    it('SHOULD not mutate the current instance', function () {
      const robot = new Robot().place(
        new Coordinates(1, 1),
        FacingDirection.North,
      );
      robot.turn(TurnDirection.Left);

      expect(robot).to.have.property('facing', FacingDirection.North);
    });
  });

  describe('#move', function () {
    it('SHOULD throw OperationError, WHEN it will go out of bounds', function () {
      [
        {
          coordinates: new Coordinates(0, 0),
          facing: FacingDirection.West,
        },
        {
          coordinates: new Coordinates(0, 0),
          facing: FacingDirection.South,
        },
        {
          coordinates: new Coordinates(5, 0),
          facing: FacingDirection.South,
        },
        {
          coordinates: new Coordinates(5, 0),
          facing: FacingDirection.East,
        },
        {
          coordinates: new Coordinates(0, 5),
          facing: FacingDirection.North,
        },
        {
          coordinates: new Coordinates(0, 5),
          facing: FacingDirection.West,
        },
        {
          coordinates: new Coordinates(5, 5),
          facing: FacingDirection.North,
        },
        {
          coordinates: new Coordinates(5, 5),
          facing: FacingDirection.East,
        },
      ].forEach(({ coordinates, facing }) =>
        expect(() => new Robot().place(coordinates, facing).move()).to.throw(
          OperationError,
        ),
      );
    });

    it('SHOULD move correctly to the next coordinate', function () {
      [
        {
          coordinates: new Coordinates(0, 0),
          facing: FacingDirection.North,
          newCoordinates: new Coordinates(0, 1),
        },
        {
          coordinates: new Coordinates(0, 0),
          facing: FacingDirection.East,
          newCoordinates: new Coordinates(1, 0),
        },
        {
          coordinates: new Coordinates(5, 0),
          facing: FacingDirection.West,
          newCoordinates: new Coordinates(4, 0),
        },
        {
          coordinates: new Coordinates(5, 0),
          facing: FacingDirection.North,
          newCoordinates: new Coordinates(5, 1),
        },
        {
          coordinates: new Coordinates(0, 5),
          facing: FacingDirection.South,
          newCoordinates: new Coordinates(0, 4),
        },
        {
          coordinates: new Coordinates(0, 5),
          facing: FacingDirection.East,
          newCoordinates: new Coordinates(1, 5),
        },
        {
          coordinates: new Coordinates(5, 5),
          facing: FacingDirection.South,
          newCoordinates: new Coordinates(5, 4),
        },
        {
          coordinates: new Coordinates(5, 5),
          facing: FacingDirection.West,
          newCoordinates: new Coordinates(4, 5),
        },
      ].forEach(({ coordinates, facing, newCoordinates }) => {
        expect(() =>
          new Robot().place(coordinates, facing).move(),
        ).to.not.throw(OperationError);

        expect(new Robot().place(coordinates, facing).move())
          .to.have.property('coordinates')
          .that.is.deep.equal(newCoordinates);
      });
    });

    it('SHOULD not mutate the current instance', function () {
      const robot = new Robot().place(
        new Coordinates(1, 1),
        FacingDirection.North,
      );

      robot.move();

      expect(robot)
        .to.have.property('coordinates')
        .to.deep.equal(new Coordinates(1, 1));
    });
  });

  describe('#report', function () {
    it('SHOULD return empty string, WHEN not placed', function () {
      expect(new Robot().report()).to.equal('');
    });

    it('SHOULD return the correct report', function () {
      expect(
        new Robot()
          .place(new Coordinates(1, 2), FacingDirection.North)
          .report(),
      ).to.equal('1,2,NORTH');
    });
  });
});
