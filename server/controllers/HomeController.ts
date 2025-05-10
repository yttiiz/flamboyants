import { ProductService } from "@services";
import { DefaultController } from "./DefaultController.ts";
import type { RouterAppType } from "./mod.ts";

export class HomeController extends DefaultController {
  private productService;

  constructor(router: RouterAppType) {
    super(router);
    this.productService = new ProductService(this);
    this.index();
  }

  private index() {
    this.router?.get("/", this.productService.getProducts);
  }
}
