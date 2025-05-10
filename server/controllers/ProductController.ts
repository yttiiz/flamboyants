import { dynamicRoutes } from "@dynamic-routes";
import { DefaultController } from "./DefaultController.ts";
import { RouterAppType } from "./mod.ts";
import { BookingService, ProductService, ReviewService } from "@services";

export class ProductController extends DefaultController {
  private productService;
  private bookingService;
  private reviewService;

  constructor(router: RouterAppType) {
    super(router);
    this.productService = new ProductService(this);
    this.bookingService = new BookingService(this);
    this.reviewService = new ReviewService(this);
    this.getProduct();
    this.postBooking();
    this.postReview();
  }

  private getProduct() {
    const productRoute = `/${dynamicRoutes.get("product")}:id`; // "/product/:id"

    this.router?.get(
      productRoute,
      this.productService.getProduct,
    );
  }

  private postBooking() {
    this.router?.post("/booking", this.bookingService.postHandler);
  }

  private postReview() {
    this.router?.post("/review-form", this.reviewService.postHandler);
  }
}
