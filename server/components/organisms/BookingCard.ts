// deno-fmt-ignore-file
import { Handler, Helper } from "@utils";
import {
StarSvg,
  type BookingCardDataType,
  type ComponentType,
  type OrganismNameType,
 } from "../mod.ts";
 import { BookingUserInfoType } from "@mongo";

type ParameterType = {
  card: BookingCardDataType;
  userInfo: BookingUserInfoType;
};

 export const BookingCard: ComponentType<
  OrganismNameType,
  (arg: ParameterType) => string
> = {
  name: "BookingCard",
  html: ({
    card: {
      createdAtTitle,
      periodTitle,
      details: {
        type,
        area,
        rooms,
      },
      amount,
      cancelBookingForm: {
        action,
        method,
        btnText,
      }
    },
    userInfo: {
      bookingId,
      productName,
      startingDate,
      endingDate,
      details,
      thumbnail,
      rates,
      createdAt,
    },
  }) => {
    return `
    <div class="booking-card">
      <header>
        <div>
          <h4>${createdAtTitle}</h4>
          <p>${Helper.displayDate({ date: createdAt })}</p>
        </div>
        <div>
          <h4>${periodTitle}</h4>
          <p>${
            Helper.displayDate({
              date: new Date(startingDate),
              style: "normal",
            })} au ${
            Helper.displayDate({
              date: new Date(endingDate),
              style: "normal",
          })}</p>
        </div>
      </header>
      <div class="card-content">
        <figure>
          <img src="${thumbnail.src}" alt="${thumbnail.alt}" />
          <figcaption>
            <h3>Aka ${productName}</h3>
            <span data-rate="${Handler.rateAverage(rates)}">${StarSvg.html}</span>
            <ul>
              <li>${type} ${details.type}</li>
              <li>${area} ${details.area}m²</li>
              <li>${rooms} ${details.rooms}</li>
            </ul>
            <p><strong>${Helper.formatPrice(details.price)}</strong> la nuit</p>
          </figcaption>
        </figure>
        <div>
          <div>
            <h4>${amount.toLocaleUpperCase()}</h4>
            <p>pour 
              <strong>
                ${Handler.getDaysNumber(
                  startingDate,
                  endingDate
                )} nuit${Handler.getDaysNumber(
                  startingDate,
                  endingDate
                ) > 1 ? "s" : ""}
              </strong> à ${Helper.formatPrice(details.price)}
            </p>
            <span>
              ${Helper.formatPrice(
                details.price * Handler.getDaysNumber(startingDate, endingDate),
              )}
            </span>
          </div>
          ${new Date(startingDate).getTime() > Date.now()
          ?
          (
            `<form
              action="${action}"
              method="${method}"
              data-booking-id="${bookingId}"
              data-booking-start="${startingDate}"
              data-booking-end="${endingDate}"
              data-booking-created-at="${createdAt}"
            >
              <button type="submit">${btnText}</button>
            </form>`
          )
          : ""}
        </div>
      </div>
    </div>
    `;
  }
}