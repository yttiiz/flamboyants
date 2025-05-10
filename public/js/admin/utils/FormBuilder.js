import * as Types from "../../types/types.js";
import {
  handleInputFile,
  hydrateInput,
  hydrateSelect,
} from "../../utils/_commonFunctions.js";

export class FormBuilder {
  static #hydrateSelect = hydrateSelect;
  static #hydrateInput = hydrateInput;
  static #handleInputFile = handleInputFile;

  static #warningText =
    "Les modifications apportées seront directement envoyées à la base de données. <b>Soyez bien sûrs des informations que vous renseignés</b>.";

  /**
   * @param {HTMLDivElement} container
   * @param {string} dataType
   * @param {Types.Users | Types.Products | Types.BookingsRegistred & { productName: string }} data
   */
  static handleCards = (
    container,
    dataType,
    data,
  ) => {
    const [
      editOrDeleteBtn,
      deleteBtn,
    ] = container.querySelector("div:last-of-type").children;

    // Bookings cards can have only a 'delete' button (if its ending date is over).
    if (deleteBtn) {
      editOrDeleteBtn.addEventListener(
        "click",
        (e) => FormBuilder.#editButtonHandler(e, dataType, data),
      );
      deleteBtn?.addEventListener(
        "click",
        (e) => FormBuilder.#deleteButtonHandler(e),
      );
    } else {
      editOrDeleteBtn.addEventListener(
        "click",
        (e) => FormBuilder.#deleteButtonHandler(e),
      );
    }
  };
  /**
   * Inserts an `img` element and a `figure` before each input related to pictures.
   * @param {HTMLDialogElement} dialog
   */
  static insertPictureIn = (dialog) => {
    const form = dialog.querySelector("form");
    const inputThumbnail = form.querySelector('input[name="thumbnail-file"]');
    const inputPictures = form.querySelector('input[name="pictures-file"]');
    const buttons = form.querySelectorAll("label button");

    const img = document.createElement("img");
    img.setAttribute("data-name", "thumbnail");

    const figure = document.createElement("figure");
    figure.setAttribute("data-name", "pictures");

    inputThumbnail.closest("label").appendChild(img);
    inputPictures.closest("label").appendChild(figure);

    FormBuilder.#handleSearchPhoto(buttons);
  };

  /**
   * @param {NodeList<HTMLButtonElement>} buttons
   */
  static #handleSearchPhoto = (buttons) => {
    // Add handle search picture listener to buttons.
    const names = ["thumbnail", "pictures"];

    for (let i = 0; i <= buttons.length - 1; i++) {
      buttons[i].addEventListener(
        "click",
        (e) => FormBuilder.#handleInputFile(e, names[i]),
      );
    }
  };

  /**
   * Fills `img` in dialog.
   * @param {Types.Product} data
   * @param {HTMLDialogElement} dialog
   */
  static #fillImgs = (data, dialog) => {
    // Set main image.
    if (dialog.querySelector("form > label > img")) {
      const img = dialog.querySelector("form > label > img");
      const { src, alt } = data[img.dataset.name];

      img.src = src;
      img.alt = alt;
    }

    // Set all figure images.
    if (dialog.querySelector("form > label > figure")) {
      const figure = dialog.querySelector("form > label > figure");

      if (figure.children.length > 0) {
        figure.innerHTML = "";
      }

      for (const item of data[figure.dataset.name]) {
        const imgContainer = document.createElement("div");
        const { src, alt } = item;

        imgContainer.innerHTML =
          `<img src="${src}" alt="${alt}" /><button title="supprimer"><span></span><span></span></button>`;

        figure.appendChild(imgContainer);
      }
    }
  };

  /**
   * @param {Types.User | Types.Product | Types.BookingsRegistred & { productName: string }} data
   * @param {HTMLDialogElement} dialog
   * @param {(data: Types.Product, dialog: HTMLDialogElement) => void} [fillImgs]
   */
  static #insertData = (data, dialog, fillImgs) => {
    const labels = dialog.querySelector("form").querySelectorAll("label");

    for (const label of labels) {
      if (label.querySelector("input")) {
        const input = label.querySelector("input");
        FormBuilder.#hydrateInput(input, data);
      }

      if (label.querySelector("textarea")) {
        const textarea = label.querySelector("textarea");
        FormBuilder.#hydrateInput(textarea, data);
      }

      if (label.querySelector("select")) {
        const select = label.querySelector("select");
        FormBuilder.#hydrateSelect(select, data);
      }
    }

    // Hide fieldset if user photo is set to "default"
    if (dialog.querySelector("fieldset")) {
      FormBuilder.#handleFieldsetUserPhotoDisplay(data, dialog);
    }

    fillImgs ? fillImgs(data, dialog) : null;
  };

  /**
   * @param {Types.User} data
   * @param {HTMLDialogElement} dialog
   */
  static #handleFieldsetUserPhotoDisplay = (data, dialog) => {
    const fieldset = dialog.querySelector("fieldset");

    if (data["photo"].includes("default")) {
      if (!(fieldset.classList.contains("none"))) {
        fieldset.classList.add("none");

        for (const input of fieldset.querySelectorAll("input")) {
          input.removeAttribute("required");
        }
      }
    } else {
      if (fieldset.classList.contains("none")) {
        fieldset.classList.remove("none");

        for (const input of fieldset.querySelectorAll("input")) {
          input.setAttribute("required", true);
        }
      }
    }
  };

  /**
   * @param {Event} e
   * @param {string} dataType
   * @param {Types.Users | Types.Products | Types.BookingsRegistred & { productName: string }} data
   */
  static #editButtonHandler = (
    e,
    dataType,
    data,
  ) => {
    /**
     * Set `form` action to current data.
     * @param {HTMLDialogElement} dialog
     * @param {string} route
     * @param {string} id
     */
    const setFormAction = (dialog, route, id) => {
      dialog.querySelector("form").action = `${location.origin}/${route}/${id}`;
    };
    const dialog = document.querySelector(`dialog[data-${dataType}]`);
    let dataTitle = "";

    // Insert Data.
    for (const key in data) {
      if (dataType !== "bookings") {
        if (data[key]._id === e.currentTarget.dataset.id) {
          switch (dataType) {
            case "products": {
              dataTitle = `de l'appartement ${data[key].name}`;
              FormBuilder.#insertData(data[key], dialog, FormBuilder.#fillImgs);
              break;
            }

            case "users": {
              dataTitle = `du profil de ${data[key].firstname} ${
                data[key].lastname
              }`;
              FormBuilder.#insertData(data[key], dialog);
              break;
            }
          }

          setFormAction(dialog, dataType.slice(0, -1), data[key]._id);
          break;
        }
      } else {
        dataTitle = `de la réservation de ${data.userName}`;
        FormBuilder.#insertData(data, dialog);
        setFormAction(dialog, dataType.slice(0, -1), data._id);
        break;
      }
    }

    // Set modal.
    dialog.querySelector("h2").textContent = `Modification ${dataTitle}`;
    dialog.querySelector("p").innerHTML = FormBuilder.#warningText;

    dialog.showModal();
  };

  /**
   * @param {Event} e
   * @param {string} dataType
   */
  static #deleteButtonHandler = (e) => {
    const dataType = e.currentTarget.dataset.type;
    const dialog = document.querySelector(`dialog[data-delete]`);
    const form = dialog.querySelector("form");

    // If modal has already been used.
    if (form.classList.contains("none")) {
      form.classList.remove("none");
      form.previousElementSibling.classList.remove("none");
      form.nextElementSibling.classList.add("none");
    }

    // Set delete form.
    form.action = "/" + dataType;
    form.dataset.id = e.currentTarget.dataset.id;
    form.dataset.itemName = e.currentTarget.dataset.itemName;

    if (dataType === "booking") {
      form.dataset.itemDetails = e.currentTarget.dataset.itemDetails;
    } else if (form.dataset.itemDetails) {
      form.removeAttribute("data-item-details");
    }

    // Set modal text.
    dialog.querySelector("h2").textContent = FormBuilder.#setText(
      "h2",
      dataType,
    );
    dialog.querySelector("p").textContent = FormBuilder.#setText("p", dataType);

    dialog.showModal();
  };

  static createButtonHandler = (container) => {
    const dialog = document.querySelector("dialog[data-create-product]");
    const buttons = dialog.querySelectorAll("form > label button");

    dialog.querySelector("h2").textContent = "Ajouter un appartement";
    dialog.querySelector("p").innerHTML = FormBuilder.#warningText;

    FormBuilder.#handleSearchPhoto(buttons);

    container.querySelector("button").addEventListener("click", () => {
      dialog.showModal();
    });
  };

  /**
   * @param {"h2" | "p"} tag
   * @param {string} dataType
   */
  static #setText = (tag, dataType) => {
    switch (dataType) {
      case "user":
        dataType = "l'utilisateur";
        break;
      case "product":
        dataType = "l'appartement";
        break;
      default:
        dataType = "la réservation";
    }

    return tag === "h2"
      ? `Suppression de ${dataType}`
      : `Etes-vous vraiment sûr de vouloir supprimer ${dataType}.`;
  };
}
