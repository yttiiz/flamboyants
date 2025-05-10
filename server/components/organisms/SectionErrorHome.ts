// deno-fmt-ignore-file
import type {
  ComponentType,
  OrganismNameType,
} from "../mod.ts";

export const SectionErrorHome: ComponentType<
  OrganismNameType,
  (errorMsg: string) => string
> = {
  name: "SectionErrorHome",
  html: (errorMsg: string) => {

    return `
    <section>
      <div class="container">
        <div>
          <h1>Erreur serveur</h1>
          <p>${errorMsg}</p>
        </div>
      </div>
    </section>`;
  },
};
