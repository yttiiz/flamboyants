/**
 * Switchs between `eye-open` and `eye-shut` svg.
 */
const handleShowPassword = () => {
  const eyeIcons = document.querySelectorAll("#eye-password span");

  /** @param {Event} e **/
  const handler = (e) => {
    // handle eye icon
    e.currentTarget
      .closest("div")
      .querySelector(".none")
      .classList.remove("none");

    e.currentTarget.classList.add("none");

    // handle input type
    const input = e.currentTarget.closest("div").previousElementSibling;

    input["type"] === "password"
      ? (input["type"] = "text")
      : (input["type"] = "password");
  };

  for (const eye of eyeIcons) {
    eye.addEventListener("click", handler);
  }
};

/**
 * @param {Event} e
 * @param {string} [name]
 */
const handleInputFile = (e, name) => {
  /** @type {HTMLInputElement} */
  let input;

  /** @type {HTMLInputElement| HTMLDivElement} */
  let showFileInfos;

  /**
   * @param {HTMLInputElement} input
   */
  const createInputTypeFile = (input, fileName = "photo") => {
    input = document.createElement("input");
    input.type = "file";
    input.name = fileName;
    input.accept = ".png, .jpg, .webp, .jpeg";

    return input;
  };

  /**
   * @param {HTMLInputElement} input
   * @param {HTMLInputElement| HTMLDivElement} showFileInfos
   */
  const handleFileContent = (input, showFileInfos) => {
    input.addEventListener("change", (event) => {
      if (event.currentTarget.files.length === 1) {
        const { name, size } = event.currentTarget.files[0];
        const sizeInKo = new Intl.NumberFormat("fr-FR", {
          maximumFractionDigits: 2,
        }).format(size / 1000);

        if (showFileInfos instanceof HTMLDivElement) {
          showFileInfos.innerHTML =
            `Fichier choisi : <b>${name}</b> (taille: ${sizeInKo} ko).`;

          if (showFileInfos.classList.contains("none")) {
            showFileInfos.classList.remove("none");
            showFileInfos.classList.add("show-file");
          }
        } else {
          showFileInfos.value = `${name} (taille: ${sizeInKo} ko)`;
        }
      }
    });
  };

  // Check if it's Profil or Register form.
  e.currentTarget.closest("form").action.includes("/profil")
    ? (showFileInfos = e.currentTarget.nextElementSibling)
    : (showFileInfos = e.currentTarget.closest("div").previousElementSibling);

  if (e.currentTarget.parentNode.querySelector("input")) {
    input = e.currentTarget.parentNode.querySelector("input");
  } else {
    input = name
      ? createInputTypeFile(input, name)
      : createInputTypeFile(input);
    e.currentTarget.closest("div").insertBefore(input, e.currentTarget);
    handleFileContent(input, showFileInfos);
  }

  input.click();
};

/**
 * @param {HTMLFormElement} form
 */
const setFormData = (form) => {
  const formData = new FormData(form);

  for (const [key, value] of formData) {
    const isItemToBeDeleted = value === "" || // Empty field.
      (typeof value === "object" && value.size === 0) || // Empty file (image) field type.
      key.includes("file"); // Field type text with file name.

    if (isItemToBeDeleted) {
      formData.delete(key);
    }
  }

  return formData;
};

/**
 * @param {NodeListOf<HTMLLabelElement>} labels
 */
const removeInputsValues = (labels) => {
  for (const label of labels) {
    label.querySelector("textarea")
      ? (label.querySelector("textarea").value = "")
      : null;

    label.querySelector("input")
      ? (label.querySelector("input").value = "")
      : null;
  }
};

/**
 * @param {HTMLInputElement} element
 * @param {Record<string, string>} data
 */
const hydrateInput = (element, data) => {
  const isValueStringOrNumber = typeof data[element.name] === "string" ||
    typeof data[element.name] === "number";

  if (element.type !== "password" && isValueStringOrNumber) {
    element.type === "date"
      ? (element.value = data[element.name].split("T").at(0))
      : (element.value = data[element.name]);
  }
};

/**
 * @param {HTMLSelectElement} element
 * @param {Record<string, string>} data
 */
const hydrateSelect = (element, data) => {
  for (const option of element.children) {
    if (option.value == data[element.name]) {
      option.setAttribute("selected", true);
      break;
    }
  }
};

const getApiKey = () => "?apiKey=ESdv9jDqQGsuL9XEsqlS6KWN";

/**
 * @param {string} date
 */
const getAge = (date) => {
  return new Date(Date.now() - new Date(date).getTime())
    .getFullYear() - 1970;
};

/**
 * @param {"true" | "false"} bool
 */
const setLoadingAction = (bool, titles = "h3") => {
  for (const subtitle of document.querySelectorAll(titles)) {
    subtitle.parentNode.dataset.loading = bool;
  }
};

export {
  getAge,
  getApiKey,
  handleInputFile,
  handleShowPassword,
  hydrateInput,
  hydrateSelect,
  removeInputsValues,
  setFormData,
  setLoadingAction,
};
