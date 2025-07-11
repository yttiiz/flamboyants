import { setFormData } from "../../utils/_commonFunctions.js";

export class Forms {
  static #setFormData = setFormData;

  static init = () => {
    for (const dialog of document.querySelectorAll("#data-admin dialog")) {
      if (
        !Object.prototype.hasOwnProperty.call(dialog.dataset, "profil") &&
        !Object.prototype.hasOwnProperty.call(dialog.dataset, "response")
      ) {
        dialog.querySelector("form")
          .addEventListener("submit", Forms.#handleForm);
      }
    }
  };

  /**
   * @param {Event} e
   */
  static #handleForm = async (e) => {
    e.preventDefault();

    const isCreateForm = e.target.action.includes("create");
    const isDeleteForm = Object.prototype.hasOwnProperty.call(
      e.target.closest("dialog").dataset,
      "delete",
    );
    const formData = Forms.#setFormData(e.target);

    if (e.target.action.includes("booking")) {
      isDeleteForm
        ? Forms.#insertDatasetsInFormDataFromDeleteBtn(
          formData,
          e.target,
        )
        : Forms.#insertDatasetsInFormDataFromEditBtn(
          formData,
          e.target,
        );
    } else if (isDeleteForm) {
      Forms.#insertDatasetsInFormDataFromDeleteBtn(formData, e.target);
    }

    const method = isDeleteForm ? "DELETE" : (isCreateForm ? "POST" : "PUT");

    try {
      const res = await fetch(e.target.action, {
        method,
        body: formData,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        mode: "cors",
      });

      if (res.ok) {
        if (isDeleteForm) {
          Forms.#hideCurrentBookingCard(e.target);
          Forms.#displayDeleteMessage(e.target, await res.json());
          await Forms.#rebootChart();
        } else {
          Forms.#displayMessage(e.target, await res.json());
        }
      }
    } catch (error) {
      //TODO improve that block scope
      console.log(error);
    }
  };

  static async #rebootChart() {
    const { AdminContentHelper } = await import("./AdminContentHelper.js");
    const { AdminChartsHelper } = await import("./AdminChartsHelper.js");

    // Retrieve all data from api.
    const [users, bookings] = await (async function (...args) {
      /** @type {[Types.Users, Types.Products]} */
      const allData = [];

      for (const arg of args) {
        const data = await AdminContentHelper.getData(arg);
        allData.push(data);
      }

      return allData;
    })("users", "bookings");

    // Set charts.
    AdminChartsHelper.setCharts({
      users,
      bookings,
    });
  }

  /**
   * @param {HTMLFormElement} form
   */
  static #hideCurrentBookingCard = (form) => {
    const cards = document.querySelectorAll(".bookings-details span ul li");

    for (const card of cards) {
      const deleteButton = card.querySelector('button[data-action="delete"]');
      const isCurrentCard = form.dataset["id"] === deleteButton.dataset["id"];

      if (isCurrentCard) {
        card.style.display = "none";
        break;
      }
    }
  };

  /**
   * @param {FormData} formData
   * @param {HTMLFormElement} form
   */
  static #insertDatasetsInFormDataFromEditBtn = (formData, form) => {
    for (const item of ["userId", "userName", "createdAt"]) {
      formData.append(
        item,
        form.querySelector(`input[name="${item}"]`).dataset[item],
      );
    }
  };

  /**
   * @param {FormData} formData
   * @param {HTMLFormElement} form
   */
  static #insertDatasetsInFormDataFromDeleteBtn = (formData, form) => {
    const items = form.action.includes("booking")
      ? ["id", "itemName", "itemDetails"]
      : ["id", "itemName"];

    /**
     * @param {string} item
     */
    const recoverData = (item) => {
      form.dataset[item].split(";")
        .map((details) => {
          const [name, value] = details.split(":");
          formData.append(
            name,
            value,
          );
        });
    };

    for (const item of items) {
      if (item === "itemDetails") {
        recoverData(item);
        continue;
      }

      formData.append(
        item,
        form.dataset[item],
      );
    }
  };

  /**
   * @param {HTMLDialogElement} form
   * @param {{ title: string; message: string }}
   */
  static #displayMessage = (form, { title, message }) => {
    const responseDialog = document.querySelector("dialog[data-response]");

    responseDialog.querySelector("h2").textContent = title;
    responseDialog.querySelector("p").textContent = message;

    form.closest("dialog").close();
    responseDialog.showModal();
  };

  /**
   * @param {HTMLDialogElement} form
   * @param {{ message: string }}
   */
  static #displayDeleteMessage = (form, { message }) => {
    const spanResponse = form.nextElementSibling;
    const paragraph = form.previousElementSibling;

    spanResponse.textContent = message;

    form.classList.add("none");
    paragraph.classList.add("none");
    spanResponse.classList.remove("none");
  };
}
