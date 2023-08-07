export abstract class JwtProtocol {
  createToken: (payload: any) => Promise<{ token: string }>;
  verifyToken: <T = any>(
    token: string,
  ) => Promise<{ isValid: boolean; payload: T }>;
}
