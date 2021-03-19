/**
 * Connect to a Kafka instance
 *
 * @todo create custom decorator for this.
 * @todo abstract this implementation
 */
import { CompressionTypes, Kafka, Message } from 'kafkajs';
import configuration from '../../../../config/app.config';
import { Injectable } from '@nestjs/common';
import { QueueBroker } from '@ncdf/core/queues/queue.broker';

@Injectable()
export default class KafkaBroker extends QueueBroker {
  private kafkaClient: Kafka;

  constructor() {
    super();

    this.initClient();
  }

  /**
   * Initialize kafka client
   */
  async initClient() {
    try {
      this.kafkaClient = new Kafka({
        brokers: configuration().kafka.endpoint.split(' '),
        clientId: 'CoinBase',
        retry: {
          retries: 100,
        },
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Return the kafka client.
   */
  async client(): Promise<Kafka> {
    return this.kafkaClient;
  }

  /**
   * Produce messages for kafka
   */
  async produce(topic = 'event-bus', messages: Message[]) {
    const producer = this.kafkaClient.producer();
    try {
      await producer.connect();
    } catch (error) {
      console.log(error.message);
    }
    await producer.send({
      topic,
      compression: CompressionTypes.GZIP,
      messages
    });
  }

  /**
   * Register a new topic
   *
   * @param topic
   */
  async registerTopic(topic: string): Promise<void> {
    try {
      const admin = this.kafkaClient.admin();

      await admin.createTopics({
        waitForLeaders: true,
        topics: [{ topic }],
      });

      await admin.disconnect();
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Subscribe to a kafka topic and pass the appropriate handler
   *
   * @param topic
   * @param handler
   * @param groupId
   * @param dataModel
   * @param queue
   */
  async subscribe(
    topic: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    handler: Function,
    groupId?: string,
    dataModel?: any,
    queue?: any,
  ): Promise<void> {
    try {
      const consumer = this.kafkaClient.consumer({ groupId });
      await consumer.connect();
      await consumer.subscribe({ topic });

      const model = dataModel;
      const queueInstance = queue;

      await consumer.run({
        async eachMessage({ message }) {
          await handler(message, model, queueInstance);
        },
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
