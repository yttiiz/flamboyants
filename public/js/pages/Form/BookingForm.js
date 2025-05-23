import { BookingFormHelper } from "../../utils/BookingFormHelper.js";
import { PageBuilder } from "../Builder.js";

export class BookingFormPage extends PageBuilder {
  initForm = () => {
    const id = "#data-booking";
    const cancelForms = document.querySelectorAll(
      `${id} .booking-card form`,
    );
    const dialog = document.querySelector(`${id} dialog`);

    this.#handleBookingLink();

    // Init forms submission.
    for (const form of cancelForms) {
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
  };

  /**
   * Prevent page to reload on click on booking link.
   */
  #handleBookingLink = () => {
    const path = globalThis.location.pathname.split("/")[1];
    const bookingLink = document.querySelector(".header-" + path);

    bookingLink.addEventListener("click", (e) => e.preventDefault());
  };

  /**
   * @param {Event} e
   */
  #submitHandler = async (e) => {
    e.preventDefault();

    const formData = BookingFormHelper.setFormData(e.target);

    const bookingId = e.target.dataset.bookingId;
    const bookingStart = e.target.dataset.bookingStart;
    const bookingEnd = e.target.dataset.bookingEnd;
    const bookingCreatedAt = e.target.dataset.bookingCreatedAt;

    formData.append("bookingId", bookingId);
    formData.append("bookingStart", bookingStart);
    formData.append("bookingEnd", bookingEnd);
    formData.append("bookingCreatedAt", bookingCreatedAt);

    const res = await fetch(e.target.action, {
      method: "DELETE",
      body: formData,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      mode: "cors",
    });

    if (res.ok && res.status === 200) {
      BookingFormHelper.displayDialogCancelledBooking(res);
    }
  };
}
