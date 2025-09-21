import * as oak from "@oak";
import { Mongo } from "@mongo";
import { AppState } from "@utils";
import {
  AdminController,
  ApiController,
  AuthController,
  BookingController,
  ContactController,
  ForgotPasswordController,
  HomeController,
  LegalsController,
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
new LegalsController(router);
new ForgotPasswordController(router);
new ApiController(
  router,
  Mongo.connectionTo,
);
