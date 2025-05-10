import { DefaultFormHelper } from "./DefaultFormHelper.js";

export class BookingFormHelper extends DefaultFormHelper {
  /**
   * @param {Response} response
   */
  static displayDialogCancelledBooking = async (response) => {
    const { message } = await response.json();

    const dialog = document.querySelector("#data-booking > dialog");
    BookingFormHelper.setUserDialogContent(
      dialog,
      {
        title: "Annulation réservation",
        paragraph: message,
      },
    );

    dialog.showModal();
  };
}
