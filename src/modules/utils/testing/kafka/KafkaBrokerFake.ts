import { Injectable } from '@nestjs/common';

@Injectable()
export default class KafkaBrokerFake {
  async subscribe() {
    return true;
  }

  /**
   * @todo setup this fake better
   */
  async registerTopic() {
    return true;
  }

  async produce() {
    return true;
  }

  /**
   * @todo setup the fake better
   */
  async client() {
    return true;
  }
}
