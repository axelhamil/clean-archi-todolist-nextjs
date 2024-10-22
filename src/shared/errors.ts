export class DomainError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class DatabaseOperationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class NotFoundError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class ConflictError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class FirebaseError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class InputParseError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class AuthenticateError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
