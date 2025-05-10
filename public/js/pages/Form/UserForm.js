import { PageBuilder } from "../Builder.js";
import { UserFormHelper } from "../../utils/UserFormHelper.js";

export class UserFormPage extends PageBuilder {
  initForm = (
    id = "user",
  ) => {
    /** @type {HTMLFormElement[]} */
    const [form, deleteForm] = document.querySelectorAll(
      `#data-${id}-form form`,
    );

    this.#handleUserLink();

    // Handle loading animation in 'profil' page.
    if (document.querySelector(".loading-text")) {
      const container = document.querySelector(`#data-${id}-form .container`);
      const loadingText = document.querySelector(".loading-text");
      const image = container.querySelector("img.loading-image");

      // Remove loading text.
      container.removeChild(loadingText);

      // Remove image loading animation.
      image.classList.remove("loading-image");
    }

    form.addEventListener(
      "submit",
      (e) => this.#submitHandler(e),
    );

    // Set input file to change photo
    if (form.action.includes("/register")) {
      form.querySelector(".search-photo button")
        .addEventListener("click", UserFormHelper.handleInputFile);
    }

    if (deleteForm) {
      deleteForm.addEventListener(
        "submit",
        (e) => this.#submitHandler(e),
      );
    }

    if (document.querySelectorAll("dialog").length > 0) {
      const modals = document.querySelectorAll("dialog");

      for (const modal of modals) {
        const modalCancelledBtn = modal.querySelectorAll("button[data-close]");

        // Set button to abort deleting
        for (const btn of modalCancelledBtn) {
          btn.addEventListener("click", this.#hideModalHandler);
        }
      }
    }
  };

  /**
   * Prevent page to reload on click on login/profil link.
   */
  #handleUserLink = () => {
    if (document.querySelector("#user-session .login")) {
      const loginLink = document.querySelectorAll("#user-session .login a");
      const path = globalThis.location.pathname.split("/")[1];

      switch (path) {
        case "login": {
          loginLink[0].addEventListener("click", (e) => e.preventDefault());
          break;
        }

        case "register": {
          loginLink[1].addEventListener("click", (e) => e.preventDefault());
          break;
        }
      }
    }

    if (document.querySelector("#user-session span[data-profil-link]")) {
      const profilLink = document.querySelectorAll(
        "#user-session span[data-profil-link] > a",
      );

      for (const link of profilLink) {
        link.addEventListener("click", (e) => e.preventDefault());
      }
    }
  };

  /**
   * @param {string} id
   * @param {{ firstname: string; lastname: string; photo: string }} data
   */
  renderProfilForm = (
    id,
    data,
  ) => {
    /** @type {HTMLDivElement} */
    const userPhotoContainer = document.querySelector(".user-photo");
    const userImg = userPhotoContainer.querySelector("img");

    /** @type {NodeListOf<HTMLInputElement>} */
    const userInfosInputs = document.querySelectorAll(".user-infos input");

    // Set user photo
    if (!data.photo.includes("default.png")) {
      userImg.src = data.photo;
      userImg.alt = `photo de ${data.firstname} ${data.lastname}`;
    }

    // Set inputs
    for (const input of userInfosInputs) {
      UserFormHelper.hydrateInput(input, data);
    }

    // Set form submission
    this.initForm(id);

    // Set input file to change photo
    userPhotoContainer.querySelector("button")
      .addEventListener("click", UserFormHelper.handleInputFile);

    // Set button to display form "delete user" modal.
    document.querySelector(".delete-account button")
      .addEventListener("click", () => {
        UserFormHelper.displayDialogToDeleteAccount();
      });
  };

  /**
   * @param {{ errorMsg: string }} message
   */
  renderError = ({ errorMsg }) => {
    if (document.querySelector("#data-profil-form")) {
      const paragraph = document.querySelector("#data-profil-form")
        .querySelector(".error-msg");

      paragraph.innerHTML += errorMsg;
      paragraph.classList.remove("none");
    }
  };

  /**
   * @param {Event} e
   */
  #submitHandler = async (e) => {
    e.preventDefault();

    const isDeleteForm = e.target.dataset.type === "delete-account";

    const formData = isDeleteForm ? null : UserFormHelper.setFormData(e.target);
    const method = location.pathname === "/profil"
      ? (isDeleteForm ? "DELETE" : "PUT")
      : null;

    const res = await fetch(e.target.action, {
      method: method ?? "POST",
      body: formData,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      mode: "cors",
    });

    if (location.pathname !== "/profil") {
      const labels = e.target.querySelectorAll("label");
      UserFormHelper.removeInputsValues(labels);
    }

    if (res.ok && (res.status === 200 || res.status === 201)) {
      if (res.redirected) {
        globalThis.location.href = res.url;
      } else {
        switch (e.target.action) {
          case location.origin + "/login":
            UserFormHelper.showLoginError(res);
            break;

          case location.origin + "/register":
            UserFormHelper.displayDialogRegisterDetails(res);
            break;

          case location.origin + "/profil": {
            isDeleteForm
              ? UserFormHelper.displayDialogProfilDeletedDetails(
                res,
                this.#hideModalHandler,
              )
              : UserFormHelper.displayDialogProfilUpdatedDetails(res);
            break;
          }
        }
      }
    } else {
      UserFormHelper.showErrorMsg(res, location.pathname);
    }
  };

  /**
   * @param {Event} e
   */
  #hideModalHandler = (e) => {
    e.currentTarget.closest("dialog")
      .close();
  };
}
