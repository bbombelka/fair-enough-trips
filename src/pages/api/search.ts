import type { NextApiRequest, NextApiResponse } from "next";
import mongoClientConnectPromise from "MongoClient";
import Config from "Config";

type Data = {
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const searchTermRegex = new RegExp(req.query.searchTerm as string);
    const isProd = process.env.NODE_ENV === "production";

    const mongoClient = await mongoClientConnectPromise;

    const TITLE_QUERY = searchQueryBuilder("title", searchTermRegex);
    const ID_QUERY = searchQueryBuilder("id", searchTermRegex);
    const DESCRIPTION_QUERY = searchQueryBuilder("shortDescription", searchTermRegex);
    const LOGICAL_OPERATOR_OR = { $or: [TITLE_QUERY, ID_QUERY, DESCRIPTION_QUERY] };
    const QUERY_PROJECTION = { category: true, title: true, id: true, postDate: true, base64Image: true };

    const latestPosts = await mongoClient
      .db(Config.DB_NAME)
      .collection(Config.POSTS_COLLECTION)
      .find(
        { ...LOGICAL_OPERATOR_OR, ...(isProd ? { published: true } : {}) },
        {
          projection: QUERY_PROJECTION,
        },
      )
      .sort({ postDate: -1 })
      .limit(25)
      .toArray();

    return res.status(200).json(JSON.parse(JSON.stringify(latestPosts)));
  } catch (error) {}
}

function searchQueryBuilder(field: string, regex: RegExp) {
  return {
    [field]: { $regex: regex, $options: "i" },
  };
}
