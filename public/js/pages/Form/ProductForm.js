import { PageBuilder } from "../Builder.js";
import { ProductFormHelper } from "../../utils/ProductFormHelper.js";

export class ProductFormPage extends PageBuilder {
  initForm = () => {
    const id = "#data-product";

    this.#handleProductLink();

    /** @type {HTMLFormElement[]} */
    const forms = document.querySelectorAll(`${id} form`);
    const dialog = document.querySelector(`${id} dialog`);

    // Init forms submission.
    for (const form of forms) {
      form.addEventListener(
        "submit",
        (e) => this.#submitHandler(e),
      );
    }

    // Init close event dialog modal.
    dialog.querySelector("button[data-close]")
      .addEventListener("click", () => {
        dialog.close();
      });

    const [bookingForm, reviewForm] = forms;

    this.#handleBookingForm(bookingForm);

    if (reviewForm) {
      this.#handleReviewForm(reviewForm);
    }
  };

  /**
   * Prevent page to reload on click on product link.
   */
  #handleProductLink = () => {
    const productName = document.querySelector("h1")?.textContent?.split(" ")[1]
      .toLowerCase();
    const productLink = document.querySelector(".header-" + productName);

    productLink.addEventListener("click", (e) => e.preventDefault());
  };

  /**
   * @param {HTMLFormElement} form
   */
  #handleBookingForm = (form) => {
    /** @type {NodeListOf<HTMLInputElement>} */
    const [
      startingDateInput,
      endingDateInput,
    ] = form.querySelectorAll('input[type="date"]');

    //Change ending-date input min attribute, according to user selected starting-date.
    startingDateInput.addEventListener("change", (e) => {
      endingDateInput.min = e.target.value;
    });
  };

  /**
   * @param {HTMLFormElement} form
   */
  #handleReviewForm = (form) => {
    for (const input of form.querySelectorAll("input")) {
      input.addEventListener("click", (e) => {
        /** @type {HTMLSpanElement} */
        const currentSpan = e.currentTarget.previousElementSibling;
        /** @type {HTMLDivElement} */
        const labelsContainer = e.currentTarget.closest("div");

        if (!currentSpan.classList.contains("selected")) {
          currentSpan.classList.add("selected");
        }

        for (const label of labelsContainer.querySelectorAll("label")) {
          const searchSpan = label.querySelector("span");

          if (
            searchSpan.classList.contains("selected") &&
            currentSpan.textContent !== searchSpan.textContent
          ) {
            searchSpan.classList.remove("selected");
          }
        }
      });
    }
  };

  /**
   * @param {Event} e
   */
  #submitHandler = async (e) => {
    e.preventDefault();

    const formData = ProductFormHelper.setFormData(e.target);
    const productId = location.pathname.replace("/product/", "");
    const className = e.target.action.replace(location.origin + "/", "");
    const isClassNameBooking = className === "booking";

    if (isClassNameBooking) {
      const isUserConnected = e.target.dataset.userConnected === "true";

      if (!isUserConnected) {
        ProductFormHelper.displayDialogLoginInfoToUser(
          isUserConnected,
        );
        return;
      }
    }

    formData.append("id", productId);

    const res = await fetch(e.target.action, {
      method: "POST",
      body: formData,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      mode: "cors",
    });

    if (res.ok) {
      ProductFormHelper.removeInputsValues(e.target.children);

      isClassNameBooking
        ? ProductFormHelper.displayDialogUserBookingDetails(res)
        : ProductFormHelper.displayDialogUserReviewDetails(res);
    } else if (res.status === 401) {
      ProductFormHelper.displayDialogErrorInfoToUser(res);
    }
  };
}
