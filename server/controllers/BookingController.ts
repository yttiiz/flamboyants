import { DefaultController } from "./DefaultController.ts";
import type { RouterAppType } from "./mod.ts";
import { BookingService } from "@services";

export class BookingController extends DefaultController {
  private service;

  constructor(router: RouterAppType) {
    super(router);
    this.service = new BookingService(this);
    this.getBooking();
    this.deleteBooking();
  }

  private getBooking() {
    this.router?.get("/booking", this.service.getBooking);
  }

  private deleteBooking() {
    this.router?.delete("/cancel-booking", this.service.deleteBooking);
  }
}
