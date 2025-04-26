import { MongoClient, ServerApiVersion } from "mongodb";

const uri = String(process.env.DB_URI);

export const mongoClient = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});
