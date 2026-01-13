export class AuthError extends Error {
  public readonly code: number;

  constructor(message: string, code: number = 401) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    // for proper prototype chain
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export function isAuthError(error: unknown): error is AuthError {
  return (error as Error).name === 'AuthError';
}
