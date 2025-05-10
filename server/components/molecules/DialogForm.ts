// deno-fmt-ignore-file
import {
  type ComponentType,
  type MoleculeNameType,
  type FormDataType,
  InputsForm,
} from "../mod.ts";

export const DialogForm: ComponentType<
  MoleculeNameType,
  (arg: FormDataType) => string
> = {
  name: "DialogForm",
  html: ({
    action,
    method,
    content,
  }: FormDataType,
  ) => {
    return `
    <form
      action="${action}"
      method="${method}"
      type="multipart/form-data"
      data-style="${action.replace("/", "")}"
    >
      ${InputsForm.html({ content })}
    </form>
    `
  },
};
