export interface SaveAddressUserUsecaseInput {
  address: string;
  state: string;
  country: string;
  proofAddress: string;
  authenticationId: string;
}
export interface SaveAddressUserUsecaseOutput {
  success: boolean;
  error?: string;
}

export abstract class SaveAddressUserProtocol {
  exec: (
    input: SaveAddressUserUsecaseInput,
  ) => Promise<SaveAddressUserUsecaseOutput>;
}
