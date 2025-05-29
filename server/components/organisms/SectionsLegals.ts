// deno-fmt-ignore-file
import { Helper } from "@utils";

import type {
  ComponentType,
  OrganismNameType,
  LegalsDataType,
 } from "../mod.ts";
 
 export const SectionsLegals: ComponentType<
 OrganismNameType,
 (data: "legal" | "privacy") => Promise<string>
 > = {
   name: "SectionsLegals",
   html: async (data) => {
     
    const {
      title,
      paragraphs,
    } = await Helper.convertJsonToObject<LegalsDataType>(
      `/server/data/legals/${data}.json`,
    );

    return `
    <section>
      <div class="container">
        <h1>${title}</h1>
        <div>
          ${paragraphs.map(({ subtitle, textContent, isHtml}) => (
            isHtml
              ? `${subtitle ? `<h2>${subtitle}</h2>` : ""}${textContent}`
              : `<p${subtitle ? "" : ` class="legal-details"`}>${subtitle ? `<strong>${subtitle}</strong> ` : ""}${textContent}</p>`
          )).join("")}
        </div>
      </div>
    </section>
    `;
  }
}