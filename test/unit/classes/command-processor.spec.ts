/* eslint-disable @typescript-eslint/no-unused-expressions */
import 'test/common';

import { expect } from 'chai';
import sinon from 'sinon';
import Robot from 'src/classes/robot';
import CommandProcessor from 'src/classes/command-processor';
import Coordinates from 'src/classes/coordinates';
import { TurnDirection } from 'src/types';

describe('CommandProcessor Class', function () {
  describe('#process', function () {
    it('SHOULD return false, GIVEN command is not correct', function () {
      [
        'unknown',
        '',
        'PLACE 1.2,1,NORTH',
        'PLACE 1,1.2,NORTH',
        'PLACE 1,1,UNKNOWN',
      ].forEach(
        (command) =>
          expect(new CommandProcessor().process(command)).to.be.false,
      );
    });

    describe('GIVEN commands are correct', function () {
      beforeEach(function () {
        const sandbox = this.sandbox as sinon.SinonSandbox;

        this.cloneStub = sandbox.stub().returns(this.robot);
        this.placeStub = sandbox.stub().returns(this.robot);
        this.checkCoordinateStub = sandbox.stub().returns(true);
        this.turnStub = sandbox.stub().returns(this.robot);
        this.moveStub = sandbox.stub().returns(this.robot);
        this.reportStub = sandbox.stub().returns('1,1,SOUTH');

        this.commandProcessor = new CommandProcessor();
        sandbox.stub(this.commandProcessor, 'emit');

        this.commandProcessor.robot = sandbox.createStubInstance(Robot, {
          clone: this.cloneStub,
          place: this.placeStub,
          move: this.moveStub,
          report: this.reportStub,
          turn: this.turnStub,
        });
      });

      it('SHOULD return true for valid PLACE', function () {
        expect(this.commandProcessor.process('PLACE 1,1,NORTH')).to.be.true;
        expect(this.placeStub.args[0][0]).to.deep.equal(new Coordinates(1, 1));
        expect(this.placeStub.args[0][1]).to.deep.equal('NORTH');
      });

      it('SHOULD return true for LEFT', function () {
        expect(this.commandProcessor.process('LEFT')).to.be.true;
        expect(this.turnStub.args[0][0]).to.equal(TurnDirection.Left);
      });

      it('SHOULD return true for RIGHT', function () {
        expect(this.commandProcessor.process('RIGHT')).to.be.true;
        expect(this.turnStub.args[0][0]).to.equal(TurnDirection.Right);
      });

      it('SHOULD return true for MOVE', function () {
        expect(this.commandProcessor.process('MOVE')).to.be.true;
        expect(this.moveStub.calledOnce).to.be.true;
      });

      it('SHOULD return true for REPORT', function () {
        expect(this.commandProcessor.process('REPORT')).to.be.true;
        expect(this.commandProcessor.emit.args[0][0]).to.equal('data');
        expect(this.commandProcessor.emit.args[0][1]).to.equal('1,1,SOUTH');
      });
    });
  });
});
