export abstract class PublishMessage {
  pub: (message: any, config: MessageConfig) => Promise<void>;
}

export type MessageConfig = {
  exchangeName: string;
  routingKey: string;
};
