export abstract class SendTokenRecoverPasswordProtocol {
  exec: (
    params: SendTokenRecoverPasswordInput,
  ) => Promise<SendTokenRecoverPasswordOutput>;
}

export type SendTokenRecoverPasswordInput = {
  email: string;
};

export type SendTokenRecoverPasswordOutput = {
  success: boolean;
};
