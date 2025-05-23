import { DefaultFormHelper } from "../../utils/DefaultFormHelper.js";
import { handleShowPassword } from "../../utils/_commonFunctions.js";

export class AdminLoginHelper extends DefaultFormHelper {
  static handleShowPassword = handleShowPassword;
  /**
   * @param {Event} e
   */
  static loginHandler = async (e) => {
    e.preventDefault();

    const formData = AdminLoginHelper.setFormData(e.target);

    const res = await fetch(e.target.action, {
      method: "POST",
      body: formData,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (res.ok && (res.status === 200 || res.status === 201)) {
      const responseContent = await res.json();

      responseContent["message"] === "connected"
        ? location.reload()
        : AdminLoginHelper.displayWrongPassword(responseContent["message"]);
    } else if (res.status === 401) {
      AdminLoginHelper.openDialogToUnauthorizedAccess();
    }
  };

  /**
   * @param {string} message
   */
  static displayWrongPassword = (message) => {
    /** @type {HTMLSpanElement} */
    const span = document.querySelector("form > span");

    span.textContent = message;
    span.classList.remove("none");
  };

  /**
   * @param {HTMLDialogElement} dialog
   */
  static openDialogToUnauthorizedAccess = (
    dialog = document.querySelector("dialog"),
  ) => {
    const span = document.querySelector("form > span");

    if (!span.classList.contains("none")) {
      span.textContent = "";
      span.classList.add("none");
    }

    AdminLoginHelper.setUserDialogContent(
      dialog,
      {
        title: "Accès non autorisé",
        paragraph:
          "Vous n'avez pas les droits pour accéder à la plateforme d'administration.",
      },
    );

    dialog.showModal();
  };
}
