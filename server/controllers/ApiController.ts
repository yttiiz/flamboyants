import { Helper, Http } from "@utils";
import type {
  GetCollectionType,
  RouterAppType,
  RouterContextAppType,
} from "./mod.ts";
import {
  fetchDataFromGuadeloupeIslandsWebsiteService,
  getUserProfilService,
  handleDataRetreiveFromDBService,
} from "@services";

export class ApiController {
  private router;
  private collection;
  private helper;
  private errorMsg =
    "Impossible de se connecter à la base de données de l'api.";
  private contentType = {
    name: "Content-Type",
    value: "application/json",
  };

  constructor(router: RouterAppType, collection: GetCollectionType) {
    this.router = router;
    this.collection = collection;
    this.helper = Helper;
    this.users();
    this.products();
    this.bookings();
    this.userProfil();
    this.getUserFormContent();
    this.getDataFromGuadeloupeIslandsWebsite();
  }

  private users() {
    this.getDataFromDB("users");
  }

  private products() {
    this.getDataFromDB("products");
  }

  private bookings() {
    this.getDataFromDB("bookings");
  }

  private userProfil() {
    this.router.get(
      "/user-profil",
      async (ctx: RouterContextAppType<"/user-profil">) => {
        if (this.isNotAuthorized(ctx)) {
          return this.response(
            ctx,
            JSON.stringify({
              errorMsg:
                "Accès non autorisé : La clé d'api n'est pas bonne ou non fourni.",
            }),
            403,
          );
        }

        try {
          const data = await getUserProfilService(ctx);

          this.response(ctx, data, 200);
        } catch (error) {
          this.writeErrorLogAndSetResponse(ctx, error);
        }
      },
    );
  }

  private getDataFromGuadeloupeIslandsWebsite() {
    this.router?.get(
      "/guadeloupe-islands",
      async (ctx: RouterContextAppType<"/guadeloupe-islands">) => {
        if (this.isNotAuthorized(ctx)) {
          return this.response(
            ctx,
            JSON.stringify({
              errorMsg:
                "Accès non autorisé : La clé d'api n'est pas bonne ou non fourni.",
            }),
            403,
          );
        }

        try {
          const { data, status } =
            await fetchDataFromGuadeloupeIslandsWebsiteService();
          this.response(ctx, data, status);
        } catch (error) {
          this.writeErrorLogAndSetResponse(ctx, error);
        }
      },
    );
  }

  private getUserFormContent() {
    this.router?.get(
      "/user-form-content",
      async (ctx: RouterContextAppType<"/user-form-content">) => {
        try {
          const content = await this.helper.convertJsonToObject(
            "/server/data/profil/profil.json",
          );
          this.response(ctx, JSON.stringify(content), 200);
        } catch (error) {
          this.writeErrorLogAndSetResponse(ctx, error);
        }
      },
    );
  }

  private getDataFromDB(collection: string) {
    const path = "/" + collection;

    this.router.get(path, async (ctx: RouterContextAppType<typeof path>) => {
      if (this.isNotAuthorized(ctx)) {
        return this.response(
          ctx,
          JSON.stringify({
            errorMsg:
              "Accès non autorisé : La clé d'api n'est pas bonne ou non fourni.",
          }),
          403,
        );
      }

      const cursor = await this.collection(collection);

      try {
        if ("message" in cursor) {
          this.response(
            ctx,
            JSON.stringify({
              errorMsg: this.errorMsg,
            }),
            502,
          );
        } else {
          const data = await handleDataRetreiveFromDBService({
            ctx,
            cursor,
          });

          this.response(ctx, JSON.stringify(data), 200);
        }
      } catch (error) {
        this.writeErrorLogAndSetResponse(ctx, error);
      }
    });
  }

  private writeErrorLogAndSetResponse<T extends string>(
    ctx: RouterContextAppType<T>,
    error: unknown,
  ) {
    this.helper.writeLog(error);
    this.response(
      ctx,
      JSON.stringify({
        errorMsg: this.errorMsg,
      }),
      500,
    );
  }

  private response<T extends string>(
    ctx: RouterContextAppType<T>,
    data: string,
    status: number,
  ) {
    new Http(ctx).setHeaders(this.contentType).setResponse(data, status);
  }

  private isNotAuthorized<T extends string>(ctx: RouterContextAppType<T>) {
    return !(
      ctx.request.url.searchParams.get("apiKey") === Deno.env.get("API_KEY")
    );
  }
}
