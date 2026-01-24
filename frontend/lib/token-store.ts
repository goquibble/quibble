class TokenStore {
  private static instance: TokenStore;
  private accessToken: string | null = null;

  private constructor() {}

  public static getInstance(): TokenStore {
    if (!TokenStore.instance) {
      TokenStore.instance = new TokenStore();
    }
    return TokenStore.instance;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public setAccessToken(token: string): void {
    this.accessToken = token;
  }

  public clear(): void {
    this.accessToken = null;
  }

  public hasAccessToken(): boolean {
    return !!this.accessToken;
  }
}

export const tokenStore = TokenStore.getInstance();
