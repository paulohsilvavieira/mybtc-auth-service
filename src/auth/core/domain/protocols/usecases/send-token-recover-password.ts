export abstract class SendTokenRecoverPasswordProtocol {
  execute: (email: string) => Promise<{ message: string }>;
}
