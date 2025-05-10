// deno-fmt-ignore-file
import { Helper, Handler } from "@utils";
import type {
  ComponentType,
  DialogDataType,
  OrganismNameType,
  ProductDataType,
} from "../mod.ts";
import { ProductFullDataType } from "@mongo";
import {
  BookingDetails,
  BookingForm,
  ProductDetails,
  Dialog,
  ReviewsDetails,
  FormReview,
  ProductFigure,
  LoginRegister,
} from "../mod.ts";

const {
  images,
  description,
  booking,
  reviewsAndRate,
  conditions,
  reviewForm,
} = await Helper.convertJsonToObject<ProductDataType>(
  "/server/data/product/product.json",
);

type ParameterType = {
  data: ProductFullDataType;
  isUserConnected: boolean;
};

export const SectionsProduct: ComponentType<
  OrganismNameType,
  (arg: ParameterType) => string
> = {
  name: "SectionsProduct",
  html: ({
    data : {
      product,
      reviews,
      actualOrFutureBookings,
    },
    isUserConnected,
  }: ParameterType) => {
    return `
    <section>
      <div class="container">
        <div>
          <h1>Aka ${product.name}</h1>
          <p>${product.description}</p>
        </div>
        <div class="product">
          ${ProductFigure.html({
            product,
            legend: images.legend,
            rate: Handler.rateAverage(reviews),
          })}
          <div>
            <div class="booking">
              ${BookingDetails.html({

                details: product.details,
                lastBooking: Handler.sortFromClosestToOlderBookings(
                  actualOrFutureBookings,
                )[0],
              })}
              ${BookingForm.html({
                form: booking,
                isUserConnected,
                date: Handler.setInputDateMinAttribute(
                  actualOrFutureBookings,
                ),
              })}
            </div>
            <div class="description">
              ${ProductDetails.html({
                product,
                descriptionInfo: description.infos,
                descriptionTitle: description.title,
              })}
            </div>
            <div id="reviews">
              ${ReviewsDetails.html({
                reviews,
                reviewsTitle: reviewsAndRate.title,
                reviewsEmpty: reviewsAndRate.empty + (
                  isUserConnected ? "." : ", en vous connectant."
                ),
              })}
            </div>
            <div class="review-form">
              ${FormReview.html({
                data: reviewForm,
                isUserConnected
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <div class="conditions">
          <h1>${conditions.title}</h1>
          <p>${conditions.content}</p>
        </div>
      </div>
    </section>
    ${Dialog.html({
      component: LoginRegister.html
    } as DialogDataType)}`;
  },
};
