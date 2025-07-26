import { DefaultController, RouterContextAppType } from "@controllers";
import { Mongo } from "@mongo";

export class ForgotPasswordService {
  private default;

  constructor(defaultController: DefaultController) {
    this.default = defaultController;
  }

  public getUserFirstname = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    if (this.isNotAuthorized(ctx)) {
      return this.default.response(
        ctx,
        JSON.stringify({
          errorMsg:
            "Accès non autorisé : La clé d'api n'est pas bonne ou non fourni.",
        }),
        403,
      );
    }

    try {
      const { email } = await ctx.request.body.json();
      const cursor = await Mongo.selectFromDB("users", email, "email");

      if ("_id" in cursor) {
        const { firstname } = cursor;
        this.default.response(ctx, { firstname }, 200);
      } else {
        this.default.response(ctx, { message: "User not found" }, 404);
      }
    } catch (error) {
      console.log("error :", error);
    }
  };

  public sendEmail = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    if (this.isNotAuthorized(ctx)) {
      return this.default.response(
        ctx,
        JSON.stringify({
          errorMsg:
            "Accès non autorisé : La clé d'api n'est pas bonne ou non fourni.",
        }),
        403,
      );
    }

    try {
      const { MAILER_API_KEY, MAILER_FORGOT_PASSWORD_URL } = Deno.env
        .toObject();
      const { email, firstname } = await ctx.request.body.json();

      const res = await fetch(
        `${MAILER_FORGOT_PASSWORD_URL}?apiKey=${MAILER_API_KEY}`,
        {
          method: "POST",
          body: JSON.stringify({ email, firstname }),
        },
      );

      if (!res.ok) {
        console.log("status :", res.statusText);
        console.log("response :", await res.json());
      } else {
        const { newPassword, message } = await res.json();

        this.default.response(ctx, { newPassword, message }, 200);
      }
    } catch (error) {
      console.log("error :", error);
    }
  };

  private isNotAuthorized = <T extends string>(ctx: RouterContextAppType<T>) =>
    !(
      ctx.request.url.searchParams.get("apiKey") === Deno.env.get("API_KEY")
    );
}
