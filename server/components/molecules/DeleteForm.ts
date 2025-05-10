import type { ComponentType, MoleculeNameType } from "../mod.ts";

export const DeleteForm: ComponentType<
  MoleculeNameType
> = {
  name: "DeleteForm",
  html: `
    <form
      action=""
      method="DELETE"
      data-type="delete-item"
      type="multipart/form-data"
    >
      <button
        type="button"
        data-close
      >
        Annuler
      </button>
      <input
        class="none"
        type="text"
        name="id"
      />
      <input
        type="submit"
        value="Supprimer"
      />
    </form>
    <span class="show-message-to-user none">
    </span>`,
};
