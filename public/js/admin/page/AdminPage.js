export class AdminPage {
  init = async () => {
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
        const { FormBuilder } = await import("../utils/FormBuilder.js");
        FormBuilder.insertPictureIn(dialog);
      }
    }

    if (section.dataset.admin === "connected") {
      const { AdminProfilHelper, AdminContentHelper, Forms } = await import(
        "../utils/mod.js"
      );

      // Init profil dialog modal.
      AdminProfilHelper.init(document.querySelectorAll(
        '#user-session button[type="button"]',
      ));

      AdminContentHelper.init(); // Init content page & modal.
      Forms.init(); // Handle forms submission.
    } else {
      const { AdminLoginHelper } = await import("../utils/AdminLoginHelper.js");
      const { UserFormPage } = await import("../../pages/Form/UserForm.js");

      AdminLoginHelper.handleShowPassword();
      new UserFormPage().handleForgotPassword();

      document.querySelector("form")
        .addEventListener("submit", AdminLoginHelper.loginHandler);
    }
  };
}
