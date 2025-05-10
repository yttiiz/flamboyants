// deno-fmt-ignore-file
import { Helper } from "@utils";
import { Dialog, BookingCard } from "../mod.ts";
import type {
  ComponentType,
  OrganismNameType,
  BookingDataType,
 } from "../mod.ts";
import { BookingUserInfoType } from "@mongo";

const {
title,
card,
} = await Helper.convertJsonToObject<BookingDataType>(
"/server/data/booking/booking.json",
);

export const SectionsBooking: ComponentType<
 OrganismNameType,
 (bookingsUserInfo: BookingUserInfoType[]) => string
> = {
  name: "SectionsBooking",
  html: (bookingsUserInfo: BookingUserInfoType[]) => {
    return `
    <section>
      <div class="container">
        <div>
          <h1>${title}</h1>
        </div>
        <div class="user-bookings">
          ${bookingsUserInfo.length > 0
            ?
            (
              `<ul>
              ${bookingsUserInfo.map(
                bookingUserInfo => (
                  `<li>
                    ${BookingCard.html({
                      card,
                      userInfo: bookingUserInfo,
                    })}
                  </li>`
                )
              ).join("")}
              </ul>`
            )
            : "Aucune réservation effectuée pour le moment."
          }
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <div>
          <h1>Lorem ipsum dolor</h1>
          <p>Lorem ipsum dolor.</p>
        </div>
      </div>
    </section>
    ${Dialog.html({})}`;
  }
}