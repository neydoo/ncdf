import { Connection } from 'typeorm';
import configuration from '../../../config/app.config';

/**
 * Helper class to provide an in memory mongodb database for testing.
 *
 * @todo decouple from MongoDB and allow to test using different DBs
 */
export default class TestDatabase {
  connection: Connection;

  constructor() {
    this.init();
  }

  async init() {
    this.connection
  }

  /**
   * Stop the memory db
   */
  async stop() {
    await this.connection.close();
  }

  /**
   * Seed the test database
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  // async seed(collection: string, payload: object[]) {
  //   const client = new MongoClient(process.env.MONGO_URL, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   });
  //   await client.connect();

  //   const database = client.db();

  //   // This gets most of the tests to run. Drop collections with every attempted insert.
  //   try {
  //     await database.collection(collection).drop();
  //   } catch (e) {
  //     // Do something about the error
  //   }

  //   const coll = database.collection(collection);

  //   // this option prevents additional documents from being inserted if one fails
  //   try {
  //     const options = { ordered: true };

  //     await coll.insertMany(payload, options);
  //   } catch (e) {
  //     // Do something about the error
  //   }

  //   await client.close();
  // }
}
