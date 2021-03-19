/* eslint-disable @typescript-eslint/ban-types */
import { Message } from 'kafkajs';

export abstract class QueueBroker {
  /**
   * Produce a queue message
   *
   * @param topic
   * @param messages
   */
  abstract async produce(topic: string, messages: Message[]);

  /**
   * Subscribe to topics
   */
  abstract async subscribe(
    topic: string,
    handler: Function,
    groupId?: string,
    dataModel?: any,
    queue?: any
  );

  /**
   * Return the broker
   */
  abstract async client();

  /**
   * Register new topics
   */
  abstract async registerTopic(topic: string);
}
