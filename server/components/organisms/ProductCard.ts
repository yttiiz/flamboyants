// deno-fmt-ignore-file
import { Helper, Handler } from "@utils";
import { StarSvg, PicturesSlider, ShareSvg } from "../mod.ts";
import type {
  ComponentType,
  OrganismNameType,
} from "../mod.ts";
import {
  ProductSchemaWithIDType,
  ReviewsProductSchemaWithIDType
} from "@mongo";

type ParameterType = (
  ProductSchemaWithIDType &
  { reviews?: ReviewsProductSchemaWithIDType }
);

export const ProductCard: ComponentType<
  OrganismNameType,
  (product: ParameterType) => string
> = {
  name: "ProductCard",
  html: (product: ParameterType) => {
    return `
      <li>
        <div>
          <header>
            <div>
              <figure>
                <img
                  src="${product.thumbnail.src}"
                  alt="${product.thumbnail.alt}"
                />
              </figure>
            </div>
            <div>
              <div>
                <h3>Aka ${product.name}</h3>
                <h4>${product.details.type}</h4>
              </div>
              <span>
                <strong>${Helper.formatPrice(product.details.price)}</strong>/nuit
              </span>
            </div>
          </header>
          ${
            PicturesSlider.html({
              id: product._id.toString(),
              pictures: product.pictures,
            })
          }
          <div>
            <p>${product.description}</p>
            <div>
              <div class="social-btns">
                <a
                  href="/product/${product._id.toString()}#reviews"
                  data-link="${product.reviews ? Handler.rateAverage(product.reviews) : "0.0"}"
                  title="notez-le !"
                >
                  ${StarSvg.html}
                </a>
                <button
                  type="button"
                  title="partagez-le !"
                >
                  ${ShareSvg.html}
                </button>
              </div>
              <a
                class="show-product"
                href="/product/${product._id.toString()}"
              >
                Découvrir
              </a>
            </div>
          </div>
        </div>
      </li>`;
  },
};
