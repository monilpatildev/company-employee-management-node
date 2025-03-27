import { ResponseHandlerThrow } from "../../utils/responseHandler";
import EmployeeModel, { IUser } from "./employee.model";

class EmployeeDao {
  public createUser = async (data: IUser): Promise<IUser> => {
    try {
      return await EmployeeModel.create(data);
    } catch (error) {
      console.error("Error", error);
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  };

  public getUserByIdOrEmail = async (pipeline: any[]): Promise<any> => {
    try {
      const employee = await EmployeeModel.aggregate(pipeline);
      
      if (!employee.length) {
        ResponseHandlerThrow.throw(400, false, "No employee found");
      } else {
        return employee;
      }
    } catch (error) {
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  };

  public getUserByEmailAndUpdate = async (email: string): Promise<boolean> => {
    try {
      const employee = await EmployeeModel.findOneAndUpdate(
        { email: email },
        { $set: { isVerified: true } },
        {
          new: true,
        }
      );
      if (!employee) {
        ResponseHandlerThrow.throw(500, false, "Internal server error");
      }
      return true;
    } catch (error) {
      console.error("Error", error);
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  };
}

export default EmployeeDao;
