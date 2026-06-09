import type { NextApiRequest, NextApiResponse } from "next";
import { getLatestPosts } from "server/shared/posts";

type Data = {
  name: string;
};

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const rawSearchTerm = Array.isArray(req.query.searchTerm) ? req.query.searchTerm[0] : req.query.searchTerm;
    const sanitizedSearchTerm = escapeRegExp(rawSearchTerm || "");
    const searchTermRegex = new RegExp(sanitizedSearchTerm);

    const TITLE_QUERY = searchQueryBuilder("title", searchTermRegex);
    const ID_QUERY = searchQueryBuilder("id", searchTermRegex);
    const DESCRIPTION_QUERY = searchQueryBuilder("shortDescription", searchTermRegex);
    const LOGICAL_OPERATOR_OR = { $or: [TITLE_QUERY, ID_QUERY, DESCRIPTION_QUERY] };
    const SKIP_SUBPOSTS = { parentId: { $exists: false } };

    const latestPosts = await getLatestPosts({ ...LOGICAL_OPERATOR_OR, ...SKIP_SUBPOSTS }, 25);

    // Strip category for search response to reduce payload, search component only needs a few fields
    const searchResults = latestPosts.map(({ id, title, postDate, base64Image, category }) => ({
      id,
      title,
      postDate,
      base64Image,
      category,
    }));

    return res.status(200).json(searchResults as any);
  } catch (error) {}
}

function searchQueryBuilder(field: string, regex: RegExp) {
  return {
    [field]: { $regex: regex, $options: "i" },
  };
}
