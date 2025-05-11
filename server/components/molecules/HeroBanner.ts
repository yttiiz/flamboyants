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
  link: string;
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
    link,
  }: ParameterType) => (
    `<div class="hero-banner">
      <div>
        <div>
          <h1>${title}</h1>
          <p>${paragraph}</p>
          <a href="#products">${link}</a> 
        </div>
        <figure>
          <img src="${imgSrc}" alt="${imgAlt}" />
        </figure>
      </div>
    </div>`
  ),
};
