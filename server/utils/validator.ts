import { FormDataType } from "@components";
import { DataParserReturnType } from "./mod.ts";

export class Validator {
  public static normalizeString(str: string) {
    return str.normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
  }

  public static limitDates(date?: string | undefined) {
    if (date) {
      return {
        min: date,
      };
    }

    const {
      year,
      month,
      day,
    } = Validator.createDate();

    return {
      min: `${year}-${month}-${day}`,
    };
  }

  public static limitAge(
    MAJORITY = 18,
    CENTURY = 100,
  ) {
    const {
      year,
      month,
      day,
    } = Validator.createDate();

    return {
      min: `${year - CENTURY}-${month}-${day}`,
      max: `${year - MAJORITY}-${month}-${day}`,
    };
  }

  public static minAndMaxDateParser(
    label: string,
    startingDate?: string | undefined,
  ) {
    return label.includes("naissance")
      ? (
        `min="${Validator.limitAge().min}"
          max="${Validator.limitAge().max}"`
      )
      : (
        `min="${Validator.limitDates(startingDate).min}"`
      );
  }

  public static dataParser(
    formData: FormData,
    dataModel: FormDataType,
  ): DataParserReturnType {
    const UNAUTHORIZED_CHARACTER = /[^\w\s\-@.\u00C0-\u00FF]/g;
    const UNAUTHORIZED_IN_TEXTAREA = /[%&<>\[\]{}]/g;

    let key = 0, isOk = true;
    let message = "Il semble que votre saisie contient :";
    const messageLength = message.length;

    const isMsgSet = (message: string) => message.length !== messageLength;

    for (const [prop, value] of formData) {
      if (typeof value === "string") {
        // Skip unnecessary formData property.
        if (prop.includes("file") || prop.includes("price")) {
          key++;
          continue;
        }

        // Check textarea field type.
        if (
          dataModel.content[key].type === "textarea" &&
          (value as string).search(UNAUTHORIZED_IN_TEXTAREA) !== -1
        ) {
          message += " des caractères non autorisés.";
          isOk = false;
          break;
        }

        // Check other field type.
        if (
          dataModel.content[key].type !== "textarea" &&
          (value as string).search(UNAUTHORIZED_CHARACTER) !== -1
        ) {
          message += isMsgSet(message) ? "" : " des caractères non autorisés.";
          isOk = false;
          break;
        }

        // Check field content length.
        if (
          dataModel.content[key].maxLength &&
          ((value as string).length > +(dataModel.content[key].maxLength!))
        ) {
          message += isMsgSet(message)
            ? (message.replace(".", "") + " et en nombre trop importants.")
            : " des caractères en nombre trop importants.";
          isOk = false;

          break;
        }
      } else {
        //Check file type.
        const [photoModel] = dataModel.content
          .filter((item) => (
            item.name === "photo" || item.name === "thumbnail" ||
            item.name === "pictures"
          ));

        const extFile = value.type.split("/").at(1) as string;

        if (photoModel.accept && photoModel.accept.includes(extFile)) {
          isOk = true;
        } else {
          message += ` ${
            isMsgSet(message) ? "Et " : ""
          } un fichier de type ${extFile} qui n'est pas pris en charge.`;
          isOk = false;

          break;
        }
      }

      key++;
    }

    if (isOk) {
      const data: Record<string, FormDataEntryValue> = {};

      for (const [key, value] of formData) {
        data[key] = value;
      }

      return { isOk, data };
    }

    return { isOk, message };
  }

  public static createDate() {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1 < 10
        ? (`0${now.getMonth() + 1}`)
        : (now.getMonth() + 1),
      day: now.getDate() < 10 ? (`0${now.getDate()}`) : (now.getDate()),
    };
  }
}
