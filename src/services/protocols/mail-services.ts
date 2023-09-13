export abstract class MailerServiceProtocol {
  sendEmail: (params: any) => Promise<{ success: boolean; messageId: string }>;
}
