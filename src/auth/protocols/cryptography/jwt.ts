export abstract class JwtProtocol {
  createToken: (payload: any) => Promise<{ token: string }>;
  verifyToken: (token: string) => Promise<{ isValid: boolean; payload: any }>;
}
