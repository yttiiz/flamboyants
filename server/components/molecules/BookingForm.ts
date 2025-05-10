// deno-fmt-ignore-file
import type {
  ComponentType,
  MoleculeNameType,
} from "../mod.ts";
import { FormDataType, InputsForm } from "../mod.ts";

type ParameterType = {
  form: FormDataType,
  isUserConnected: boolean;
  date?: string;
};

export const BookingForm: ComponentType<
  MoleculeNameType,
  (arg: ParameterType) => string
> = {
  name: "BookingForm",
  html: ({
    form,
    isUserConnected,
    date,
  }: ParameterType) => (
    `
    <div>
      <h3>${form.title}</h3>
      <form
        action="${form.action}"
        method="${form.method}"
        data-style="booking"
        data-user-connected="${isUserConnected}"
      >
        ${InputsForm.html({ content: form.content, date })}
      </form>
    </div>
    `
  ),
};
