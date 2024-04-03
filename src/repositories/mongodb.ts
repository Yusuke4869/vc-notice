import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import type { Db } from "mongodb";

dotenv.config();

const { MONGODB_URI, MONGODB_DB_NAME } = process.env;

if (!MONGODB_URI) throw new Error("Invalid/Missing environment variable: MONGODB_URI");
const DB_NAME = MONGODB_DB_NAME ?? "bots";

let client: MongoClient | undefined;
let db: Db | undefined;

export const connectToMongodb = async () => {
  if (client && db) return { client, db };

  client = await MongoClient.connect(MONGODB_URI);
  db = client.db(DB_NAME);
  return { client, db };
};
