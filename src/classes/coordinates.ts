/**
 * Holds the information of the x and y of the coordinates.
 * @class
 * */
export default class Coordinates {
  public constructor(public readonly x: number, public readonly y: number) {}

  /**
   * Creates a deep copy of the current instance
   */
  public clone() {
    return new Coordinates(this.x, this.y);
  }

  /**
   * Adds the x and y of the given delta to the new instance
   * @param {Coordinates} delta
   */
  public add(delta: Coordinates) {
    return new Coordinates(this.x + delta.x, this.y + delta.y);
  }
}
