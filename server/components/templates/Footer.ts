// deno-fmt-ignore-file
import { Helper } from "@utils";
import {
Logo,
  type ComponentType,
  type FooterDataType,
  type TemplateNameType
} from "../mod.ts";
import { SessionAndDataType } from "@controllers";

const {
  details,
  company,
  legalsInformations,
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
              <div class="footer-details">
                ${Logo.html}
               <h2>${details.companyName}</h2> 
                <div>
                  <span>${details.address.line}</span>
                  <span>${details.address.zip} ${details.address.city}</span>
                  <span>${details.address.country}</span>
                </div>
                <a href="tel:${details.phone}">${details.phone}</a>
              </div>
              <div>
                <h3>${company.title}</h3>
                <ul class="footer-items-list">
                ${
                  company.items
                    .map((item) => (
                      `<li>
                        <a href="${item.link}" class="${item.className}">${item.text}</a>
                      </li>`)
                    ).join("")
                }
                </ul>
              </div>
              <div>
                <h3>${legalsInformations.title}</h3>
                <ul class="footer-items-list">
                ${
                  legalsInformations.items
                    .map((item) => (
                      `<li>
                        <a href="${item.link}" class="${item.className}">${item.text}</a>
                      </li>`)
                    ).join("")
                }
                </ul>
              </div>
            </div>
            `
          )
        }
        <div class="copyrights">
          <span>${copyrights} ${new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>`
  },
};
