import KafkaBroker from '@ncdf/core/queues/brokers/kafka/KafkaBroker';
import { DynamicModule, Module } from '@nestjs/common';
import { QueueBroker } from '@ncdf/core/queues/queue.broker';
import ActionsExplorer from '@ncdf/core/queues/actions.explorer';
import { DiscoveryModule } from '@nestjs/core';
import KafkaBrokerFake from '@ncdf/utils/testing/kafka/KafkaBrokerFake';

const queueServiceProvider = {
  provide: QueueBroker,
  useClass: process.env.NODE_ENV === 'test'
    ? KafkaBrokerFake
    : KafkaBroker,
};

@Module({
  imports: [
    DiscoveryModule,
  ],
  providers: [
    queueServiceProvider,
  ],
  exports: [QueueBroker],
})

export default class QueueModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: QueueModule,
      providers: [ActionsExplorer],
      exports: [],
    };
  }
}
