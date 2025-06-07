import { AtomNameType, ComponentType } from "../mod.ts";

export const ShareForm: ComponentType<AtomNameType> = {
  name: "ShareForm",
  html: `
    <div>
      <input type="text" value="" />
      <button type="button">Copier</button>
    </div>`,
};
