/**
 * Error that identifies that the operation is not a valid.
 */
export default class OperationError extends Error {
  public constructor() {
    super('Invalid operation.');
  }
}
