// deno-fmt-ignore-file
import {
  ComponentType,
  MoleculeNameType,
  StarSvg,
} from "../mod.ts";
import { ProductSchemaWithIDType } from "@mongo";

type ParameterType = {
  product: ProductSchemaWithIDType;
  legend: string;
  rate: string;
};

export const ProductFigure: ComponentType<
  MoleculeNameType,
  (arg: ParameterType) => string
> = {
  name: "ProductFigure",
  html: ({
    product,
    legend,
    rate
  }: ParameterType) => (
    `
    <figure>
      <figure
        style="width: ${product.pictures.length * 100}%;"
        class="figure-img-container"
      >
      ${product.pictures
        .map(picture => (
          `<img
            src="${picture.src}"
            alt="${picture.alt}"
          />`
        )
      ).join("")}
      </figure>
      <figcaption>
        <span>${legend}</span>
        <span>
          ${StarSvg.html}
          <strong>${rate}</strong>
        </span>
      </figcaption>
      <div class="figcaption-shadow">
      </div>
    </figure>
    `
  ),
};
