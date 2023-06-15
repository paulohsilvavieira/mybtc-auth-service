export abstract class EncrypterProtocol {
  encrypt: (plainText: string) => Promise<{ hashText: string }>;
}

export abstract class VerifyHashProtocol {
  verifyHash: (
    hashedText: string,
    plainText: string,
  ) => Promise<{ isValid: boolean }>;
}
