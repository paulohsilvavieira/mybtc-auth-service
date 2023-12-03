import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import {
  MessageConfig,
  PublishMessage,
} from 'auth/core/domain/protocols/message-broker/publish-message';

@Injectable()
export class MessageBrokerService implements PublishMessage {
  constructor(private readonly amqpConnection: AmqpConnection) {}
  async pub(message: any, config: MessageConfig): Promise<void> {
    await this.amqpConnection.publish(
      config.exchangeName,
      config.routingKey,
      message,
    );
  }
}
