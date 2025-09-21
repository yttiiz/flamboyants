import { FormDataAppType, Helper, Validator } from "@utils";
import {
  AdminController,
  AuthController,
  PathAppType,
  RouterContextAppType,
  SessionType,
} from "@controllers";
import { Auth } from "@auth";
import { Mongo, NotFoundMessageType } from "@mongo";
import type { FormDataType } from "@components";
import { Document } from "@mongo/orm";

export class LogService {
  default;
  isAdmin;
  isRunningInDenoDeploy = !!(Deno.env.get("IS_DENO_DEPLOY"));

  constructor(defaultController: AuthController | AdminController) {
    this.default = defaultController;
    this.isAdmin = this.default instanceof AdminController;
  }

  public loginHandler = async <T extends PathAppType>(
    ctx: RouterContextAppType<T>,
  ) => {
    const dataModel = await Helper.convertJsonToObject<FormDataType>(
      `/server/data/authentication${ctx.request.url.pathname}.json`,
    );

    const session: SessionType = ctx.state.session;
    const formData = await ctx.request.body.formData();

    const dataParsed = Validator.dataParser(formData, dataModel);

    if (!dataParsed.isOk) {
      return this.default.response(ctx, { message: dataParsed.message }, 200);
    }

    const { email, password } = dataParsed.data as Record<string, string>;

    const failedLogin = async (message: string) => {
      const failedLoginAttempts = ((await ctx.state.session.get(
        "failed-login-attempts",
      )) || 0) as number;
      session.set("failed-login-attempts", failedLoginAttempts + 1);
      session.flash("error", message);
    };

    try {
      const user = await Mongo.selectFromDB(
        "users",
        email,
        "email",
      );

      if ("_id" in user) {
        // Handle admin.
        if (this.isAdmin && user.role !== "admin") {
          return this.default.response(ctx, "", 401);
        }

        const isPasswordOk = await Auth.comparePassword(
          password,
          user.hash,
          this.isRunningInDenoDeploy,
        );

        // Handle session and/or redirection.
        if (isPasswordOk) {
          session.set("userEmail", email);
          session.set("userFirstname", user.firstname);
          session.set("userPhoto", user.photo);
          session.set("userFullname", `${user.firstname} ${user.lastname}`);
          session.set("isAdmin", user.role === "admin");
          session.set("userId", user._id);
          session.set("failed-login-attempts", null);
          session.flash("message", this.default.sessionFlashMsg(email));

          session.get("error") ? session.flash("error", null) : null;

          this.isAdmin
            ? this.default.response(ctx, { message: "connected" }, 200)
            : this.default.response(ctx, "", 302, "/");
        } else {
          await failedLogin("mot de passe incorrect");
          this.default.response(
            ctx,
            {
              message: "Veuillez réessayer, votre mot de passe est incorrect.",
            },
            200,
          );
        }
      } else {
        if (user.message === "connexion failed") {
          this.default.response(ctx, "", 302, "/");
        } else {
          await failedLogin(user.message);
          this.default.response(ctx, user, 200);
        }
      }
    } catch (error) {
      console.log("error :", error);
      this.default.response(ctx, { errorMsg: this.default.errorMsg }, 502);
    }
  };

  public logoutHandler = async <T extends PathAppType>(
    ctx: RouterContextAppType<T>,
  ) => {
    await ctx.state.session.deleteSession();

    this.isAdmin
      ? this.default.response(ctx, "", 302, "/admin")
      : this.default.response(ctx, "", 302, "/");
  };

  public registerHandler = async <T extends PathAppType>(
    ctx: RouterContextAppType<T>,
  ) => {
    const dataModel = await Helper.convertJsonToObject<FormDataType>(
      `/server/data/authentication${ctx.request.url.pathname}.json`,
    );
    const formData = await ctx.request.body.formData();
    const dataParsed = Validator.dataParser(formData, dataModel);

    if (!dataParsed.isOk) {
      return this.default.response(
        ctx,
        { title: "Avertissement", message: dataParsed.message },
        200,
      );
    }

    let picPath: string;

    const { lastname, firstname, email, password, photo } = dataParsed
      .data as FormDataAppType;

    // Check if email already exist in db.
    try {
      let user: Document | NotFoundMessageType | null = await Mongo
        .selectFromDB(
          "users",
          email,
          "email",
        );

      if ("_id" in user) {
        user = null;
        return this.default.response(
          ctx,
          {
            title: "Avertissement",
            message:
              `L'adresse email <b>${email}</b> est déjà utilisée. Veuillez en utiliser une autre.`,
          },
          401,
        );
      }

      user = null;
    } catch (error) {
      console.log("error :", error);
    }

    photo
      ? (picPath = await Helper.writeUserPicFile(
        photo,
        firstname,
        lastname,
      ))
      : (picPath = this.default.defaultImg);

    const hash = await Auth.hashPassword(
      password as string,
      this.isRunningInDenoDeploy,
    );

    const userId = await Mongo.insertIntoDB(
      {
        firstname,
        lastname,
        email,
        role: "user",
        hash,
        photo: picPath,
      },
      "users",
    );

    if (userId === "connexion failed") {
      return this.default.response(
        ctx,
        { errorMsg: this.default.errorMsg },
        502,
      );
    }

    this.default.response(
      ctx,
      {
        title: "Bienvenue " + firstname,
        message:
          `${firstname} ${lastname}, votre profil a été créé avec succès.`,
      },
      200,
    );

    try {
      const { MAILER_API_KEY, MAILER_REGISTER_URL } = Deno.env
        .toObject();
      const res = await fetch(
        `${MAILER_REGISTER_URL}?apiKey=${MAILER_API_KEY}`,
        {
          method: "POST",
          body: JSON.stringify({ email, firstname }),
        },
      );

      if (!res.ok) {
        console.log("status :", res.statusText);
        console.log("response :", await res.json());
      }
    } catch (error) {
      console.log("error :", error);
    }
  };
}
