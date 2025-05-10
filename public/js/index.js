import { AnimationHelper, Router } from "./pages/mod.js";

// Router
new Router();

// Animation
const animationHelper = new AnimationHelper();

// Home page
if (location.href === location.origin + "/") {
  animationHelper.handleHomeSlider(".slider-product");
}

// Product page
if (location.href.includes("product")) {
  animationHelper.handleProductSlider(".product > figure");
}
