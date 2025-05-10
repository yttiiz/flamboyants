// deno-fmt-ignore-file
import { Helper } from "@utils";
import {
  InputsForm,
  DeleteAccount,
  DeleteAccountForm,
  Dialog,
  DangerSvg,
} from "../mod.ts";
import type {
  ComponentType,
  OrganismNameType,
  FormDataType,
  DeleteAccountDataType,
  DialogDataType,
 } from "../mod.ts";

 const {
  title,
  action,
  method,
  changePhoto,
  content,
} = await Helper.convertJsonToObject<FormDataType>(
  "/server/data/profil/profil.json",
);

const {
  deleteModal,
} = await Helper.convertJsonToObject<DeleteAccountDataType>(
  "/server/data/profil/delete.profil.json",
);

export const SectionsProfilForm: ComponentType<
  OrganismNameType,
  () => string
> = {
  name: "SectionsProfilForm",
  html: () => {
    return `
    <section>
      <div class="container">
        <h1>${title}</h1>
        <h3 class="loading-text">Chargement de vos données...</h3>
        <p class="error-msg none">${DangerSvg.html}</p>
        <form
          action="${action}"
          method="${method}"
          type="multipart/form-data"
          data-style="user-profil"
        >
          <div>
            <div class="user-photo">
              <figure>
                <img src="" alt="&nbsp;" class="loading-image" />
              </figure>
              <button type="button">${changePhoto ?? "change picture"}</button>
              <div class="none"></div>
            </div>
            <div class="user-infos">
              ${InputsForm.html({ content, isProfilInputs: true })}
            </div>
          </div>
          <input
            type="${content.at(-1)!.type}"
            value="${content.at(-1)!.value}"
          />
        </form>
      </div>
    </section>
    <section>
      ${DeleteAccount.html}
    </section>
    ${Dialog.html({
      component: DeleteAccountForm.html({
        action: deleteModal.action,
        method: deleteModal.method,
        btnText: deleteModal.btnText,
      })
    } as DialogDataType)}
    `;
  }
}