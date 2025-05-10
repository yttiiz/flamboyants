import {
  AdminContentHelper,
  AdminLoginHelper,
  AdminProfilHelper,
  FormBuilder,
  Forms,
} from "../utils/mod.js";

export class AdminPage {
  init = () => {
    const section = document.querySelector("section");
    const dialogs = document.querySelectorAll("dialog");

    // Init close event dialog modals.
    for (const dialog of dialogs) {
      for (const button of dialog.querySelectorAll("button[data-close]")) {
        button.addEventListener("click", () => {
          dialog.close();
        });
      }

      if ("products" in dialog.dataset) {
        FormBuilder.insertPictureIn(dialog);
      }
    }

    if (section.dataset.admin === "connected") {
      // Init profil dialog modal.
      AdminProfilHelper.init(document.querySelectorAll(
        '#user-session button[type="button"]',
      ));

      AdminContentHelper.init(); // Init content page & modal.
      Forms.init(); // Handle forms submission.
    } else {
      AdminLoginHelper.handleShowPassword();

      document.querySelector("form")
        .addEventListener("submit", AdminLoginHelper.loginHandler);
    }
  };
}
