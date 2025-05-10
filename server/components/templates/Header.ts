// deno-fmt-ignore-file
import { Helper } from "@utils";
import { 
  HeaderNavigation,
  HeaderAdminSession,
  HeaderUserSession,
  Logo
} from "../mod.ts"
import type { 
  ComponentType,
  HeaderDataType,
  ItemDataType,
  TemplateNameType,
} from "../mod.ts";
import { SessionAndDataType } from "@controllers";

const {
  logo: { link, text },
  items,
} = await Helper.convertJsonToObject<HeaderDataType>("/server/data/basics/header.json");

export const Header: ComponentType<
  TemplateNameType,
  (arg: SessionAndDataType & {
    data: ItemDataType[];
  }) => string
> = {
  name: "Header",
  html: ({
    session,
    isConnexionFailed,
    isAdminInterface,
    data,
  }: SessionAndDataType & {
    data: ItemDataType[];
  }
  ) => {
    return `
    <header data-header="site">
      <div class="container">
        <div>
          ${isConnexionFailed || isAdminInterface
            ? ""
            :
            (
              `
              <div id="burger">
                <button type="button">
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
                ${HeaderNavigation.html({
                  isUserConnected: session.has("userFirstname"),
                  isAdmin: (session.get("isAdmin") as unknown as boolean) === true,
                  items,
                  data,
                })}
              </div>
              `
            )
          }
          <div id="logo">
            <a href="${link}">
              ${Logo.html}
              <span>${text}</span>
            </a>
          </div>
        </div>
        ${isConnexionFailed
          ? ""
          :
          (
            `
            <div>
              ${isAdminInterface
                ? HeaderAdminSession.html(session)
                : HeaderUserSession.html(session)
              }
            </div>
            `
          )
        }
      </div>
    </header>`
  },
};
