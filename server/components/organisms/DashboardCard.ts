// deno-fmt-ignore-file
import type {
  ComponentType,
  DashboardDetailsType,
  OrganismNameType,
} from "../mod.ts";

export const DashboardCard: ComponentType<
  OrganismNameType,
  (arg: DashboardDetailsType) => string
> = {
  name: "DashboardCard",
  html: ({
    title,
    className,
    isAccordeon,
  }: DashboardDetailsType,
  ) => {
    return `
      <div data-loading="true">
        <h3${isAccordeon ? ` class="accordeon-title"` : ""}>
          ${title}
          <figure>
            <img src="../img/icons/loading-sm.svg" alt="loading" />
          </figure>
        </h3>
        <div class="${className}${isAccordeon ? " accordeon-container" : ""}"></div>
        ${isAccordeon
          ?
          (
          `<button type="button" data-open="false">
            <span></span>
          </button>
          `
          )
          : ""
        }
      </div>`
  },
};