import { DefaultFormHelper } from "./DefaultFormHelper.js";

export class BookingFormHelper extends DefaultFormHelper {
  /**
   * @param {Response} response
   */
  static displayDialogCancelledBooking = async (response) => {
    const { message, bookingId, isBookingDeleted } = await response.json();

    const dialog = document.querySelector("#data-booking > dialog");
    BookingFormHelper.setUserDialogContent(
      dialog,
      {
        title: "Annulation réservation",
        paragraph: message,
      },
    );

    dialog.showModal();

    if (isBookingDeleted) {
      const bookingCardToHide = document.querySelector(
        `form[data-booking-id="${bookingId}"]`,
      )
        .closest("li");

      bookingCardToHide.style.display = "none";
    }
  };
}
