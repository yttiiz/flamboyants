import type { ComponentType, TemplateNameType } from "../mod.ts";

export const Main: ComponentType<TemplateNameType> = {
  name: "Main",
  html: `<main>
    <div id={{ id }}>
      {{ content-insertion }}
    </div>
    </main>`,
};
