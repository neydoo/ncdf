/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

@Injectable()
export default class ActionsExplorer implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {
  }

  onModuleInit(): any {
    this.explore();
  }

  explore() {
    const providers: InstanceWrapper[] = this.discoveryService.getProviders();

    providers.forEach((wrapper: InstanceWrapper) => {
      const { instance } = wrapper;

      if (!instance || !Object.getPrototypeOf(instance)) {
        return;
      }

      this.metadataScanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        (key: string) => this.lookupActions(instance, key),
      );
    });
  }

  async lookupActions(instance: Record<string, Function>, key: string) {
    const methodRef = instance[key];

    // if (key === 'defineActions') {
    //
    // }
  }
}
