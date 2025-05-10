// deno-fmt-ignore-file
import type {
  ComponentType,
  MoleculeNameType,
  DialogDataType,
} from "../mod.ts";

export const Dialog: ComponentType<
  MoleculeNameType,
  (arg: DialogDataType) => string
> = {
  name: "Dialog",
  html: ({
      dataset,
      component,
    }: DialogDataType) => {
    return `
    <dialog${dataset ? ` data-${dataset}` : ""}>
      <header>
        <h2></h2>
        <button data-close>
          <span></span>
          <span></span>
        </button>
      </header>
      <div>
        <p></p>
        ${component ? component : ""}
      </div>
    </dialog>
    `
  },
};
