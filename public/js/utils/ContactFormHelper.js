import { DefaultFormHelper } from "./DefaultFormHelper.js";

export class ContactFormHelper extends DefaultFormHelper {
  /**
   * @param {Response | undefined} response
   */
  static displayDialog = async (response) => {
    /** @type {HTMLDialogElement} */
    const dialog = document.querySelector("#data-contact > dialog");
    const content = {
      title: "Erreur serveur",
      paragraph:
        "Une erreur est survenue du côté du serveur. Veuillez nous excuser pour cette gêne occasionnée.",
    };

    if (response) {
      if (response.status === 200) {
        const { message, title } = await response.json();

        content["title"] = title;
        content["paragraph"] = message;
      } else {
        content["title"] = "Erreur formulaire";
        content["paragraph"] =
          "Une erreur est survenue lors de l'envoi du formulaire. Veuillez rééssayer ultérieurement.";
      }
    }

    ContactFormHelper.setUserDialogContent(dialog, content);

    dialog.showModal();
  };
}
