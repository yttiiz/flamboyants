import {
  DefaultController,
  RouterContextAppType,
  SessionType,
} from "@controllers";
import { ObjectId } from "@deps";
import { FormDataType } from "@components";
import { FormDataAppType, Helper, Validator } from "@utils";
import {
  Mongo,
  NotFoundMessageType,
  UserSchemaWithIDType,
  UserSchemaWithOptionalFieldsType,
} from "@mongo";

export class UserService {
  private default;

  constructor(defaultController: DefaultController) {
    this.default = defaultController;
  }

  public get = async <T extends string>(ctx: RouterContextAppType<T>) => {
    if (!ctx.state.session) {
      this.default.response(ctx, { errorMsg: this.default.errorMsg }, 302, "/");
    } else if (ctx.state.session.has("userFirstname")) {
      const body = await this.default.createHtmlFile(ctx, {
        id: "data-profil-form",
        css: "user-form",
        title: "modifier votre profil",
      });

      this.default.response(ctx, body, 200);
    } else {
      this.default.response(
        ctx,
        JSON.stringify({
          message: "pas d'utilisateur connecté",
        }),
        302,
        "/",
      );
    }
  };

  public putMainHandler = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    let picPath = "",
      isNewPhoto = true;

    const session: SessionType = ctx.state.session;
    const dataModel = await Helper.convertJsonToObject<FormDataType>(
      `/server/data/profil/profil.json`,
    );

    // Add file model.
    dataModel.content.push({
      type: "file",
      name: "photo",
      accept: ".png, .jpg, .webp, .jpeg",
    });

    const formData = await ctx.request.body.formData();
    const dataParsed = Validator.dataParser(formData, dataModel);

    if (!dataParsed.isOk) {
      return this.default.response(ctx, { message: dataParsed.message }, 200);
    }

    const { lastname, firstname, photo } = dataParsed.data as Pick<
      FormDataAppType,
      "lastname" | "firstname" | "photo"
    >;

    const userId = session.get("userId");

    photo
      ? (picPath = await Helper.writeUserPicFile(photo, firstname, lastname))
      : (isNewPhoto = false);

    const user = await Mongo.selectFromDB<UserSchemaWithIDType>(
      "users",
      userId,
    );

    if (!("_id" in user)) {
      return this.default.response(
        ctx,
        { message: Helper.messageToUser(false) },
        200,
      );
    }

    const updatedData = await Helper.removeEmptyOrUnchangedFields(
      dataParsed.data,
      user,
      picPath,
    );

    const isUserUpdate = await Mongo.updateToDB(userId, updatedData, "users");

    if (isUserUpdate || isNewPhoto) {
      if (updatedData.firstname) {
        session.set("userFirstname", updatedData.firstname);

        const oldFullname = session.get("userFullname");
        const newFullname = `${updatedData.firstname} ${
          oldFullname.split(" ")[1]
        }`;

        session.set("userFullname", newFullname);
      }

      if (updatedData.lastname && !updatedData.firstname) {
        const oldFullname = session.get("userFullname");
        const newFullname = `${
          oldFullname.split(" ")[0]
        } ${updatedData.lastname}`;

        session.set("userFullname", newFullname);
      }

      if (picPath) {
        session.set("userPhoto", picPath);
      }

      if (updatedData.email) {
        session.set("userEmail", updatedData.email);
        session.flash(
          "message",
          this.default.sessionFlashMsg(updatedData.email),
        );
      }

      this.default.response(
        ctx,
        { message: Helper.messageToUser(isUserUpdate), picPath },
        201,
      );
    } else {
      this.default.response(
        ctx,
        { message: Helper.messageToUser(isUserUpdate) },
        200,
      );
    }
  };

  public putHandler = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    try {
      const _id = new ObjectId(ctx.params.id);
      const formData = await ctx.request.body.formData();
      const dataModel = await Helper.convertJsonToObject<FormDataType>(
        "/server/data/admin/user-form.json",
      );

      const dataParsed = Validator.dataParser(formData, dataModel);

      if (!dataParsed.isOk) {
        return this.default.response(
          ctx,
          {
            title: "Modification non effectuée",
            message: dataParsed.message,
          },
          401,
        );
      }

      // Check to remove user photo.
      if (dataParsed.data["deletePicture"] === "oui") {
        dataParsed.data["photo"] = this.default.defaultImg;
      }

      // Remove 'delePicture' cause is unnecessary at this step.
      delete dataParsed.data["deletePicture"];

      const user: UserSchemaWithIDType | NotFoundMessageType = await Mongo
        .selectFromDB("users", _id);

      if (!("_id" in user)) {
        return this.default.response(
          ctx,
          {
            title: "Erreur serveur",
            message:
              "Le serveur ne répond pas. Veuillez réessayer ultérieurement !",
          },
          200,
        );
      }

      const updatedData = await Helper.removeEmptyOrUnchangedFields(
        dataParsed.data,
        user,
      );

      const data: UserSchemaWithOptionalFieldsType = { ...updatedData };
      const isUpdate = await Mongo.updateToDB(_id, data, "users");

      return this.default.response(
        ctx,
        {
          title: "Modification utilisateur",
          message: Helper.messageToAdmin`Le profil de ${
            user.firstname + " " + user.lastname
          } ${isUpdate} été${"update"}`,
        },
        200,
      );
    } catch (error) {
      Helper.writeLog(error);
    }
  };

  public delete = async <T extends string>(ctx: RouterContextAppType<T>) => {
    const userId = (await ctx.state.session.get("userId")) as ObjectId;
    const result = await Mongo.deleteFromDB(userId, "users");
    const isUserDelete = result === 1;

    if (isUserDelete) await ctx.state.session.deleteSession();

    this.default.response(
      ctx,
      {
        message: Helper.messageToUser(isUserDelete, "compte", "supprimé"),
      },
      200,
    );
  };

  public static getUserInfo = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    return {
      userId: (
        (await ctx.state.session.get("userId")) as ObjectId
      ).toHexString(),
      userName: (await ctx.state.session.get("userFullname")) as string,
    };
  };
}
