import mongoClientConnectPromise from "MongoClient";
import Config from "Config";

export default async function routeSchemePointExists(id: string | undefined | string[]) {
  const mongoClient = await mongoClientConnectPromise;
  const routeSchemePointsDocument = await mongoClient.db(Config.DB_NAME).collection(Config.ROUTE_SCHEME_POINTS).findOne({ id });

  return routeSchemePointsDocument;
}
