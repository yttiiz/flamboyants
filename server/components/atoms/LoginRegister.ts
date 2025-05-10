import { AtomNameType, ComponentType } from "../mod.ts";

export const LoginRegister: ComponentType<AtomNameType> = {
  name: "LoginRegister",
  html: `
  <div class="login-register">
    <a href="/login">Se connecter</a>
    <a href="/register">Créer un compte</a>
  </div>`,
};
