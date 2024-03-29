export abstract class Bcrypt {
  encrypt: (plainText: string) => Promise<{ hashText: string }>;

  verifyHash: (
    plainText: string,
    hashedText: string,
  ) => Promise<{ isValid: boolean }>;
}
