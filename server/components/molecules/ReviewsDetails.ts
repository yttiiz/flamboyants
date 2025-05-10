// deno-fmt-ignore-file
import { Helper } from "@utils";
import {
  RateStars,
  type ComponentType,
  type MoleculeNameType,
} from "../mod.ts";
import { RateProductEnum, ReviewsProductSchemaWithIDType } from "@mongo";

type ParameterType = {
  reviews: ReviewsProductSchemaWithIDType;
  reviewsTitle: string;
  reviewsEmpty: string;
};

export const ReviewsDetails: ComponentType<
  MoleculeNameType,
  (arg: ParameterType) => string
> = {
  name: "ReviewsDetails",
  html: ({
    reviews,
    reviewsTitle,
    reviewsEmpty,
  }: ParameterType) => (
    `
    <h3>${reviewsTitle}</h3>
    ${reviews.reviews.length > 0
      ?
      (
        `
        <dl>
        ${reviews.reviews
          .map(({
            userName,
            comment,
            timestamp,
            rate,
          }) => (
            `<dt>
              ${userName}
            </dt>
            <dd>
              <p>${comment}</p>
              <p>écrit le ${Helper.displayDate({ date: timestamp })}</p>
              <div>
                <span>
                  a noté : <strong>${rate}/${RateProductEnum.excellent}</strong>
                </span>
                ${RateStars.html(rate)}
              </div>
            </dd>
            `
          ))
          .join("")
        }
        </dl>`
      )
      :
      (
        `<p>${reviewsEmpty}</p>`
      )
    }
    `
  ),
};
