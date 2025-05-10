import { Validator } from "./mod.ts";
import { Auth } from "@auth";
import type {
  UserSchemaWithIDType,
  UserSchemaWithOptionalFieldsType,
} from "@mongo";
import { FormDataType } from "@components";

type DisplayDateType = {
  date?: number | Date;
  style?: "normal" | "long" | "short";
};

export class Helper {
  private static baseDateOpts: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  private static longDateOpts: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  private static shortDateOpts: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Paris",
    year: "2-digit",
    month: "numeric",
    day: "numeric",
  };

  private static writeOpts: Deno.WriteFileOptions = {
    create: true,
    append: true,
    mode: 764,
  };

  public static async convertJsonToObject<T = unknown>(
    path: string,
    decoder = new TextDecoder("utf-8"),
  ): Promise<T> {
    const file = await Deno.readFile(Deno.cwd() + path);

    return JSON.parse(decoder.decode(file));
  }

  public static async writeLog(error: unknown) {
    if (error) {
      const { message } = error as { message: string };
      const errorMsg = `(${Helper.displayDate({})}) ${message},\n`;
      const content = new TextEncoder().encode(errorMsg);

      try {
        await Deno.writeFile("server/log/log.txt", content, Helper.writeOpts);
      } catch (error) {
        console.log("inside Helper.writeLog function :", error);
      }
    }
  }

  public static async writeEmailLog(message: string) {
    await Deno.writeFile(
      "server/log/email.txt",
      new TextEncoder().encode(`${message},\n`),
      Helper.writeOpts,
    );
  }

  public static async writeUserPicFile(
    file: File,
    firstname: string,
    lastname: string,
  ) {
    firstname = Validator.normalizeString(firstname);
    lastname = Validator.normalizeString(lastname);

    const fullName = `${firstname.toLowerCase()}_${lastname.toLowerCase()}`;
    return await Helper.writePicture(file, fullName, "users");
  }

  public static async writePicFile(file: File, name: string) {
    name = Validator.normalizeString(name);

    return await Helper.writePicture(file, name, "products");
  }

  private static async writePicture(file: File, name: string, dir: string) {
    const ext = file.type.split("/").at(1) as string;
    const pic = `img/${dir}/${name}.${ext}`;

    await Deno.writeFile(`public/${pic}`, file.stream(), Helper.writeOpts);

    return pic;
  }

  public static formatPrice(price: number) {
    return new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "EUR",
    }).format(price);
  }

  public static displayDate({ date, style = "long" }: DisplayDateType) {
    date = date ? date : new Date();
    return new Intl.DateTimeFormat(
      "fr-FR",
      style === "long"
        ? Helper.longDateOpts
        : style === "short"
        ? Helper.shortDateOpts
        : Helper.baseDateOpts,
    )
      .format(date)
      .replace(",", " à");
  }

  public static async removeEmptyOrUnchangedFields(
    data: Record<string, FormDataEntryValue>,
    user: UserSchemaWithIDType,
    picPath?: string,
  ) {
    const trustData = Object.keys(data)
      .filter((key) => data[key] !== "" || data[key] !== undefined)
      .reduce((acc, key) => {
        if (data[key] instanceof File) {
          delete data[key];

          return acc;
        } else {
          if (user[key as keyof typeof user] !== data[key]) {
            key === "birth"
              ? (acc["birth"] = new Date(data[key] as string))
              : (acc[key as keyof Omit<typeof acc, "birth">] = data[
                key
              ] as string);

            return acc;
          }

          return acc;
        }
      }, {} as UserSchemaWithOptionalFieldsType & { password?: string });

    if (trustData["password"]) {
      trustData["hash"] = await Auth.hashPassword(trustData["password"]);
    }

    delete trustData["password"];

    if (picPath) {
      trustData["photo"] = picPath;
    }

    return trustData;
  }

  public static addFileModelTo(dataModel: FormDataType) {
    // Add additional types to check in 'dataModel'.
    const files = [
      {
        type: "file",
        name: "thumbnail",
        accept: ".png, .jpg, .webp, .jpeg",
      },
      {
        type: "file",
        name: "pictures",
        accept: ".png, .jpg, .webp, .jpeg",
      },
    ];

    for (const file of files) {
      dataModel.content.push(file);
    }
  }

  public static convertToNumber(str: string) {
    return str.includes(",")
      ? str.split(",").reduce((num, chunk, i) => {
        i === 0
          ? (num += +chunk)
          : (num += +chunk / Math.pow(10, chunk.length));
        return num;
      }, 0)
      : +str;
  }

  public static messageToAdmin(
    str: TemplateStringsArray,
    name: string,
    isUpdate: boolean,
    updateOrDeleteStr?: "delete" | "update" | "add",
  ) {
    return `${str[0]}${name}${str[1]}${isUpdate ? "a bien" : "n'a pas"}${
      str[2]
    } ${
      updateOrDeleteStr === "delete"
        ? "supprimé"
        : updateOrDeleteStr === "update"
        ? "mis à jour"
        : "ajouté"
    }.`;
  }

  public static messageToUser(
    bool: boolean,
    profilOrAccountStr = "profil",
    updateOrDeleteStr = "mis à jour",
  ) {
    return `Votre ${profilOrAccountStr} ${
      bool ? "a bien" : "n'a pas"
    } été ${updateOrDeleteStr}.`;
  }
}
