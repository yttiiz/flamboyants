// deno-fmt-ignore-file
import { EyeOpenSvg, EyeShutSvg } from "../mod.ts";
import { Validator } from "@utils";
import type {
  ComponentType,
  InputFormPropsType,
  MoleculeNameType
} from "../mod.ts";

export const InputsForm: ComponentType<
  MoleculeNameType, 
  (arg: InputFormPropsType) => string
> = {
  name: "InputsForm",
  html: ({
    content,
    isProfilInputs = false,
    date,
  }: InputFormPropsType,
  ) => {
    return content
    .map(({ 
      type,
      label,
      name,
      placeholder,
      required,
      disabled,
      minLength,
      maxLength,
      value,
      autocomplete,
      items,
    }) => { 
      if (type !== "submit" && type !== "radio" && name !== "photo") {
        return `
          <label>
            <span>${label}</span>
            ${type === "select"
            ? (
              // SELECT FIELD
              `<select
                ${name ? ` name="${name}"` : ""}
                ${required ? ` required` : ""}
                ${disabled ? ` disabled` : ""}
              >
                <option value=\"\">Choisir...</option>
                ${items ? (items.map(item => (
                  `<option value="${item}">${item}</option>`
                  )).join("")
                ) : "<option value=\"\">choisir...</option>"}
              </select>`
              )
            // TEXT FIELDS
            : (
              type === "textarea"
                ?
                (
                  `<textarea
                    ${name ? ` name="${name}"` : ""}
                    ${placeholder ? ` placeholder="${placeholder}"` : ""}
                    ${required ? ` required` : ""}
                    ${disabled ? ` disabled` : ""}
                    ${minLength ? ` minLength="${minLength}"` : ""}
                    ${maxLength ? ` maxLength="${maxLength}"` : ""}
                    ${value ? ` value="${value}"` : ""}
                  ></textarea>`
                )
                : 
                (
                  `${type === "password" || (name && name.includes("file"))
                    ? "<span>"
                    : ""}
                      <input type="${type}"
                      ${name ? ` name="${name}"` : ""}
                      ${placeholder ? ` placeholder="${placeholder}"` : ""}
                      ${required ? ` required` : ""}
                      ${disabled ? ` disabled` : ""}
                      ${minLength ? ` minLength="${minLength}"` : ""}
                      ${maxLength ? ` maxLength="${maxLength}"` : ""}
                      ${value ? ` value="${value}"` : ""}
                      ${autocomplete ? ` autocomplete="${autocomplete}"` : ""}
                      ${type === "date"
                        ? Validator.minAndMaxDateParser(label as string, date)
                        : ""}
                      >
                      ${type === "password"
                        ? (
                          `<div id="eye-password">
                              <span>
                                ${EyeShutSvg.html}
                              </span>
                              <span class="none">
                                ${EyeOpenSvg.html}
                              </span>
                            </div>`
                          )
                        : ""}
                      ${name && name.includes("file") 
                        ? (
                            `<div class="search-photo">
                              <button type="button">Rechercher</button>
                            </div>`
                          )
                        : ""
                      }
                    ${type === "password" || (name && name.includes("file"))
                    ? "</span>"
                    : ""}`
                )
            )}
          </label>`;

      } else if (type === "radio") {
        return `
          <fieldset${items && items.length <= 3 ? "" : ` class="align-columns"`}>
            <legend>${label}</legend>
            ${items ? (items.map(item => {
              return typeof item !== "string"
              ? 
                `<div>
                  <input type ="${type}"
                    ${item.name ? ` name="${item.name}"` : ""}
                    ${item.required ? ` required` : ""}
                    ${item.value ? ` value="${item.value}"` : ""}
                  />
                  ${item.value}
                </div>`
              : null;
            }).join("")
            ) : null}
        </fieldset>`

      } else if (isProfilInputs || name === "photo") {
        return "";
        
      } else {
        return `
        <input type="${type}"
          ${value ? ` value="${value}"` : ""}
        >`;
      }
  }).join("")
  }
}