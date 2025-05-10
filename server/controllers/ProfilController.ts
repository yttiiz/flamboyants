import { DefaultController } from "./DefaultController.ts";
import type { RouterAppType } from "./mod.ts";
import { UserService } from "@services";

export class ProfilController extends DefaultController {
  private userService;

  constructor(router: RouterAppType) {
    super(router);
    this.userService = new UserService(this);
    this.getProfil();
    this.putProfil();
    this.deleteProfil();
  }

  private getProfil() {
    this.router?.get("/profil", this.userService.get);
  }

  private putProfil() {
    this.router?.put("/profil", this.userService.putMainHandler);
  }

  private deleteProfil() {
    this.router?.delete("/profil", this.userService.delete);
  }
}
