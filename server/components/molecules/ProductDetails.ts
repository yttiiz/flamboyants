// deno-fmt-ignore-file
import type {
  ComponentType,
  MoleculeNameType,
  ProductDescriptionType
} from "../mod.ts";
import { ProductSchemaWithIDType } from "@mongo";

type ParameterType = {
  product: ProductSchemaWithIDType;
  descriptionInfo: ProductDescriptionType;
  descriptionTitle: string;
};

export const ProductDetails: ComponentType<
  MoleculeNameType,
  (arg: ParameterType) => string
> = {
  name: "ProductDetails",
  html: ({
    product,
    descriptionInfo,
    descriptionTitle
  }: ParameterType) => (
    `
    <h3>${descriptionTitle}</h3>
    <ul>
    ${Object.keys(descriptionInfo)
      .map(key => (
        `<li>
          <b>${descriptionInfo[key as keyof typeof descriptionInfo]} :</b> 
          ${key === "area"
            ? `${product.details[key as keyof typeof product.details]}m²`
            : product.details[key as keyof typeof product.details]
          }
        </li>`
      ))
      .join("")
    }
    </ul>
    `
  ),
};
