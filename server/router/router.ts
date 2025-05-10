// TODO to be removed (reset "session" in BD)
import { FindCursor, ObjectId } from "../dependencies/deps.ts";
import { Http } from "@utils";
import { RouterContextAppType } from "../controllers/types.ts";
//

import { oak } from "@deps";
import { Mongo } from "@mongo";
import { AppState } from "@utils";
import {
  AdminController,
  ApiController,
  AuthController,
  BookingController,
  ContactController,
  HomeController,
  ProductController,
  ProfilController,
} from "@controllers";

export const router = new oak.Router<AppState>();

// Creating all 'Routes' controllers.
new HomeController(router);
new AuthController(router);
new ProfilController(router);
new ProductController(router);
new BookingController(router);
new AdminController(router);
new ContactController(router);
new ApiController(
  router,
  Mongo.connectionTo,
);

// TODO to be removed (reset "session" in BD)
router.get(
  "/reset",
  (ctx: RouterContextAppType<"/reset">) => {
    const sessions = Mongo.connectionTo("sessions");
    type SessionDBType = {
      _id: ObjectId;
      id: string;
      data: {
        _flash: {
          message?: string;
        };
      };
    };

    if ("message" in sessions) {
      return;
    } else {
      (sessions as FindCursor<SessionDBType>).map(
        async (session) => {
          const _id = session._id;
          if (!session.data._flash.message) {
            await Mongo.deleteFromDB(_id, "sessions");
          }
        },
      );
    }

    const url = new URL("/", Deno.env.get("APP_URL"));

    new Http(ctx)
      .setHeaders({
        name: "Content-Type",
        value: "application/json",
      })
      .redirect(url)
      .setResponse(JSON.stringify({ message: "sessions clean" }), 200);
  },
);
