import { oak } from "@deps";
import { NotFoundController } from "@controllers";

export const notFoundMiddleware = async (
  ctx: oak.Context,
  next: () => Promise<unknown>,
) => {
  try {
    await next();
  } catch (error) {
    const notFound = new NotFoundController();

    await notFound.handle404Response(
      ctx,
      (error as { status: number }).status,
    );
  }
};
