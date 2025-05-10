import { DefaultFormHelper } from "./DefaultFormHelper.js";

export class ProductFormHelper extends DefaultFormHelper {
  static getClassName = (className) => `#data-product .${className}`;

  /**
   * @param {Response} response
   */
  static displayDialogUserReviewDetails = async (response) => {
    const status = response.status;
    const { message } = await response.json();

    const dialog = document.querySelector("#data-product > dialog");
    ProductFormHelper.setProductDialogContent(
      dialog,
      {
        title: "Félicitations",
        paragraph: message,
        status,
      },
    );

    dialog.showModal();
  };

  /**
   * @param {Response} response
   */
  static displayDialogUserBookingDetails = async (response) => {
    /** @type {{ message: string; booking: Record<string, unknown>}} */
    const { title, message, booking, email } = await response.json();

    let paragraph = message
      .replace("{{ start }}", booking.start)
      .replace("{{ end }}", booking.end);

    if (email) {
      paragraph = paragraph.replace("{{ email }}", email);
    }

    const dialog = document.querySelector("#data-product > dialog");
    ProductFormHelper.setProductDialogContent(
      dialog,
      {
        title,
        paragraph,
      },
    );

    dialog.showModal();
  };

  /**
   * @param {boolean} isUserConnected
   */
  static displayDialogLoginInfoToUser = (isUserConnected) => {
    const dialog = document.querySelector("#data-product > dialog");
    ProductFormHelper.setProductDialogContent(
      dialog,
      {
        isUserConnected,
        title: "Connectez-vous !",
        paragraph:
          "Vous devez vous connecter pour pouvoir réserver un créneau !",
      },
    );

    dialog.showModal();
  };

  /**
   * @param {Response} response
   */
  static displayDialogErrorInfoToUser = async (response) => {
    /** @type {{ message: string; booking: Record<string, unknown>}} */
    const { message } = await response.json();

    const dialog = document.querySelector("#data-product > dialog");
    ProductFormHelper.setProductDialogContent(
      dialog,
      {
        title: "Erreur de saisie",
        paragraph: message,
      },
    );

    dialog.showModal();
  };
}
