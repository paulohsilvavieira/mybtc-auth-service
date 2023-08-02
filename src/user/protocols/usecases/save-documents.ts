export interface SaveDocumentsUserUsecaseInput {
  document: string;
  typeDocument: string;
  proofDocumentFront: string;
  proofDocumentBack: string;
  authenticationId: string;
}
export interface SaveDocumentsUserUsecaseOutput {
  success: boolean;
  error?: string;
}

export abstract class SaveDocumentsUserProtocol {
  exec: (
    input: SaveDocumentsUserUsecaseInput,
  ) => Promise<SaveDocumentsUserUsecaseOutput>;
}
