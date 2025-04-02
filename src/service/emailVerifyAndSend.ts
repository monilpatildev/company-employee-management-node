import nodemailer from "nodemailer";
import TokenEncryptDecrypt from "../utils/tokenEncryptionDecryption.util";
import EmployeeDao from "../components/employee/employee.dao";
import ejs from "ejs";
import path from "path";

class EmailVerifyAndSend {
  private employeeDao: EmployeeDao;

  constructor() {
    this.employeeDao = new EmployeeDao();
  }

  public sendEmail = async (email: string): Promise<any> => {
    try {
      const appPassword = process.env.CLIENT_SECRET;
      const token = await TokenEncryptDecrypt.encryptToken(email);
      const verificationLink = `${process.env.SERVER_BASE_URL}/api/account-verify/${token}`;

      const templatePath = path.join(__dirname, "../view/email.ejs");
      const html = await ejs.renderFile(templatePath, { verificationLink });

      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "monilp.webosmotic@gmail.com",
          pass: appPassword,
        },
      });
      const mailOptions = {
        from: " <monilp.webosmotic@gmail.com>",
        to: email,
        subject: "Verify Your Email Address",
        text: "Hello from gmail text using API",
        html,
      };

      const result = await transport.sendMail(mailOptions);
    } catch (error: any) {
      throw {
        status: error.status || 400,
        message: error.message || "Invalid token",
      };
    }
  };

  public verifyMail = async (token: string): Promise<boolean | void> => {
    try {
      const decryptedEmail = await TokenEncryptDecrypt.decryptToken(token);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(decryptedEmail)) {
        throw { status: 400, message: "Invalid token" };
      }

      const employee = await this.employeeDao.getEmployeeByIdOrEmail([
        { $match: { email: decryptedEmail } },
      ]);

      if (employee[0].isVerified === true) {
        throw { status: 400, message: "Employee already verified" };
      } else {
        const verifiedEmployee =
          await this.employeeDao.getEmployeeByEmailAndUpdate(decryptedEmail);
        if (!verifiedEmployee) {
          throw { status: 404, message: "Employee not found" };
        }
        return true;
      }
    } catch (error: any) {
      throw error;
    }
  };
}

export default EmailVerifyAndSend;
