export abstract class BcryptProtocol {
  encrypt: (plainText: string) => Promise<{ hashText: string }>;

  verifyHash: (
    hashedText: string,
    plainText: string,
  ) => Promise<{ isValid: boolean }>;
}
