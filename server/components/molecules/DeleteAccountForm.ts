import type { ButtonType, ComponentType, MoleculeNameType } from "../mod.ts";
import { FormAttributesType } from "@/server/components/types.ts";

export const DeleteAccountForm: ComponentType<
  MoleculeNameType,
  (arg: FormAttributesType & Pick<ButtonType, "btnText">) => string
> = {
  name: "DeleteAccountForm",
  html: ({
    action,
    method,
    btnText,
  }: FormAttributesType & Pick<ButtonType, "btnText">) => {
    return `
      <form
        action="${action}"
        method="${method}"
        data-type="delete-account"
        data-style="delete-user"
        type="multipart/form-data"
      >
        <button type="button" data-close>
          Annuler
        </button>
        <input
          type="submit"
          name="delete-account"
          value="${btnText}"
        />
      </form>
      <span class="show-message-to-user none">
        <a href="/">Retour à l'accueil</a>
      </span>`;
  },
};
