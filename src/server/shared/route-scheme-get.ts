import { mongoClient } from "MongoClient";
import Config from "Config";

export default async function routeSchemePointExists(id: string | undefined | string[]) {
  await mongoClient.connect();
  const routeSchemePointsDocument = await mongoClient.db(Config.DB_NAME).collection(Config.ROUTE_SCHEME_POINTS).findOne({ id });
  mongoClient.close();

  return routeSchemePointsDocument;
}
