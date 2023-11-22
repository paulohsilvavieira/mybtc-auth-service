import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MessageConfig,
  PublisherMessage,
} from 'auth/protocols/message-broker/publish-message';

@Injectable()
export class MessageBrokerService implements PublisherMessage {
  constructor(private readonly amqpConnection: AmqpConnection) {}
  async pub(message: any, config: MessageConfig): Promise<void> {
    this.amqpConnection.publish(
      config.exchangeName,
      config.routingKey,
      message,
    );
  }
}
