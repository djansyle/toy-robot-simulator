import { expect } from 'chai';
import Coordinates from 'src/classes/coordinates';

describe('Coordinates Class', function () {
  describe('#constructor', function () {
    it('SHOULD store the x and y', function () {
      const instance = new Coordinates(5, 1);
      expect(instance.x).to.equal(5);
      expect(instance.y).to.equal(1);
    });
  });

  describe('#add', function () {
    it('SHOULD not mutate the current data', function () {
      const instance = new Coordinates(1, 2);
      instance.add(new Coordinates(1, 0));

      expect(instance.x).to.equal(1);
      expect(instance.y).to.equal(2);
    });

    it('SHOULD calculate the delta correctly', function () {
      const instance = new Coordinates(5, 4);

      [
        {
          delta: new Coordinates(1, 0),
          result: new Coordinates(6, 4),
        },
        {
          delta: new Coordinates(-1, 1),
          result: new Coordinates(4, 5),
        },
        {
          delta: new Coordinates(-1, -1),
          result: new Coordinates(4, 3),
        },
      ].forEach(({ delta, result }) =>
        expect(instance.add(delta)).to.deep.equal(result),
      );
    });
  });
});
