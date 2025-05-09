import lqip from "lqip-modern";
import path from "path";

export default async function getLqip(ids: string[]) {
  return Promise.all(
    ids.map((id) =>
      lqip(path.resolve(`./public/${id}/main.webp`), { resize: 64 }).then((result) => ({
        id,
        imageBin: result.metadata.dataURIBase64,
      }))
    )
  );
}
