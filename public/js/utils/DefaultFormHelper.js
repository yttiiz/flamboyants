import { removeInputsValues, setFormData } from "./_commonFunctions.js";

export class DefaultFormHelper {
  constructor() {}

  static setFormData = setFormData;
  static removeInputsValues = removeInputsValues;

  /**
   * @param {HTMLDialogElement} dialog
   * @param {{
   * title: string;
   * paragraph: string;
   * }} param
   */
  static setUserDialogContent = (
    dialog,
    {
      title,
      paragraph,
    },
  ) => {
    dialog.querySelector("h2").textContent = title;
    dialog.querySelector("p").textContent = paragraph;
  };

  /**
   * @param {HTMLDialogElement} dialog
   * @param {{
   * isUserConnected?: boolean;
   * title: string;
   * paragraph: string;
   * status: number;
   * }} param
   */
  static setProductDialogContent = (
    dialog,
    {
      isUserConnected,
      title,
      paragraph,
    },
  ) => {
    dialog.querySelector("h2").textContent = title;
    dialog.querySelector("p").textContent = paragraph;

    if (isUserConnected || isUserConnected === undefined) {
      if (!dialog.querySelector(".login-register").classList.contains("none")) {
        dialog.querySelector(".login-register").classList.add("none");
      }

      // TODO WIP implements status logic.
    } else {
      if (dialog.querySelector(".login-register").classList.contains("none")) {
        dialog.querySelector(".login-register").classList.remove("none");
      }
    }
  };

  /**
   * @param {HTMLDialogElement} dialog
   * @param {{
   * title: string;
   * paragraph: string;
   * status?: number;
   * handler?: (e: Event) => void;
   * }} param
   */
  static setProfilDialogContent = (
    dialog,
    {
      title,
      paragraph,
      status,
      handler,
    },
  ) => {
    dialog.querySelector("h2").textContent = title;
    dialog.querySelector("p").textContent = paragraph;

    if (status) {
      switch (status) {
        case 201: {
          if (!dialog.querySelector("form").classList.contains("none")) {
            dialog.querySelector("form").classList.add("none");
          }
          break;
        }

        case 200: {
          if (!dialog.querySelector("form").classList.contains("none")) {
            dialog.querySelector("form").classList.add("none");
          }

          if (
            dialog.querySelector(".show-message-to-user").classList.contains(
              "none",
            )
          ) {
            dialog.querySelector(".show-message-to-user")
              .classList.remove("none");
          }

          if (handler) {
            dialog.querySelector("button")
              .removeEventListener("click", handler);
            dialog.querySelector("button")
              .addEventListener("click", () => globalThis.location.href = "/");
          }
          break;
        }
      }
    } else {
      if (dialog.querySelector("form").classList.contains("none")) {
        dialog.querySelector("form").classList.remove("none");
      }
    }
  };

  /**
   * @param {HTMLDialogElement} dialog
   * @param {{
   * title: string;
   * paragraph: string;
   * }} param
   * @param {HTMLButtonElement?} btn
   */
  static setHomeDialogContent = (
    dialog,
    {
      title,
      paragraph,
    },
    btn,
  ) => {
    dialog.querySelector("h2").textContent = title;
    dialog.querySelector("p").innerHTML = paragraph;

    const isBrowserFirefox = globalThis.navigator.userAgent.includes("Firefox");
    const input = dialog.querySelector("input");

    const sharedLink = btn.closest("div").nextElementSibling.href;

    input.value = sharedLink;

    if (isBrowserFirefox) {
      const container = dialog.querySelector("div > div");
      const btnCopy = container.querySelector("button");

      if (btnCopy) {
        container.removeChild(btnCopy);
      }

      return;
    }

    dialog.querySelector("div > div button")
      .addEventListener("click", async (e) => {
        const permission = await navigator.permissions.query({
          name: "clipboard-write",
        });

        if (permission.state === "granted" || permission.state === "prompt") {
          // Write link to clipboard.
          navigator.clipboard.writeText(sharedLink);

          input.select();
          e.target.textContent = "Copié";

          // Remove selected state and put back original text content.
          setTimeout(() => {
            globalThis.getSelection().removeAllRanges();
            e.target.textContent = "Copier";
          }, 2000);
        }
      });
  };

  /**
   * @param {{ parent: HTMLDivElement; cssSelector: string; hmtlTag: string; }} param
   */
  static getOrCreateElement = ({
    parent,
    cssSelector,
    hmtlTag,
  }) => {
    /** @type {HTMLParagraphElement} */
    let element;

    if (parent.querySelector(cssSelector)) {
      element = parent.querySelector(cssSelector);
    } else {
      element = document.createElement(hmtlTag);
      parent.appendChild(element);
    }

    return element;
  };
}
