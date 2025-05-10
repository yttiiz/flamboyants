import { handleShowPassword } from "./_commonFunctions.js";

export class AnimationHelper {
  #handleShowPassword;

  constructor() {
    this.#handleShowPassword = handleShowPassword;
    this.#handleBurger();
    this.#handleShowPassword();

    if (document.querySelector("button[data-modal]")) {
      this.#handleModalOnMobileDevice();
    }
  }

  handleProductSlider(sliderClassName) {
    if (document.querySelector(sliderClassName)) {
      const sliderContainer = document.querySelector(sliderClassName);
      const slider = sliderContainer.querySelector("figure");
      const sliderLength = slider.children.length;
      let index = 0;

      /**
       * @param {Event} e
       */
      const handleMotion = (e) => {
        const container = e.currentTarget;
        const width = container.clientWidth;
        const { x } = container.getBoundingClientRect();

        const isRightClick = (e.clientX - x) >= (width / 2);

        if (isRightClick) {
          if (index >= (sliderLength - 1)) return;

          index++;
          this.#moveSlider(slider, sliderLength, index);
        } else {
          if (index <= 0) return;

          index--;
          this.#moveSlider(slider, sliderLength, index);
        }
      };

      sliderContainer.addEventListener("click", handleMotion);
    }
  }

  /**
   * Animates slider motion.
   * @param {string} sliderClassName
   */
  handleHomeSlider(sliderClassName) {
    const sliders = document.querySelectorAll(sliderClassName);

    /**
     * @param {{
     *  prevBtn: HTMLButtonElement;
     *  nextBtn: HTMLButtonElement;
     *  sliderLength: number;
     *  index: number;
     * }}
     */
    const changeBtnsVisibility = ({
      prevBtn,
      nextBtn,
      sliderLength,
      index,
    }) => {
      const className = "hidden";

      switch (index) {
        case 0:
          prevBtn.classList.add(className);

          if (nextBtn.classList.contains(className)) {
            nextBtn.classList.remove(className);
          }
          break;

        case sliderLength - 1:
          nextBtn.classList.add(className);

          if (prevBtn.classList.contains(className)) {
            prevBtn.classList.remove(className);
          }
          break;

        default:
          if (prevBtn.classList.contains(className)) {
            prevBtn.classList.remove(className);
          }

          if (nextBtn.classList.contains(className)) {
            nextBtn.classList.remove(className);
          }
      }
    };

    /**
     * @param {HTMLUListElement} landmarks
     * @param {number} index
     * @param {number} key
     */
    const switchActiveLandmark = (
      landmarks,
      index,
      key = 0,
    ) => {
      for (const landmark of landmarks.children) {
        if (index === key) {
          landmark.classList.add("active");
        }

        if (index !== key && landmark.classList.contains("active")) {
          landmark.classList.remove("active");
        }
        key++;
      }
    };

    for (const slider of sliders) {
      const sliderLength = slider.children.length;
      const [prevBtn, nextBtn] = slider.closest("div")
        .querySelectorAll("button");
      const landmarks = slider.closest("div").querySelector("ul");

      let index = 0;

      // Check slider length to display or not buttons and landmarks.
      if (sliderLength === 1) {
        nextBtn.classList.add("hidden");
      } else {
        for (let i = 0; i < sliderLength; i++) {
          landmarks.appendChild(document.createElement("span"));

          i === 0 ? landmarks.children[i].classList.add("active") : null;
        }

        prevBtn.addEventListener("click", () => {
          if (index <= 0) return;

          index--;
          this.#moveSlider(slider, sliderLength, index);
          changeBtnsVisibility({ prevBtn, nextBtn, sliderLength, index });
          switchActiveLandmark(landmarks, index);
        });

        nextBtn.addEventListener("click", () => {
          if (index >= (sliderLength - 1)) return;

          index++;
          this.#moveSlider(slider, sliderLength, index);
          changeBtnsVisibility({ prevBtn, nextBtn, sliderLength, index });
          switchActiveLandmark(landmarks, index);
        });
      }
    }

    return this;
  }

  /**
   * Toogle menu on click on burger button.
   */
  #handleBurger = () => {
    /**
     * @param {NodeListOf<HTMLSpanElement>} lines
     * @param {HTMLDivElement} nav
     * @param {number} i
     */
    const toggleElementClasslist = (lines, nav, i = 0) => {
      for (const line of lines) {
        line.classList.toggle(`line-${i + 1}`);
        i++;
      }

      nav.classList.toggle("none");
    };

    /**
     * @param {Event} e
     */
    const submenuHandler = (e) => {
      e.currentTarget.querySelector("div").classList.toggle("up");
      e.currentTarget.nextElementSibling.classList.toggle("none");
    };

    /**
     * @param {Event} e
     */
    const burgerHandler = (e) => {
      const lines = e.currentTarget.querySelectorAll("button > span");
      const nav = e.currentTarget.querySelector("nav");

      const isNavVisible = !nav.classList.contains("none");
      const isNotASpan = e.target.nodeName !== "SPAN";
      const isNotTheBurger = !e.target.id === "burger" ||
        !(e.target.type === "button");

      if (isNavVisible && isNotTheBurger && isNotASpan) return;
      toggleElementClasslist(lines, nav);
    };

    /**
     * @param {Event} e
     */
    const windowHandler = (e) => {
      const lines = document.querySelectorAll("#burger > button > span");
      const nav = document.querySelector("#burger > nav");

      if (e.target.closest("#burger")) {
        return;
      } else if (!nav.classList.contains("none")) {
        toggleElementClasslist(lines, nav);
      }
    };

    if (document.querySelector("#burger")) {
      const burger = document.querySelector("#burger");
      const submenus = burger.querySelectorAll("nav > ul > li > div");

      for (const submenu of submenus) {
        submenu.addEventListener("click", submenuHandler);
      }

      burger.addEventListener("click", burgerHandler);
      globalThis.addEventListener("click", windowHandler);
    }
  };

  #handleModalOnMobileDevice = () => {
    const btn = document.querySelector("button[data-modal]");
    const modal = btn.nextElementSibling;

    modal.querySelector("h2").textContent = "Espace de connexion";
    modal.querySelector("p").textContent =
      "Connectez-vous à votre compte ou créez-en un !";

    btn.addEventListener("click", () => modal.showModal());
    modal.querySelector("header button").addEventListener(
      "click",
      () => modal.close(),
    );
  };

  /**
   * @param {HTMLDivElement} slider
   * @param {number} sliderLength
   * @param {number} index
   */
  #moveSlider = (slider, sliderLength, index) => {
    const slideWidth = slider.clientWidth / sliderLength;
    slider.style.transform = `translateX(-${slideWidth * index}px)`;
  };
}
