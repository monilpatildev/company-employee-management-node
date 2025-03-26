import { Request } from "express";
import { ResponseHandler } from "../../utils/responseHandler";

class AuthController {
  public RegisterEmployee(request: Request, response: Response) {
    try {
      if (condition) {
        
      }
    } catch (error:any) {
      ResponseHandler.error(response,error.status,error.message)
    }
  }
}
