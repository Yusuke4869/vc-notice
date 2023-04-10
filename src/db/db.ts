import type { Snowflake } from "discord.js";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import type { Collection, Db, ObjectId } from "mongodb";

import { languages } from "../util";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL ?? "";
const DB_NAME = process.env.DB_NAME ?? "bot";
const DB_COLLECTION_NAME = process.env.DB_COLLECTION_NAME ?? "vc-notice";
const DATA_NAME = process.env.DATA_NAME ?? "vc-notice";

type Data = {
  _id?: ObjectId;
  name: string;
  data: GuildData[];
};

type GuildData = {
  guildID: Snowflake;
  lang: keyof typeof languages;
  webhookurl: string | undefined;
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
    await this.client.connect().then().catch(console.error);
    this.db = this.client.db(DB_NAME);
    this.collection = this.db.collection(DB_COLLECTION_NAME);
    this.#isConnected = true;
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
   * すべてのGuildのデータを返します
   * @returns すべてのGuildのデータ
   */
  async #getGuildsData() {
    try {
      await this.#wait();
      const res = await this.collection?.findOne({ name: DATA_NAME });
      return res;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 特定のギルドのデータを返します
   * @param guildId 返してほしいギルドのID
   * @returns ギルドのデータ
   */
  async getGuildData(guildId: string) {
    const guildsData = await this.#getGuildsData();
    const res = guildsData?.data.find((value) => value.guildID === guildId);
    return res;
  }

  /**
   * ギルドのデータを更新します
   * @param guildID 更新するギルドのID
   * @param newGuildData 該当ギルドの新しいデータ
   */
  async updateGuildData(guildID: Snowflake, newGuildData: GuildData) {
    try {
      await this.#wait();
      const guildsData = await this.#getGuildsData();
      const data = guildsData?.data.filter((v) => v.guildID !== guildID);
      if (!data) return;

      const setData = [...data, newGuildData];
      const res = await this.collection?.updateOne({ name: DATA_NAME }, { $set: { data: setData } });
      return res;
    } catch (e) {
      console.error(e);
    }
  }
}
