import { oak } from "@deps";
import { dynamicRoutes } from "@dynamic-routes";

export const staticsFilesMiddleware = async (
  ctx: oak.Context,
  next: () => Promise<unknown>,
) => {
  let path = ctx.request.url.pathname;
  const opts: oak.SendOptions = { root: "" };

  switch (ctx.request.method) {
    case "POST":
      opts.root = Deno.cwd();
      break;

    case "GET":
      opts.root = `${Deno.cwd()}/public`;
      break;
  }

  for (const [, route] of dynamicRoutes) {
    if (path.includes(route)) {
      path = path.replace(route, "");
    }
  }

  await oak.send(ctx, path, opts);
  await next();
};
