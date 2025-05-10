// deno-fmt-ignore-file
import {
LogoutUserForm,
  type ComponentType,
  type MoleculeNameType,
  Login,
} from "../mod.ts";
import { SessionType } from "@controllers";

export const HeaderUserSession: ComponentType<
  MoleculeNameType,
  (session: SessionType) => string
> = {
  name: "HeaderUserSession",
  html: (session: SessionType) => {
    let firstname = "", photo = "", fullname = "";

    if (session && session.has("userFirstname")) {
      firstname = session.get("userFirstname");
      photo = session.get("userPhoto");
      fullname = session.get("userFullname");
    }

    return `
    <div id="user-session">
      ${!session
        ? ""
        : 
        (
          session.has("userFirstname")
          ? (LogoutUserForm.html({
              userPhoto: photo,
              userFullname: fullname,
            })
            .replace(
              "{{ user-firstname }}",
              firstname,
            ))
          : Login.html
        ) 
      }
    </div>
    `
  },
};