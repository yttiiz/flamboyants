import { DefaultController, RouterContextAppType } from "@controllers";
import { Helper, Validator } from "@utils";
import { ProductDataType } from "@components";
import { ObjectId } from "@deps";
import { ProductService, UserService } from "@services";
import { Mongo, ProductSchemaWithIDType } from "@mongo";

export class ReviewService {
  default;

  constructor(defaultController: DefaultController) {
    this.default = defaultController;
  }

  public postHandler = async (ctx: RouterContextAppType<"/review-form">) => {
    const formData = await ctx.request.body.formData();
    const { reviewForm } = await Helper.convertJsonToObject<ProductDataType>(
      `/server/data/product/product.json`,
    );

    const dataParsed = Validator.dataParser(
      formData,
      reviewForm,
    );

    if (!dataParsed.isOk) {
      return this.default.response(
        ctx,
        { message: dataParsed.message },
        401,
      );
    }

    const {
      id,
      review,
      rate,
      className,
    } = dataParsed.data as Record<string, string>;

    const { userId, userName } = await UserService.getUserInfo(ctx);

    const newReview = {
      userId,
      userName,
      rate: +rate,
      comment: review,
      timestamp: Date.now(),
    };

    const product = await ProductService.getProductFromDB<
      ProductSchemaWithIDType
    >(
      id,
    );

    if ("_id" in product) {
      const { reviewId } = product;
      const _reviewId = new ObjectId(reviewId);
      const isInsertionOk = await Mongo.addNewItemIntoDB(
        _reviewId,
        newReview,
        "reviews",
        "reviews",
      );

      isInsertionOk
        ? this.default.response(
          ctx,
          {
            message: "Votre avis a bien été ajouté.",
            className,
          },
          200,
        )
        : this.default.response(
          ctx,
          {
            message: "La base de données n'est pas accessible.",
            className,
          },
          503,
        );
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
}
