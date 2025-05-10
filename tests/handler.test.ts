import { assertEquals, task } from "./test-deps.ts";
import { Handler } from "../server/utils/mod.ts";
import { BookingsType } from "@mongo";

Deno.test({
  name: task`rate average${"Handler"}`,
  fn() {
    assertEquals("2,8", Handler.rateAverage([2, 4, 3, 2, 3]));
  },
});

Deno.test({
  name: task`get product availability${"Handler"}`,
  fn() {
    const booking = {
      startingDate: "2024-05-22",
      endingDate: "2024-05-25",
      createdAt: Date.now(),
      userId: "00001",
      userName: "Marcus Garvey",
    };

    const now = Date.now();
    const isAvailable = now < (new Date(booking.startingDate).getTime()) ||
      now > (new Date(booking.endingDate).getTime());

    assertEquals({
      isAvailable,
      endingDate: new Date(booking.endingDate).getTime(),
    }, Handler.getProductAvailability(booking));

    assertEquals({
      isAvailable: true,
      endingDate: undefined,
    }, Handler.getProductAvailability());
  },
});

Deno.test({
  name: task`get current booking${"Handler"}`,
  fn() {
    const bookingsEmpty: BookingsType[] = [], bookingsSet: BookingsType[] = [];
    const booking = {
      startingDate: Handler.getIncomingDate(2),
      endingDate: Handler.getIncomingDate(5),
      createdAt: Date.now(),
      userId: "00001",
      userName: "Marcus Garvey",
    };
    bookingsSet.push(booking);

    assertEquals([], Handler.getProductPresentOrNextBookings(bookingsEmpty));
    assertEquals(
      [booking],
      Handler.getProductPresentOrNextBookings(bookingsSet),
    );
  },
});
