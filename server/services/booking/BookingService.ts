import {
  DefaultController,
  RouterContextAppType,
  SessionType,
} from "@controllers";
import {
  BookingsProductSchemaWithIDType,
  BookingsType,
  BookingUserInfoType,
  FindCursorBookingsProductType,
  FindCursorProductType,
  FindCursorReviewProductType,
  Mongo,
  ProductSchemaWithIDType,
  ReviewsProductSchemaWithIDType,
} from "@mongo";
import { Handler, Helper, Mailer, Validator } from "@utils";
import { FormDataType, ProductDataType } from "@components";
import { ObjectId } from "@deps";
import { ProductService, UserService } from "@services";

export class BookingService {
  private default;

  constructor(defaultController: DefaultController) {
    this.default = defaultController;
  }

  public getBooking = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    if (ctx.state.session && ctx.state.session.has("userId")) {
      const data: BookingUserInfoType[] = [];
      const userId = (ctx.state.session as SessionType).get("userId");

      try {
        const bookingsCursor = Mongo.connectionTo<
          BookingsProductSchemaWithIDType
        >("bookings");
        const productsCursor = Mongo.connectionTo<
          ProductSchemaWithIDType
        >("products");
        const reviewsCursor = Mongo.connectionTo<
          ReviewsProductSchemaWithIDType
        >("reviews");

        if (
          ("message" in bookingsCursor &&
            bookingsCursor["message"].includes("failed")) ||
          ("message" in productsCursor &&
            productsCursor["message"].includes("failed")) ||
          ("message" in reviewsCursor &&
            reviewsCursor["message"].includes("failed"))
        ) {
          this.default.response(ctx, "", 302, "/");
        } else {
          const products = await (
            productsCursor as FindCursorProductType
          ).toArray();
          const reviews = await (
            reviewsCursor as FindCursorReviewProductType
          ).toArray();

          // Get bookings related to user.
          for await (
            const document of bookingsCursor as FindCursorBookingsProductType
          ) {
            for (const booking of document.bookings) {
              if (booking.userId === userId.toString()) {
                // Get product details related to current booking.
                const details = products.find(
                  (product) => document.productId === product._id.toString(),
                )?.details;

                // Get product thumbnail related to current booking.
                const thumbnail = products.find(
                  (product) => document.productId === product._id.toString(),
                )?.thumbnail;

                // Get product rates related to current booking.
                const rates = reviews
                  .find((review) => document.productId === review.productId)
                  ?.reviews.reduce((acc, review) => {
                    acc.push(review.rate);
                    return acc;
                  }, [] as number[]);

                if (details && thumbnail && rates) {
                  data.push({
                    productId: document.productId,
                    productName: document.productName,
                    bookingId: document._id.toString(),
                    startingDate: booking.startingDate,
                    endingDate: booking.endingDate,
                    details,
                    thumbnail,
                    rates,
                    createdAt: booking.createdAt,
                  });
                }
              }
            }
          }

          data.sort(
            (a, b) =>
              new Date(a.startingDate).getTime() -
              new Date(b.startingDate).getTime(),
          );

          const body = await this.default.createHtmlFile(ctx, {
            id: "data-booking",
            css: "booking",
            title: "gérer vos réservations",
            data,
          });

          this.default.response(ctx, body, 200);
        }
      } catch (error) {
        Helper.writeLog(error);
      }
    } else {
      this.default.response(ctx, "", 302, "/");
    }
  };

  public postHandler = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    const formData = await ctx.request.body.formData();
    const { booking } = await Helper.convertJsonToObject<ProductDataType>(
      `/server/data/product/product.json`,
    );

    const dataParsed = Validator.dataParser(formData, booking);

    if (!dataParsed.isOk) {
      return this.default.response(ctx, { message: dataParsed.message }, 401);
    }

    const {
      "starting-date": startingDate,
      "ending-date": endingDate,
      id,
    } = dataParsed.data as Record<string, string>;

    const { userId, userName } = await UserService.getUserInfo(ctx);

    const newBooking = {
      userId,
      userName,
      startingDate,
      endingDate,
      createdAt: Date.now(),
    };

    const product = await ProductService.getProductFromDB<
      ProductSchemaWithIDType
    >(id);
    const bookings = await Mongo.selectFromDB<BookingsProductSchemaWithIDType>(
      "bookings",
      id,
      "productId",
    );

    if ("_id" in product && "_id" in bookings) {
      const bookingsAvailability = Handler.compareBookings(
        newBooking,
        bookings,
      );

      if (bookingsAvailability.isAvailable) {
        const { bookingId } = product;
        const _bookingId = new ObjectId(bookingId);

        const isInsertionOk = await Mongo.addNewItemIntoDB(
          _bookingId,
          newBooking,
          "bookings",
          "bookings",
        );

        if (isInsertionOk) {
          try {
            await Mailer.send({
              to: ctx.state.session.get("userEmail"),
              receiver: ctx.state.session.get("userFullname"),
            });
          } catch (error) {
            Helper.writeLog(error);
          }
        }

        isInsertionOk
          ? this.default.response(
            ctx,
            {
              title: "Réservation confirmée",
              email: ctx.state.session.get("userEmail"),
              message:
                "Votre réservation du {{ start }} au {{ end }} a bien été enregistrée. Un e-mail de confirmation a été envoyé à l'adresse {{ email }}.",
              booking: {
                start: Helper.displayDate({
                  date: new Date(newBooking.startingDate),
                  style: "short",
                }),
                end: Helper.displayDate({
                  date: new Date(newBooking.endingDate),
                  style: "short",
                }),
              },
            },
            200,
          )
          : this.default.response(ctx, "", 503);
      } else {
        const { booking } = bookingsAvailability;

        this.default.response(
          ctx,
          {
            title: "Créneau indisponible",
            message:
              "Le logement est occupé du {{ start }} au {{ end }}. Choisissez un autre créneau.",
            booking: {
              start: Helper.displayDate({
                date: new Date(booking.startingDate),
                style: "short",
              }),
              end: Helper.displayDate({
                date: new Date(booking.endingDate),
                style: "short",
              }),
            },
          },
          200,
        );
      }
    } else {
      this.default.response(
        ctx,
        {
          message:
            "Le produit pour lequel vous souhaitez laisser un avis, est momentanément inaccessible.",
        },
        503,
      );
    }
  };

  public putHandler = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    try {
      const formData = await ctx.request.body.formData();
      const dataModel = await Helper.convertJsonToObject<FormDataType>(
        "/server/data/admin/booking-form.json",
      );

      const dataParsed = Validator.dataParser(formData, dataModel);

      if (!dataParsed.isOk) {
        return this.default.response(
          ctx,
          {
            title: "Modification non effectuée",
            message: dataParsed.message,
          },
          401,
        );
      }

      const data = dataParsed.data as unknown as BookingsType;

      // Even 'createdAt' is typed as number, it's a string.
      const itemValue = +data.createdAt;
      data.createdAt = itemValue;

      const isUpdate = await Mongo.updateItemIntoDB({
        data,
        collection: "bookings",
        key: "bookings",
        itemKey: "createdAt",
        itemValue,
      });

      return this.default.response(
        ctx,
        {
          title: "Modification réservation",
          message: Helper
            .messageToAdmin`La réservation de ${data.userName} ${isUpdate} été${"update"}`,
        },
        200,
      );
    } catch (error) {
      Helper.writeLog(error);
    }
  };

  public deleteBooking = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    const data = await ctx.request.body.formData();
    const fields: Record<string, FormDataEntryValue> = {};

    for (const [key, value] of data) {
      fields[key] = value;
    }

    const { bookingId, bookingStart, bookingEnd, bookingCreatedAt } =
      fields as Record<string, string>;

    const _id = new ObjectId(bookingId);
    const bookingToDelete = {
      userId: (ctx.state.session as SessionType).get("userId").toString(),
      userName: (ctx.state.session as SessionType).get("userFullname"),
      startingDate: bookingStart,
      endingDate: bookingEnd,
      createdAt: +bookingCreatedAt,
    };

    const isBookingDelete = await Mongo.removeItemFromDB(
      _id,
      bookingToDelete,
      "bookings",
      "bookings",
    );

    this.default.response(
      ctx,
      {
        message: `Votre réservation ${
          isBookingDelete ? "a bien été" : "n'a pas pu être"
        } annulée`,
      },
      200,
    );
  };
}
