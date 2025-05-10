import {
  BookingsProductSchemaWithIDType,
  BookingsType,
  ReviewsProductSchemaWithIDType,
} from "@mongo";
import type { ReturnBookingAvailabilityType } from "./mod.ts";

export class Handler {
  public static rateAverage(
    ratesOrReviewsDocument:
      | ReviewsProductSchemaWithIDType
      | number[],
    rateCount = 0,
  ) {
    let rateSummary = 0;
    const reviews = "_id" in ratesOrReviewsDocument
      ? ratesOrReviewsDocument.reviews
      : ratesOrReviewsDocument;

    for (const review of reviews) {
      rateCount++;

      typeof review === "number"
        ? (rateSummary += review)
        : (rateSummary += review.rate);
    }

    return new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    }).format(rateSummary === 0 ? 0 : rateSummary / rateCount);
  }

  public static getProductAvailability(booking?: BookingsType | undefined) {
    if (booking) {
      const today = Date.now();
      const startingDate = new Date(booking.startingDate).getTime();
      const endingDate = new Date(booking.endingDate).getTime();

      return {
        isAvailable: today < startingDate || today > endingDate,
        endingDate,
      };
    }

    return {
      isAvailable: true,
      endingDate: undefined,
    };
  }

  public static getProductPresentOrNextBookings(bookings: BookingsType[]) {
    if (bookings.length > 0) {
      const today = Date.now();
      const presentOrNextBookings = [];

      for (const booking of bookings) {
        if (
          Handler.getTime(booking.startingDate) > today ||
          Handler.getTime(booking.endingDate) >= today
        ) {
          presentOrNextBookings.push(booking);
        }
      }

      return presentOrNextBookings;
    }

    return bookings;
  }

  public static compareBookings(
    newBooking: BookingsType,
    bookings: BookingsProductSchemaWithIDType,
  ): ReturnBookingAvailabilityType {
    let bool = true;
    let nextBookings = Handler
      .getProductPresentOrNextBookings(bookings.bookings);

    nextBookings = Handler.sortFromClosestToOlderBookings(nextBookings);

    for (const booking of nextBookings) {
      const isInsideBooking = Handler.getTime(newBooking.startingDate) >
          Handler.getTime(booking.startingDate) &&
        Handler.getTime(newBooking.startingDate) <=
          Handler.getTime(booking.endingDate);

      const isSurroundingBooking = Handler.getTime(newBooking.startingDate) <
          Handler.getTime(booking.startingDate) &&
        Handler.getTime(newBooking.endingDate) >=
          Handler.getTime(booking.endingDate);

      if (isInsideBooking || isSurroundingBooking) {
        bool = false;
        return {
          isAvailable: bool,
          booking,
        };
      }
    }

    return {
      isAvailable: bool,
    };
  }

  public static setInputDateMinAttribute(lastBookings: BookingsType[]) {
    const today = new Date();

    lastBookings = Handler.sortFromClosestToOlderBookings(lastBookings);

    for (const booking of lastBookings) {
      if (
        Handler.getTime(booking.startingDate) > today.getTime() ||
        Handler.getTime(booking.endingDate) < today.getTime()
      ) {
        // Add 1 to month cause it start at 0.
        const month = today.getMonth() + 1;

        return `${today.getFullYear()}-${
          month < 10 ? `0${month}` : month
        }-${today.getDate()}`;
      } else {
        return booking.endingDate;
      }
    }
  }

  public static getDaysNumber(start: string, end: string) {
    const DAY = 1000 * 60 * 60 * 24;

    return Math.round((Handler.getTime(end) - Handler.getTime(start)) / DAY);
  }

  public static sortFromClosestToOlderBookings(bookings: BookingsType[]) {
    return bookings.sort((a, b) => (
      Handler.getTime(a.startingDate) - Handler.getTime(b.startingDate)
    ));
  }

  public static getIncomingDate(days: number) {
    const DAY = 1000 * 60 * 60 * 24;

    const day = new Date(Date.now() + (DAY * days)).getDate();
    const month = new Date(Date.now() + (DAY * days)).getMonth() + 1;
    const year = new Date(Date.now() + (DAY * days)).getFullYear();

    return `${year}-${month >= 10 ? month : `0${month}`}-${
      day >= 10 ? day : `0${day}`
    }`;
  }

  private static getTime(date: string) {
    return new Date(date).getTime();
  }
}
