// deno-fmt-ignore-file
import { Helper } from "@utils";

import type {
  ComponentType,
  OrganismNameType,
  LegalsDataType,
 } from "../mod.ts";

 const {
  title,
  paragraphs,
} = await Helper.convertJsonToObject<LegalsDataType>(
  "/server/data/legals/legal.json",
);

export const SectionsLegals: ComponentType<
  OrganismNameType,
  () => string
> = {
  name: "SectionsLegals",
  html: () => {
    return `
    <section>
      <div class="container">
        <h1>${title}</h1>
        <div>
          ${paragraphs.map(({ subtitle, textContent, isHtml}) => (
            isHtml
              ? `<h2>${subtitle}</h2>${textContent}`
              : `<p${subtitle ? "" : ` class="legal-details"`}>${subtitle ? `<strong>${subtitle}</strong> ` : ""}${textContent}</p>`
          )).join("")}
        </div>
      </div>
    </section>
    `;
  }
}