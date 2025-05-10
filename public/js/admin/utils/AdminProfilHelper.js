import * as Types from "../../types/types.js";
import {
  getApiKey,
  handleInputFile,
  handleShowPassword,
  setFormData,
} from "../../utils/_commonFunctions.js";

export class AdminProfilHelper {
  static #handleShowPassword = handleShowPassword;
  static #handleInputFile = handleInputFile;
  static #setFormData = setFormData;
  static #host = location.origin + "/";
  static #roles = ["user", "admin"];

  /**
   * Fetchs `user` (admin) data & `form` content data from database. Then hydrates user dialog modal with them.
   * @param {NodeListOf<HTMLButtonElement>} buttons
   */
  static init = async (buttons) => {
    const userDataResponse = await fetch(
      AdminProfilHelper.#host + "user-profil" + getApiKey(),
    );
    const formContentResponse = await fetch(
      AdminProfilHelper.#host + "user-form-content" + getApiKey(),
    );

    if (userDataResponse.ok && formContentResponse.ok) {
      const userData = await userDataResponse.json();
      const formContent = await formContentResponse.json();

      for (const button of buttons) {
        button.addEventListener("click", () => {
          AdminProfilHelper.#displayDialogAdminProfil(
            { userData, formContent },
          );
        });
      }
    }
  };

  /**
   * @param {{ userData: Types.User; formContent: Types.FormContentType }}
   * @param {HTMLDialogElement} dialog
   */
  static #displayDialogAdminProfil = (
    {
      userData,
      formContent,
    },
    dialog = document.querySelector("dialog[data-profil]"),
  ) => {
    if (!dialog.querySelector("form")) {
      const formElement = document.createElement("form");

      dialog.querySelector("h2").textContent = "Profil administrateur";
      dialog.querySelector("p").innerHTML = `<b>${formContent.title}</b>`;

      formElement.setAttribute("action", formContent.action);
      formElement.setAttribute("method", formContent.method);
      formElement.setAttribute("type", "multipart/form-data");

      const figure = AdminProfilHelper.#createChangePictureContainer(userData);
      formElement.appendChild(figure);

      const selectLabel = AdminProfilHelper.#createLabelSelectRole();
      formElement.appendChild(selectLabel);

      for (const inputData of formContent.content) {
        const label = document.createElement("label");
        const input = AdminProfilHelper.#createInput(
          document.createElement("input"),
          inputData,
        );

        if (inputData.type !== "submit") {
          // Insert user values.

          if (inputData.type === "password") {
            const eyeContainer = AdminProfilHelper.#createEyePasswordIcon();
            const span = document.createElement("span");

            label.innerHTML = `<span>${inputData.label}</span>`;

            span.appendChild(input);
            span.appendChild(eyeContainer);
            label.appendChild(span);
          } else {
            inputData.type === "date"
              ? input.setAttribute(
                "value",
                userData[inputData.name].split("T")[0],
              )
              : input.setAttribute("value", userData[inputData.name]);
            label.innerHTML = `<span>${inputData.label}</span>`;

            label.appendChild(input);
          }

          formElement.appendChild(label);
        } else {
          input.setAttribute("value", inputData.value);
          formElement.appendChild(input);
        }
      }

      formElement.addEventListener("submit", this.#handleForm);

      dialog.querySelector("div").appendChild(formElement);
    }

    AdminProfilHelper.#handleShowPassword();

    dialog.showModal();
  };

  /**
   * @param {Types.User} userData
   */
  static #createChangePictureContainer = (userData) => {
    const container = document.createElement("div");
    const {
      div,
      figure,
      img,
      button,
    } = AdminProfilHelper.#createHTMLElements("div", "figure", "img", "button");

    const msgContainer = document.createElement("div");

    // Set image.
    img.src = userData.photo;
    img.alt = `photo de ${userData.firstname} ${userData.lastname}`;
    figure.appendChild(img);

    // Set input
    button.type = "button";
    button.textContent = "Changer votre photo";
    button.addEventListener("click", AdminProfilHelper.#handleInputFile);
    msgContainer.classList.add("none");

    div.appendChild(button);
    div.appendChild(msgContainer);

    container.appendChild(figure);
    container.appendChild(div);

    return container;
  };

  static #createLabelSelectRole = () => {
    const {
      label,
      select,
    } = AdminProfilHelper.#createHTMLElements("label", "select");

    select.name = "role";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Choisir...";
    select.appendChild(defaultOption);

    for (const role of AdminProfilHelper.#roles) {
      const option = document.createElement("option");
      option.value = role;
      option.textContent = role;
      select.appendChild(option);
    }

    label.innerHTML = `<span>Role</span>`;
    label.appendChild(select);

    return label;
  };

  /**
   * @param {HTMLDivElement} input
   * @param {Types.FormInputType} inputData
   */
  static #createInput = (input, inputData) => {
    input.setAttribute("type", inputData.type);
    inputData.placeholder
      ? input.setAttribute("placeholder", inputData.placeholder)
      : null;
    inputData.name ? input.setAttribute("name", inputData.name) : null;
    inputData.maxLength
      ? input.setAttribute("maxLength", inputData.maxLength)
      : null;
    inputData.minLength
      ? input.setAttribute("minLength", inputData.minLength)
      : null;
    inputData.autocomplete
      ? input.setAttribute("autocomplete", inputData.autocomplete)
      : null;

    return input;
  };

  /**
   * Create and set `eye-password` container.
   */
  static #createEyePasswordIcon = () => {
    const eyeIcon = document.createElement("div");

    eyeIcon.setAttribute("id", "eye-password");
    eyeIcon.innerHTML = `
    <span>
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none">
        </path>
        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z">
        </path>
      </svg>
    </span>
    <span class="none">
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z">
        </path>
      </svg>
    </span>`;

    return eyeIcon;
  };

  /**
   * @param {string[]} args
   */
  static #createHTMLElements = (...args) => {
    /** @type {Record<string, HTMLElement>} */
    const elements = {};

    for (const arg of args) {
      elements[arg] = document.createElement(arg);
    }

    return elements;
  };

  /**
   * @param {Event} e
   */
  static #handleForm = async (e) => {
    e.preventDefault();

    const formData = AdminProfilHelper.#setFormData(e.target);

    const res = await fetch(e.target.action, {
      method: "PUT",
      body: formData,
    });

    AdminProfilHelper.#displayMessage(e.target, await res.json());
  };

  /**
   * @param {HTMLFormElement} form
   * @param {{ message: string }} param
   */
  static #displayMessage = (form, { message }) => {
    form.closest("dialog")
      .querySelector("p").textContent = message;

    form.parentNode.removeChild(form);
  };
}
