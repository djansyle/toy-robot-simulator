export default class OperationError extends Error {
  public constructor() {
    super('Invalid operation.');
  }
}
