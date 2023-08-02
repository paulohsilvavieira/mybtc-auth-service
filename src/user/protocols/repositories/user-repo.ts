export abstract class UserRepoProtocol {
  createUser: (params: CreateUserRepoInput) => Promise<CreateUserRepoOutput>;
  saveAddressUser: (
    params: SaveAddressInfoRepoInput,
  ) => Promise<SaveAddressInfoRepoOutput>;
  saveDocuments: (
    params: SaveUserDocumentsInfoRepoInput,
  ) => Promise<SaveUserDocumentsInfoRepoOutput>;
}

export type CreateUserRepoInput = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  authenticationId: string;
};

export type CreateUserRepoOutput = {
  success: boolean;
  error?: string;
};

export type SaveAddressInfoRepoInput = {
  address: string;
  state: string;
  country: string;
  proofAddress: string;
  authenticationId: string;
};

export type SaveAddressInfoRepoOutput = {
  success: boolean;
  error?: string;
};

export type SaveUserDocumentsInfoRepoInput = {
  document: string;
  typeDocument: string;
  proofDocumentFront: string;
  proofDocumentBack: string;
  authenticationId: string;
};

export type SaveUserDocumentsInfoRepoOutput = {
  success: boolean;
  error?: string;
};
