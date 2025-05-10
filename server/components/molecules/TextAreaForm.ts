// deno-fmt-ignore-file
import type {
  ComponentType,
  InputDataType,
  MoleculeNameType
} from "../mod.ts";

export const TextAreaForm: ComponentType<
  MoleculeNameType, 
  (arg: InputDataType) => string
> = {
  name: "TextAreaForm",
  html: ({ 
      type,
      label,
      name,
      placeholder,
      required,
      minLength,
      maxLength,
    }: InputDataType,
  )  => (
      `<label>
        <span>${label}</span>
        <textarea type="${type}"
          ${name ? ` name="${name}"` : ""}
          ${placeholder ? ` placeholder="${placeholder}"` : ""}
          ${required ? ` required` : ""}
          ${minLength ? ` minLength="${minLength}"` : ""}
          ${maxLength ? ` maxLength="${maxLength}"` : ""}
        ></textarea>
      </label>`
    )
}