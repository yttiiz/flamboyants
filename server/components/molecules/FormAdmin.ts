// deno-fmt-ignore-file
import {
  type ComponentType,
  type MoleculeNameType,
  type FormDataType,
  InputsForm,
} from "../mod.ts";

export const FormAdmin: ComponentType<
  MoleculeNameType,
  (arg: FormDataType) => string
> = {
  name: "FormAdmin",
  html: ({
    title,
    action,
    method,
    content,
  }: FormDataType,
  ) => {
    return `
    <div>
      <h1>${title}</h1>
    </div>
    <div>
      <form
        action="${action}"
        method="${method}"
        type="multipart/form-data"
        data-style="user-${action.replace("/", "")}"
      >
        <h3>Renseignez vos identifiants</h3>
        <div>
          ${InputsForm.html({ content })}
        </div>
        <span class="none"></span>
      </form>
    </div>
    `
  },
};
