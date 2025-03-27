import crypto from "crypto";
import { config } from "dotenv";
import { ResponseHandlerThrow } from "./responseHandler";
config();

class PasswordManager {
  private salt: any;

  constructor() {
    this.salt = process.env.SALT;
  }

  public async hashPassword(password: string): Promise<string> {
    try {
      
      const hashedPassword = await crypto
      .pbkdf2Sync(password, this.salt, 1000, 16, `sha512`)
      .toString(`hex`);
      console.log(this.salt,hashedPassword);
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
      const hashedPassword = await crypto
        .pbkdf2Sync(password, this.salt, 1000, 16, `sha512`)
        .toString(`hex`);
        console.log(hashedPassword);
        
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
