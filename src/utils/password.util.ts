import crypto from "crypto";
import { config } from "dotenv";
import { ResponseHandlerThrow } from "./responseHandler.util";
config();

class PasswordManager {
  public async hashPassword(password: string): Promise<string> {
    try {
      const salt: string | any = process.env.SALT;
      const hashedPassword = await crypto
        .pbkdf2Sync(password, salt, 1000, 16, `sha512`)
        .toString(`hex`);
      return hashedPassword;
    } catch (error) {
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  }

  public async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    try {
      const salt: string | any = process.env.SALT;
      const hashedPassword = await crypto
        .pbkdf2Sync(password, salt, 1000, 16, `sha512`)
        .toString(`hex`);
      if (hashedPassword !== hash) {
        return false;
      }
      return true;
    } catch (error) {
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  }
}

export default new PasswordManager();
