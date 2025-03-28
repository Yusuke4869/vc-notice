import { MongoClient } from "mongodb";

import { env } from "../env";

import type { Db, Collection, Document } from "mongodb";

const { MONGODB_URI, MONGODB_DB_NAME } = env;

export class Mongodb {
  private static instance: Mongodb | null = null;
  private readonly db: Db;

  private constructor(public readonly client: MongoClient) {
    this.db = client.db(MONGODB_DB_NAME);
  }

  static async getInstance(): Promise<Mongodb> {
    if (this.instance === null) {
      const client = await MongoClient.connect(MONGODB_URI);
      this.instance = new Mongodb(client);
    }

    return this.instance;
  }

  static async getDb(): Promise<Db> {
    const instance = await this.getInstance();
    return instance.db;
  }

  static async getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
    const instance = await this.getInstance();
    return instance.db.collection<T>(collectionName);
  }

  static async ping(): Promise<Document> {
    const instance = await this.getInstance();
    const ping = await instance.db.admin().ping();
    return ping;
  }
}
