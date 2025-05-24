import { bcrypt } from "@deps";

export class Auth {
  public static async hashPassword(password: string, isSync = false) {
    const { hash, hashSync } = bcrypt;
    return isSync ? hashSync(password) : await hash(password);
  }

  public static async comparePassword(
    password: string,
    hash: string,
    isSync = false,
  ) {
    const { compare, compareSync } = bcrypt;

    return isSync ? compareSync(password, hash) : await compare(password, hash);
  }
}
