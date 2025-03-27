import nodemailer from "nodemailer";
import { ResponseHandlerThrow } from "./responseHandler";
import TokenEncryptDecrypt from "./tokenEncryptionDecryption";
import EmployeeDao from "../components/employee/employee.dao";

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
        html: `<h1>Here's your verification token: <strong>${token}</strong></h1>`,
      };

      const result = await transport.sendMail(mailOptions);
    } catch (error:any) {
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
      const employee = await this.employeeDao.getUserByIdOrEmail([
        { $match: { email: decryptedEmail } },
      ]);
      console.log(employee);

      if (employee[0].isVerified === true) {
        ResponseHandlerThrow.throw(400, false, "Employee already verified");
      } else {
        await this.employeeDao.getUserByEmailAndUpdate(decryptedEmail);
        return true;
      }
    } catch (error: any) {
      ResponseHandlerThrow.throw(error.status, false, error.message);
    }
  };
}

export default EmailVerifyAndSend;
