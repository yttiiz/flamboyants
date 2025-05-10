import { Document, FindCursor } from "@deps";
import { RouterContextAppType, UserDataType } from "@controllers";

const queryDocuments = async ({
  limit,
  cursor,
  data,
}: {
  limit: string | undefined;
  cursor: FindCursor<Document>;
  data: UserDataType;
}) => {
  if (limit && typeof +limit === "number") {
    for (let i = 0; i < +limit; i++) {
      const document = await cursor.next();
      if (!document) break;

      data[i + 1] = document;
    }
  } else {
    await cursor.map((document, key) => (data[key + 1] = document));
  }

  return data;
};

export const handleDataRetreiveFromDBService = async <T extends string>({
  ctx,
  cursor,
}: {
  ctx: RouterContextAppType<T>;
  cursor: FindCursor<Document>;
}) => {
  let data: UserDataType = {};
  const limit = ctx.request.url.searchParams.get("limit") ?? "";
  data = await queryDocuments({ limit, cursor, data });

  // Remove "hash" property from `users` object.
  for (const key in data) {
    for (const prop in data[key]) {
      if (prop === "hash") delete data[key][prop];
    }
  }

  return data;
};
