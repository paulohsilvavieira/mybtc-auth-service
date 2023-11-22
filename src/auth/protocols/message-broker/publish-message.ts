export abstract class PublisherMessage {
  pub: (message: MessageContent, config: MessageConfig) => Promise<void>;
}

export type MessageConfig = {
  exchangeName: string;
  routingKey: string;
};

export type MessageContent = any;
