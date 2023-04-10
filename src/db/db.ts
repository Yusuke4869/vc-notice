import type { Snowflake } from "discord.js";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import type { Collection, Db, ObjectId } from "mongodb";
import { exit } from "process";

import { Guild } from "../types";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL ?? "";
const DB_NAME = process.env.DB_NAME ?? "bots";
const DB_COLLECTION_NAME = process.env.DB_COLLECTION_NAME ?? "vc-notice";

type Data = Guild & {
  _id?: ObjectId;
};

export class DataBase {
  client: MongoClient;
  db: Db | undefined;
  collection: Collection<Data> | undefined;
  #isConnected: boolean;

  constructor() {
    this.client = new MongoClient(MONGODB_URL);
    this.#isConnected = false;
    this.#init();
  }

  /**
   * 接続
   */
  async #init() {
    await this.client
      .connect()
      .then(() => {
        this.#isConnected = true;
      })
      .catch((e) => {
        console.error(e);
        console.error("Could Not Connected Mongodb");
        exit(1);
      });
    this.db = this.client.db(DB_NAME);
    this.collection = this.db.collection(DB_COLLECTION_NAME);
    console.info("Connected Mongodb.");
  }

  /**
   * 接続が終わるまで待機
   */
  #wait() {
    return new Promise((resolve, reject) => {
      try {
        if (this.#isConnected) {
          resolve("connected");
          return;
        }

        const interval = setInterval(() => {
          if (this.#isConnected) {
            resolve("connected");
            clearInterval(interval);
          }
        }, 100);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * 特定のギルドのデータを返します
   * @param guildId 返してほしいギルドのID
   * @returns ギルドのデータ
   */
  async getGuildData(guildId: string) {
    await this.#wait();
    const res = await this.collection?.findOne({ id: guildId });
    return res;
  }

  /**
   * ギルドのデータを新たに保存します
   * @param guildData ギルドのデータ
   */
  async #createGuildData(guildData: Guild) {
    try {
      const res = await this.collection?.insertOne(guildData);
      return res;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * ギルドのデータを更新します
   * @param guildId 更新するギルドのID
   * @param newGuildData ギルドの新しいデータ
   */
  async updateGuildData(guildId: Snowflake, newGuildData: Guild) {
    try {
      const guildData = await this.getGuildData(guildId);
      if (!guildData) {
        const createRes = this.#createGuildData(newGuildData);
        return createRes;
      }

      const res = await this.collection?.updateOne({ id: guildId }, { $set: newGuildData });
      return res;
    } catch (e) {
      console.error(e);
    }
  }
}
