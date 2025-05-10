// deno-fmt-ignore-file
import {
  type ComponentType,
  type MoleculeNameType,
} from "../mod.ts";

type ParameterType = {
  title: string;
  paragraph: string;
  imgSrc: string;
  imgAlt: string;
};

export const HeroBanner: ComponentType<
  MoleculeNameType,
  (arg: ParameterType) => string
> = {
  name: "HeroBanner",
  html: ({
    title,
    paragraph,
    imgSrc,
    imgAlt,
  }: ParameterType) => (
    `<figure class="hero-banner">
      <img src="${imgSrc}" alt="${imgAlt}" />
      <figcaption>
        <h1>${title}</h1>
        <p>${paragraph}</p>
      </figcaption>
      <div></div>
    </figure>`
  ),
};
