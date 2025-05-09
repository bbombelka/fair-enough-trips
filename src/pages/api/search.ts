// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { mongoClient } from "MongoClient";
import Config from "Config";

type Data = {
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const searchTermRegex = new RegExp(req.query.searchTerm as string);

    await mongoClient.connect();

    const TITLE_QUERY = searchQueryBuilder("title", searchTermRegex);
    const ID_QUERY = searchQueryBuilder("id", searchTermRegex);
    const DESCRIPTION_QUERY = searchQueryBuilder("shortDescription", searchTermRegex);
    const LOGICAL_OPERATOR_OR = { $or: [TITLE_QUERY, ID_QUERY, DESCRIPTION_QUERY] };
    const QUERY_PROJECTION = { category: true, title: true, id: true, postDate: true, base64Image: true };

    const latestPosts = await mongoClient
      .db(Config.DB_NAME)
      .collection(Config.POSTS_COLLECTION)
      .find(LOGICAL_OPERATOR_OR, {
        projection: QUERY_PROJECTION,
      })
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
