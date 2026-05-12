import type { NextApiRequest, NextApiResponse } from "next";
import mongoClientConnectPromise from "MongoClient";
import Config from "Config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const mongoClient = await mongoClientConnectPromise;

    const db = mongoClient.db(Config.DB_NAME);
    const collection = db.collection("tech");

    await collection.updateOne({ _id: "google-crawl" }, { $inc: { count: 1 }, $set: { lastUpdated: new Date() } }, { upsert: true });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to update Googlebot crawl count:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
