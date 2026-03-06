import { connectToMongodb } from "./mongodb";

import type { Guild, Member } from "../types/guild";
import type { Snowflake } from "discord.js";
import type { Collection } from "mongodb";

const COLLECTION_NAME = process.env.DB_COLLECTION_NAME ?? "vc-notice";

let collection: Collection<Guild> | undefined;
const getMongodbCollection = async (): Promise<Collection<Guild> | undefined> => {
  try {
    if (collection) return collection;

    const { db } = await connectToMongodb();
    collection = db.collection<Guild>(COLLECTION_NAME);
    return collection;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const getGuildData = async (guildId: string): Promise<Guild | null> => {
  try {
    const collection = await getMongodbCollection();
    if (!collection) return null;

    return await collection.findOne({ id: guildId });
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const upsertGuildData = async (data: Guild): Promise<boolean> => {
  try {
    const collection = await getMongodbCollection();
    if (!collection) return false;

    const r = await collection.replaceOne({ id: data.id }, data, { upsert: true });
    return typeof r.acknowledged === "boolean" && r.acknowledged;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const deleteGuildData = async (guildId: Snowflake): Promise<boolean> => {
  try {
    const collection = await getMongodbCollection();
    if (!collection) return false;

    const r = await collection.deleteOne({ id: guildId });
    return r.acknowledged;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const unsetWebhookUrlByGuildId = async (guildId: Snowflake): Promise<number> => {
  try {
    const collection = await getMongodbCollection();
    if (!collection) return 0;

    const r = await collection.updateOne({ id: guildId }, { $unset: { webhookUrl: "" } });
    return r.modifiedCount;
  } catch (e) {
    console.error(e);
    return 0;
  }
};

export const updateGuildMembers = async (
  guildId: Snowflake,
  guildName: string,
  members: Member[]
): Promise<boolean> => {
  try {
    const collection = await getMongodbCollection();
    if (!collection) return false;

    // VoiceState 由来の更新では webhookUrl など設定項目を上書きしない
    const r = await collection.updateOne({ id: guildId }, { $set: { name: guildName, members } });
    return r.acknowledged;
  } catch (e) {
    console.error(e);
    return false;
  }
};
