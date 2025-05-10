import {
  AdminController,
  DeleteItemParameterType,
  PathAppType,
  RouterContextAppType,
  SessionType,
} from "@controllers";
import { ObjectId } from "@deps";
import { Helper } from "@utils";
import { Mongo } from "@mongo";

export class AdminService {
  private default;

  constructor(defaultController: AdminController) {
    this.default = defaultController;
  }

  public getAdminHandler = async <T extends PathAppType>(
    ctx: RouterContextAppType<T>,
  ) => {
    try {
      const session: SessionType = ctx.state.session;
      const isUserConnected = session.has("userId");
      const userEmail = session.get("userEmail");
      const user = await Mongo.selectFromDB(
        "users",
        userEmail,
        "email",
      );

      if ("message" in user) {
        return this.default.response(ctx, "", 302, "/");
      } else if (isUserConnected && user.role !== "admin") {
        return this.default.response(ctx, "", 302, "/");
      }

      const users = Mongo.connectionTo("users");

      if ("message" in users) {
        return this.default.response(ctx, "", 302, "/");
      }

      const body = await this.default.createHtmlFile(ctx, {
        id: "data-admin",
        css: "admin",
        title: isUserConnected
          ? "bienvenue sur la plateforme d'admin"
          : "connexion à l'admin",
      });

      this.default.response(ctx, body, 200);
    } catch (error) {
      Helper.writeLog(error);
    }
  };

  public deleteItem = async <T extends string>({
    ctx,
    collection,
    identifier,
  }: DeleteItemParameterType<T>) => {
    let itemName = "";
    const formData = await ctx.request.body.formData();

    // Set item name
    (formData.get("itemName") as string).includes("_")
      ? (itemName = (formData.get("itemName") as string).split("_").join(" "))
      : (itemName = formData.get("itemName") as string);

    if (collection === "bookings" || collection === "reviews") {
      const bookingToDelete = {
        userId: formData.get("userId"),
        userName: itemName,
        startingDate: formData.get("startingDate"),
        endingDate: formData.get("endingDate"),
        createdAt: +(formData.get("createdAt") as string),
      };

      const isItemDelete = await Mongo.removeItemFromDB(
        new ObjectId(formData.get("id") as string),
        bookingToDelete,
        collection,
        collection,
      );

      return this.default.response(
        ctx,
        {
          message: Helper
            .messageToAdmin`${`${identifier} ${itemName}`} ${isItemDelete} été${"delete"}`,
        },
        200,
      );
    } else {
      const result = await Mongo.deleteFromDB(
        new ObjectId(formData.get("id") as string),
        collection,
      );

      const isItemDelete = result === 1;

      return this.default.response(
        ctx,
        {
          message: Helper
            .messageToAdmin`${`${identifier} ${itemName}`} ${isItemDelete} été${"delete"}`,
        },
        200,
      );
    }
  };
}
