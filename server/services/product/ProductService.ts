import {
  DefaultController,
  ProductAdminFormDataType,
  ProductsDataType,
  RouterContextAppType,
} from "@controllers";
import { FormDataType } from "@components";
import { Handler, Helper, Validator } from "@utils";
import {
  BookingsProductSchemaWithIDType,
  Mongo,
  NotFoundMessageType,
  ProductSchemaType,
  ProductSchemaWithIDType,
  ReviewsProductSchemaWithIDType,
} from "@mongo";
import { Document, ObjectId } from "@deps";

export class ProductService {
  private default;

  constructor(defaultController: DefaultController) {
    this.default = defaultController;
  }

  public getProduct = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    try {
      const _id = new ObjectId(ctx.params.id);
      const getFromDB = async <U extends Document>(db: string) =>
        await Mongo.selectFromDB<U>(db, ctx.params.id, "productId");

      const product = await Mongo.selectFromDB<ProductSchemaWithIDType>(
        "products",
        _id,
      );
      const reviews = await getFromDB<ReviewsProductSchemaWithIDType>(
        "reviews",
      );
      const bookings = await getFromDB<BookingsProductSchemaWithIDType>(
        "bookings",
      );

      if ("_id" in product && "_id" in reviews && "_id" in bookings) {
        const actualOrFutureBookings = Handler.getProductPresentOrNextBookings(
          bookings.bookings,
        );

        const body = await this.default.createHtmlFile(ctx, {
          id: "data-product",
          css: "product",
          data: {
            product,
            reviews,
            actualOrFutureBookings,
          },
          title: "Aka " + product.name,
        });

        this.default.response(ctx, body, 200);
      } else {
        const body = await this.default.createHtmlFile(ctx, {
          id: "data-not-found",
          css: "not-found",
          title: (product as NotFoundMessageType).message,
        });

        this.default.response(ctx, body, 404);
      }
    } catch (_) {
      const body = await this.default.createHtmlFile(ctx, {
        id: "data-not-found",
        css: "not-found",
        title: "page inexistante",
      });

      this.default.response(ctx, body, 404);
    }
  };

  public getProducts = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    const data: ProductsDataType = {};
    const cursor = Mongo.connectionTo<ProductSchemaWithIDType>(
      "products",
    );

    try {
      if ("message" in cursor) {
        const body = await this.default.createHtmlFile(ctx, {
          id: "data-home",
          css: "home",
          data: this.default.errorMsg,
        });

        this.default.response(ctx, body, 200);
      } else {
        await cursor.map((document, key) => (data[key + 1] = document));

        for await (const key of Object.keys(data)) {
          const id = data[key as unknown as keyof typeof data]._id;
          const reviews = await Mongo.selectFromDB<
            ReviewsProductSchemaWithIDType
          >(
            "reviews",
            id.toString(),
            "productId",
          );

          if ("_id" in reviews) {
            data[key as unknown as keyof typeof data].reviews = reviews;
          }
        }

        const body = await this.default.createHtmlFile(ctx, {
          id: "data-home",
          css: "home",
          data,
        });
        this.default.response(ctx, body, 200);
      }
    } catch (error) {
      Helper.writeLog(error);
    }
  };

  public postCreate = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    try {
      const formData = await ctx.request.body.formData();
      const dataModel = await Helper.convertJsonToObject<FormDataType>(
        "/server/data/admin/create-product-form.json",
      );

      Helper.addFileModelTo(dataModel);

      const dataParsed = Validator.dataParser(formData, dataModel);

      if (!dataParsed.isOk) {
        return this.default.response(
          ctx,
          {
            title: "Enregistrement non effectué",
            message: dataParsed.message,
          },
          401,
        );
      }

      // 1. Retreive all values needed.
      const {
        name,
        type,
        area,
        rooms,
        price,
        description,
        thumbnail,
        pictures,
      } = dataParsed.data as ProductAdminFormDataType;

      const title = "Ajout appartement";
      const alt = `image principale ${name.toLocaleLowerCase()}`;

      let isAllDocumentsInsertCorrectly = true;
      let productDocument: Omit<
        ProductSchemaWithIDType,
        "bookingId" | "reviewId"
      >;

      if (thumbnail && pictures) {
        // 2. If 'thumbnail' & 'pictures' are defined, set document.
        productDocument = {
          _id: new ObjectId(),
          name,
          description,
          details: {
            rooms: +rooms,
            area: +area,
            price: Helper.convertToNumber(price),
            type,
          },
          thumbnail: {
            alt,
            src: await Helper.writePicFile(thumbnail, alt.replaceAll(" ", "_")),
          },
          pictures: [
            {
              alt: `${name.toLocaleLowerCase()} - ${type}, le ${
                Helper.displayDate(
                  { style: "normal" },
                )
              }`,
              src: await Helper.writePicFile(
                pictures,
                `${name.toLocaleLowerCase()}_${
                  Math.round(
                    (Math.random() + 1) * 1000,
                  )
                }`,
              ),
            },
          ],
        };

        // 3. Insert document in database...
        const productId = await Mongo.insertIntoDB(productDocument, "products");

        if (!productId.includes("failed")) {
          // 4. ...create 'review' document related to current product...
          const reviewDocument = {
            _id: new ObjectId(),
            productName: name,
            productId,
            reviews: [],
          };

          const reviewId = await Mongo.insertIntoDB(reviewDocument, "reviews");

          // 5. ...and 'booking' document related to current product...
          const bookingDocument = {
            _id: new ObjectId(),
            productName: name,
            productId,
            bookings: [],
          };

          const bookingId = await Mongo.insertIntoDB(
            bookingDocument,
            "bookings",
          );

          const isBookingAndReviewDocumentsOk = !reviewId.includes("failed") &&
            !bookingId.includes("failed");

          // 6. ...finally set 'bookingId' & 'reviewId' in product document.
          if (isBookingAndReviewDocumentsOk) {
            const newProductDocument: Partial<ProductSchemaWithIDType> = {
              ...productDocument,
            };

            newProductDocument["reviewId"] = reviewId;
            newProductDocument["bookingId"] = bookingId;

            isAllDocumentsInsertCorrectly = await Mongo.updateToDB(
              new ObjectId(productId),
              newProductDocument,
              "products",
            );
          } else isAllDocumentsInsertCorrectly = false;
        } else isAllDocumentsInsertCorrectly = false;

        isAllDocumentsInsertCorrectly
          ? this.default.response(
            ctx,
            {
              title,
              message: Helper
                .messageToAdmin`L'appartement ${name} ${true} été${"add"}`,
            },
            200,
          )
          : this.default.response(
            ctx,
            {
              title,
              message: Helper
                .messageToAdmin`L'appartement ${name} ${false} été${"add"}`,
            },
            200,
          );
      } else {
        this.default.response(
          ctx,
          {
            title,
            message:
              "Vous devez obligatoirement joindre des images pour créer un nouvel appartement.",
          },
          200,
        );
      }
    } catch (error) {
      Helper.writeLog(error);
    }
  };

  public putHandler = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    try {
      const _id = new ObjectId(ctx.params.id);
      const formData = await ctx.request.body.formData();
      const dataModel = await Helper.convertJsonToObject<FormDataType>(
        "/server/data/admin/product-form.json",
      );

      Helper.addFileModelTo(dataModel);

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

      const {
        name,
        type,
        area,
        rooms,
        price,
        description,
        thumbnail,
        pictures,
      } = dataParsed.data as ProductAdminFormDataType;

      // Convert object to 'Product' document.
      const document: Partial<
        Omit<ProductSchemaType, "reviewId" | "bookingId">
      > = {
        name,
        description,
        details: {
          rooms: +rooms,
          area: +area,
          price: Helper.convertToNumber(price),
          type,
        },
      };

      if (thumbnail) {
        const alt = `image principale ${name}`;
        const src = await Helper.writePicFile(
          thumbnail,
          alt.replaceAll(" ", "_"),
        );

        document["thumbnail"] = { src, alt };
      }

      const isUpdate = await Mongo.updateToDB(_id, document, "products");

      let isPictureUpdate = true;

      if (pictures) {
        const alt = `${name} - ${type}, le ${
          Helper.displayDate({
            style: "normal",
          })
        }`;
        const src = await Helper.writePicFile(
          pictures,
          `${name}_${Math.round((Math.random() + 1) * 1000)}`,
        );

        isPictureUpdate = await Mongo.addNewItemIntoDB(
          _id,
          { src, alt },
          "products",
          "pictures",
        );
      }

      return this.default.response(
        ctx,
        {
          title: "Modification appartement",
          message: Helper.messageToAdmin`L'appartement ${name as string} ${
            isUpdate && isPictureUpdate
          } été${"update"}`,
        },
        200,
      );
    } catch (error) {
      Helper.writeLog(error);
    }
  };

  public static getProductFromDB = async <T extends Document>(id: string) => {
    const _id = new ObjectId(id);
    return await Mongo.selectFromDB<T>("products", _id);
  };
}
