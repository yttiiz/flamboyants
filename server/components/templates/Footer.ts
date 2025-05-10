// deno-fmt-ignore-file
import { Helper } from "@utils";
import type {
  ComponentType,
  FooterDataType,
  TemplateNameType
} from "../mod.ts";
import { SessionAndDataType } from "@controllers";

const {
  basicItems,
  relatedItems,
  copyrights,
} = await Helper.convertJsonToObject<FooterDataType>(
  "/server/data/basics/footer.json",
);

export const Footer: ComponentType<
  TemplateNameType,
  (arg: SessionAndDataType) => string
  > = {
  name: "Footer",
  html: ({
    isConnexionFailed,
    isAdminInterface,
  }: SessionAndDataType
  ) => {
  return `<footer>
      <div class="container">
        ${isConnexionFailed || isAdminInterface
          ? ""
          :
          (
            `
            <div>
              <ul>
              ${
                basicItems
                  .map((item) => (
                    `<li>
                      <a href="${item.link}" class="${item.className}">${item.text}</a>
                    </li>`)
                  ).join("")
              }
              </ul>
              <ul>
              ${
                relatedItems
                  .map((item) => (
                    `<li>
                      <a href="${item.link}" class="${item.className}">${item.text}</a>
                    </li>`)
                  ).join("")
              }
              </ul>
            </div>
            `
          )
        }
        <div>
          <span>${copyrights} ${new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>`
  },
};
