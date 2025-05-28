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
  LegalsController
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
new LegalsController(router);
new ApiController(
  router,
  Mongo.connectionTo,
);
