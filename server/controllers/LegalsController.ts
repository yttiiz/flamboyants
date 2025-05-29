import { DefaultController } from "./DefaultController.ts";
import { RouterAppType, RouterContextAppType } from "@controllers";

export class LegalsController extends DefaultController {
  constructor(router: RouterAppType) {
    super(router);
    this.getLegalRoute();
    this.getPrivacyRoute();
  }

  private getLegalRoute() {
    this.router?.get("/legal", async (ctx: RouterContextAppType<"/legal">) => {
      const body = await this.createHtmlFile(ctx, {
        id: "data-legal",
        css: "legal",
        title: "Mentions legales",
        data: "legal",
      });

      this.response(ctx, body, 200);
    });
  }

  private getPrivacyRoute() {
    this.router?.get(
      "/privacy",
      async (ctx: RouterContextAppType<"/privacy">) => {
        const body = await this.createHtmlFile(ctx, {
          id: "data-legal",
          css: "legal",
          title: "Mentions legales",
          data: "privacy",
        });

        this.response(ctx, body, 200);
      },
    );
  }
}
