// deno-fmt-ignore-file
import { Helper } from "@utils";
import { Dialog, HeroBanner, LoadingVisitCards, ProductCard, ShareForm } from "../mod.ts";
import type {
	ComponentType,
	HomePageDataType,
	OrganismNameType,
} from "../mod.ts";
import { ProductSchemaWithIDType } from "@mongo";

export const SectionsHome: ComponentType<
	OrganismNameType,
	(products: Record<string, ProductSchemaWithIDType>) => Promise<string>
> = {
	name: "SectionsHome",
	html: async (products: Record<string, ProductSchemaWithIDType>) => {
		const { hero, appartment, visit } =
			await Helper.convertJsonToObject<HomePageDataType>(`/server/data/home/home.json`);

		return `
    <section>
      ${HeroBanner.html({
				title: hero.title,
				paragraph: hero.paragraph,
				imgSrc: hero.imgSrc,
				imgAlt: hero.imgAlt,
			})}
    </section>
    <section>
      <div class="container">
        <div>
          <h1>${appartment.title}</h1>
          <p>${appartment.paragraph}</p>
        </div>
        <ul class="products">
          ${Object.keys(products)
						.map((key) => ProductCard.html(products[key]))
						.join("")}
        </ul>
      </div>
    </section>
    <section id="visits">
      <div class="container">
        <h1>${visit.title}</h1>
        <ul class="visits-cards">
          ${LoadingVisitCards.html()}
        </ul>
      </div>
    </section>
    ${Dialog.html({ component: ShareForm.html })}`;
	},
};
