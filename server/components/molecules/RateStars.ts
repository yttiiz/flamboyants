// deno-fmt-ignore-file
import {
  StarSvg,
  type ComponentType,
  type MoleculeNameType,
} from "../mod.ts";
import { RateProductEnum } from "@mongo";

const displayStars = (rate: number) => {
  let stars = ""
  
  for (let i = 0; i < RateProductEnum.excellent; i++) {
    stars +=
      `<li${i + 1 <= rate ? " class=\"ranking\"": ""}>
        ${StarSvg.html}
      </li>`;
  }

  return stars;
};

export const RateStars: ComponentType<
  MoleculeNameType,
  (rate: number) => string
> = {
  name: "RateStars",
  html: (rate: number) => {
    return `
    <ul title="${rate}/${RateProductEnum.excellent}">
      ${displayStars(rate)}
    </ul>`;
  }
}