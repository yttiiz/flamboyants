import { bcrypt } from "@deps";

export class Auth {
  public static async hashPassword(password: string) {
    return await bcrypt.hash(password);
  }

  public static async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
