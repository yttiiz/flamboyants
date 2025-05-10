import { FormDataAppType, Helper, Validator } from "@utils";
import {
  AdminController,
  AuthController,
  PathAppType,
  RouterContextAppType,
  SessionType,
} from "@controllers";
import { Auth } from "@auth";
import { Mongo } from "@mongo";
import type { FormDataType } from "@components";

export class LogService {
  default;
  isAdmin;

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

        const isPasswordOk = await Auth.comparePassword(password, user.hash);

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
      Helper.writeLog(error);
      this.default.response(ctx, { errorMsg: this.default.errorMsg }, 500);
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

    const { lastname, firstname, email, birth, password, job, photo } =
      dataParsed.data as FormDataAppType;

    photo
      ? (picPath = await Helper.writeUserPicFile(
        photo,
        firstname,
        lastname,
      ))
      : (picPath = this.default.defaultImg);

    const hash = await Auth.hashPassword(password as string);

    const userId = await Mongo.insertIntoDB(
      {
        firstname,
        lastname,
        email,
        birth: new Date(birth),
        role: "user",
        job,
        hash,
        photo: picPath,
      },
      "users",
    );

    userId === "connexion failed"
      ? this.default.response(ctx, { errorMsg: this.default.errorMsg }, 502)
      : this.default.response(
        ctx,
        {
          title: "Bienvenue " + firstname,
          message:
            `${firstname} ${lastname}, votre profil a été créé avec succès.`,
        },
        200,
      );
  };
}
