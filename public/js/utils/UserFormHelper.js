import { DefaultFormHelper } from "./DefaultFormHelper.js";
import {
  getApiKey,
  handleInputFile,
  hydrateInput,
} from "./_commonFunctions.js";

export class UserFormHelper extends DefaultFormHelper {
  static id = (id) => `#data-${id}-form`;
  static handleInputFile = handleInputFile;
  static hydrateInput = hydrateInput;

  /**
   * @param {Response} response
   */
  static displayDialogRegisterDetails = async (response) => {
    const { message, title } = await response.json();
    const dialog = document.querySelector("#data-user-form > dialog");

    UserFormHelper.setUserDialogContent(
      dialog,
      {
        title,
        paragraph: message,
      },
    );

    dialog.showModal();
  };

  static displayDialogforgotPassword = () => {
    const dialog = document.querySelector("dialog[data-reset-password]");

    if (!dialog.querySelector("h2").textContent) {
      UserFormHelper.setUserDialogContent(
        dialog,
        {
          title: "Mot de passe oublié ?",
          paragraph:
            "Saisissez votre adresse e-mail et nous vous enverrons des instructions pour réinitialiser votre mot de passe.",
        },
      );
    }

    dialog.showModal();
  };

  /**
   * @param {Event} e
   */
  static sendNewPasswordToUser = async (e) => {
    const label = e.currentTarget.previousElementSibling;
    const email = label.querySelector("input")?.value.trim();

    if (!email) {
      if (!label.querySelector("p")) {
        const alertParagraph = document.createElement("p");
        alertParagraph.textContent = "Veuillez renseigner une adresse email !";
        alertParagraph.style.color = "red";

        label.appendChild(alertParagraph);
      }
    } else {
      try {
        const res = await fetch("/get-user-firstname" + getApiKey(), {
          method: "POST",
          body: JSON.stringify({ email }),
        });

        if (res.ok && res.status === 200) {
          const { firstname } = await res.json();

          const response = await fetch(
            "/send-forgot-password-email" + getApiKey(),
            {
              method: "POST",
              body: JSON.stringify({ firstname, email }),
            },
          );

          if (response.ok) {
            const { message } = await response.json();
            UserFormHelper.displaySendForgotPasswordEmailMessage(
              label,
              message,
            );
          } else {
            console.log("error :", await response.json());
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  /**
   * @param {Response} response
   */
  static showLoginError = async (response) => {
    const { message } = await response.json();
    const span = document.querySelector("form > span");

    span.textContent = message;

    if (span.classList.contains("none")) {
      span.classList.remove("none");
    }
  };

  /**
   * @param {HTMLDivElement} label
   * @param {string} message
   */
  static displaySendForgotPasswordEmailMessage = (label, message) => {
    const labelContainer = label.closest(".send-user-email");
    const paragraph = labelContainer.closest("dialog").querySelector("p");

    labelContainer.innerHTML = "";
    paragraph.innerHTML = message;
  };

  static displayDialogToDeleteAccount = () => {
    const dialog = document.querySelector("#data-profil-form > dialog");

    UserFormHelper.setProfilDialogContent(
      dialog,
      {
        title: "Suppression du compte",
        paragraph: "Etes-vous vraiment sûr de vouloir supprimer votre compte ?",
      },
    );

    dialog.showModal();
  };

  /**
   * @param {Response} response
   */
  static displayDialogProfilUpdatedDetails = async (response) => {
    const id = "#data-profil-form";
    const status = response.status;
    const { message, photo } = await response.json();
    const dialog = document.querySelector(id + " > dialog");

    if (photo) {
      // Set img src to new photo's path.
      document.querySelector(id + " figure > img")
        .src = photo;

      // Hide user photo details div.
      document.querySelector(".user-photo > div")
        .classList.add("none");
    }

    UserFormHelper.setProfilDialogContent(
      dialog,
      {
        title: "Mise à jour",
        paragraph: message,
        status,
      },
    );

    dialog.showModal();
  };

  /**
   * @param {Response} response
   * @param {(e: Event) => void} hideModalhandler
   */
  static displayDialogProfilDeletedDetails = async (
    response,
    hideModalhandler,
  ) => {
    const status = response.status;
    const { message } = await response.json();
    const dialog = document.querySelector("#data-profil-form > dialog");

    UserFormHelper.setProfilDialogContent(
      dialog,
      {
        title: "Compte supprimé",
        paragraph: message,
        status,
        handler: hideModalhandler,
      },
    );
  };

  /**
   * @param {Response} response
   * @param {"/profil" | "/login" | "/register"} pathname
   */
  static showErrorMsg = async (response, pathname) => {
    const status = response.status;
    const id = pathname === "/profil" ? "profil" : "user";
    const { errorMsg } = await response.json();

    UserFormHelper.#paragraphToShowInfo({
      msg: errorMsg + status,
      dataSet: "error",
    }, id);
  };

  /**
   * @param {{ msg: string; dataSet: "error" | "success" }} param
   * @param {string} id
   */
  static #paragraphToShowInfo = ({ msg, dataSet }, id) => {
    /** @type {HTMLDivElement} */
    const container = document.querySelector(
      UserFormHelper.id(id) + " .container",
    );

    const box = UserFormHelper.getOrCreateElement({
      parent: container,
      cssSelector: "p[data-msg-infos]",
      hmtlTag: "p",
    });

    box.dataset.msgInfos = dataSet;
    box.textContent = msg;
  };
}
