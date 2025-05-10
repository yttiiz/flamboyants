import { Helper } from "@utils";
import { Dialog, InputsForm } from "../mod.ts";
import type { ComponentType, FormDataType, OrganismNameType } from "../mod.ts";

export const SectionAuthForm: ComponentType<
  OrganismNameType,
  (path: string) => Promise<string>
> = {
  name: "SectionAuthForm",
  html: async (path: string) => {
    const {
      title,
      action,
      method,
      content,
    } = await Helper.convertJsonToObject<FormDataType>(
      `/server/data/authentication${path}.json`,
    );

    return `
    <section>
      <div class="container">
        <h1>${title}</h1>
        <form
          action="${action}"
          method="${method}"
          type="multipart/form-data"
          data-style="user-${action.replace("/", "")}"
        >
          <h3>
          Renseignez vos ${
      path === "/register" ? "informations" : "identifiants"
    }
          </h3>
          <div>
            ${InputsForm.html({ content })}
          </div>
          <span class="none"></span>
        </form>
      </div>
    </section>
    ${path === "/register" ? Dialog.html({}) : ""}`;
  },
};
