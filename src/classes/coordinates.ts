export default class Coordinates {
  public constructor(public readonly x: number, public readonly y: number) {}

  public add(delta: Coordinates) {
    return new Coordinates(this.x + delta.x, this.y + delta.y);
  }
}
