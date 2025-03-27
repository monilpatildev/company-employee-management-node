import crypto from "crypto";

class TokenEncryptDecrypt {
  static algorithm = "aes-256-cbc";
  static secretKey = crypto
    .createHash("sha256")
    .update(String("your-super-secret-key"))
    .digest("base64")
    .substr(0, 32);

  public static encryptToken = async (email: any): Promise<string> => {
    const iv = await crypto.randomBytes(16);
    const payload = JSON.stringify({ email });
    const cipher = await crypto.createCipheriv(
      this.algorithm,
      this.secretKey,
      iv
    );
    let encrypted = await cipher.update(payload, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  };

  public static decryptToken = async (token: any): Promise<string> => {
    const tokenParts = token.split(":");
    if (tokenParts.length !== 2) {
      throw new Error("Invalid token format");
    }
    const iv = Buffer.from(tokenParts[0], "hex");
    const encryptedData = tokenParts[1];
    const decipher = await crypto.createDecipheriv(
      this.algorithm,
      this.secretKey,
      iv
    );
    let decrypted = await decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    const verificationData = JSON.parse(decrypted);
    return verificationData.email;
  };
}

export default TokenEncryptDecrypt;
