import getRouteSchemePoints from "server/shared/route-scheme-get";

export default async function routeSchemePointsExist(id: string | undefined | string[]) {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    return true;
  }

  const routeSchemePointsDocument = await getRouteSchemePoints(id);

  if (routeSchemePointsDocument) {
    return routeSchemePointsDocument.published;
  } else {
    return false;
  }
}
