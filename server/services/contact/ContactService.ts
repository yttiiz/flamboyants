import {
  ContactSendEmailContentType,
  DefaultController,
  RouterContextAppType,
} from "@controllers";
import { Helper, Mailer, Validator } from "@utils";
import { FormDataType } from "@components";

export class ContactService {
  private default;

  constructor(defaultController: DefaultController) {
    this.default = defaultController;
  }

  public get = async <T extends string>(ctx: RouterContextAppType<T>) => {
    const body = await this.default.createHtmlFile(ctx, {
      id: "data-contact",
      css: "contact",
      title: "contactez-nous",
    });

    this.default.response(ctx, body, 200);
  };

  public post = async <T extends string>(ctx: RouterContextAppType<T>) => {
    try {
      const formData = await ctx.request.body.formData();
      const dataModel = await Helper.convertJsonToObject<FormDataType>(
        "/server/data/contact/contact.json",
      );

      const dataParsed = Validator.dataParser(formData, dataModel);

      if (!dataParsed.isOk) {
        return this.default.response(
          ctx,
          {
            title: "Message non envoyé",
            message: dataParsed.message,
          },
          401,
        );
      }

      const { email, firstname, lastname, message } = dataParsed
        .data as ContactSendEmailContentType;

      const content = {
        email,
        firstname,
        lastname,
        message,
      };

      Mailer.receive({ content });

      this.default.response(
        ctx,
        {
          title: "Message envoyé",
          message:
            "Nous avons bien reçu votre message. Nous revenons vers vous sous peu.",
        },
        200,
      );
    } catch (error) {
      Helper.writeLog(error);
    }
  };
}
