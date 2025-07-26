import { DefaultController } from "./DefaultController.ts";
import { RouterAppType } from "@controllers";
import { ForgotPasswordService } from "@services";

export class ForgotPasswordController extends DefaultController {
  private service;

  constructor(router: RouterAppType) {
    super(router);
    this.service = new ForgotPasswordService(this);
    this.retreiveUserFirstname();
    this.sendEmailToUserAndModifyUserPassword();
  }

  private retreiveUserFirstname() {
    this.router?.post(
      "/get-user-firstname",
      this.service.getUserFirstname,
    );
  }

  private sendEmailToUserAndModifyUserPassword() {
    this.router?.post(
      "/send-forgot-password-email",
      this.service.sendEmailAndGetNewPassword,
    );
  }
}
