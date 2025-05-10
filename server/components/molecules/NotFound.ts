import { Helper } from "@utils";
import type {
  ComponentType,
  MoleculeNameType,
  NotFoundDataType,
} from "../mod.ts";

const {
  title,
  paragraph,
  btnLink,
  btnText,
} = await Helper.convertJsonToObject<NotFoundDataType>(
  "/server/data/404/not.found.json",
);

export const NotFound: ComponentType<MoleculeNameType> = {
  name: "NotFound",
  html: `
  <section>
    <div class="container">
      <div>
        <h1>${title}</h1>
        <p>${paragraph}</p>
      </div>
      <div>
        <a href="${btnLink}">${btnText}</a>
      </div>
    </div>
  </section>`,
};
