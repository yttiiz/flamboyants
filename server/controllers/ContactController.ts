import { ContactService } from "../services/contact/ContactService.ts";
import { DefaultController } from "./DefaultController.ts";
import { RouterAppType } from "@controllers";

export class ContactController extends DefaultController {
  private service;

  constructor(router: RouterAppType) {
    super(router);
    this.service = new ContactService(this);
    this.getContact();
    this.postContact();
  }

  private getContact() {
    this.router?.get("/contact", this.service.get);
  }

  private postContact() {
    this.router?.post("/contact", this.service.post);
  }
}
