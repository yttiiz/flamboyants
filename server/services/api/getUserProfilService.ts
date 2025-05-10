import { RouterContextAppType } from "@controllers";
import { Mongo, UserSchemaWithIDType } from "@mongo";

export const getUserProfilService = async <T extends string>(
  ctx: RouterContextAppType<T>,
) => {
  const email = await ctx.state.session.get("userEmail");
  const { firstname, lastname, birth, job, photo } = (await Mongo.selectFromDB(
    "users",
    email,
    "email",
  )) as UserSchemaWithIDType;

  return JSON.stringify({
    firstname,
    lastname,
    birth,
    job,
    photo,
    email,
  });
};
