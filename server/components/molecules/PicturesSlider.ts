// deno-fmt-ignore-file
import type {
  ComponentType,
  MoleculeNameType,
} from "../mod.ts";
import { ImagesProductType } from "@mongo";

type ParameterType = {
  id: string;
  pictures: ImagesProductType[];
}
export const PicturesSlider: ComponentType<
  MoleculeNameType,
  (arg: ParameterType) => string
> = {
  name: "PicturesSlider",
  html: ({
    id,
    pictures,
  }: ParameterType) => (
    `
    <div data-slider-length="${pictures.length}">
      <a
        href="/product/${id}"
        class="slider-product"
        style="width: ${100 * pictures.length}%;"
      >
      ${pictures
        .map((picture) => (
          `<figure>
            <img
              src="${picture.src}"
              alt="${picture.alt}"
            />
          </figure>`
        ))
        .join("")
      }
      </a>
      <button type="button" class="hidden">
        <span></span>
      </button>
      <button type="button">
        <span></span>
      </button>
      <ul class="slider-product-nav-landmarks"></ul>
    </div>
    `
  )
  ,
};
