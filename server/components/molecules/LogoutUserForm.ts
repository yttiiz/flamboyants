// deno-fmt-ignore-file
import { OnOffSvg, UserSvg } from "../mod.ts";
import type { ComponentType, MoleculeNameType } from "../mod.ts";

type ParameterType = {
  userPhoto: string;
  userFullname: string;
};

export const LogoutUserForm: ComponentType<
  MoleculeNameType,
  (arg: ParameterType) => string
> = {
  name: "LogoutUserForm",
  html: ({
    userPhoto,
    userFullname,
  }: ParameterType) => {
    const greeting = (now = new Date().getHours()) => {
      return (now > 18 || now < 6)
       ? "Bonsoir"
       : "Bonjour";
    };

    return `
    <div>
      <form action="/logout" method="post">
        <button type="submit" title="déconnexion">
          ${OnOffSvg.html}
        </button>
      </form>
      <span data-profil-link>
        ${greeting()} <a href=\"/profil\">{{ user-firstname }}</a>
      </span>
      <span data-profil-link>
        <a href=\"/profil\">
        ${userPhoto.includes("default")
          ? UserSvg.html
          : `<img src="${userPhoto}" alt="${userFullname}" />`
        }
        </a>
      </span>
    </div>`
  },
};
