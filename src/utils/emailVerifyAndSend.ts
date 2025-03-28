import nodemailer from "nodemailer";
import { ResponseHandlerThrow } from "./responseHandler";
import TokenEncryptDecrypt from "./tokenEncryptionDecryption";
import EmployeeDao from "../components/employee/employee.dao";
import ejs from "ejs";
import path from "path";

class EmailVerifyAndSend {
  private appPassword: any;
  private employeeDao: EmployeeDao;

  constructor() {
    this.appPassword = process.env.CLIENT_SECRET;
    this.employeeDao = new EmployeeDao();
  }

  public sendEmail = async (email: string): Promise<void> => {
    try {
      const token = await TokenEncryptDecrypt.encryptToken(email);
      const verificationLink = `${process.env.SERVER_BASE_URL}/api/account-verify/${token}`;

      const templatePath = path.join(__dirname, "../view/email.ejs");
      const html = await ejs.renderFile(templatePath, { verificationLink });

      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "monilp.webosmotic@gmail.com",
          pass: this.appPassword,
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
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };

  public verifyMail = async (token: string): Promise<boolean | void> => {
    try {
      const decryptedEmail = await TokenEncryptDecrypt.decryptToken(token);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(decryptedEmail)) {
        ResponseHandlerThrow.throw(400, false, "Invalid token");
      }
      const employee = await this.employeeDao.getEmployeeByIdOrEmail([
        { $match: { email: decryptedEmail } },
      ]);
      if (employee[0].isVerified === true) {
        ResponseHandlerThrow.throw(400, false, "Employee already verified");
      } else {
        await this.employeeDao.getEmployeeByEmailAndUpdate(decryptedEmail);
        return true;
      }
    } catch (error: any) {
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };
}

export default EmailVerifyAndSend;
