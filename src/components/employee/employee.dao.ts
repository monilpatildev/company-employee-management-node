import { ResponseHandlerThrow } from "../../utils/responseHandler.util";
import EmployeeModel, { IUser } from "./employee.model";

class EmployeeDao {
  public createEmployee = async (data: IUser): Promise<IUser> => {
    try {
      return await EmployeeModel.create(data);
    } catch (error: any) {
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  };

  public getEmployeeByIdOrEmail = async (pipeline: any[]): Promise<any> => {
    try {
      return await EmployeeModel.aggregate(pipeline);
    } catch (error: any) {
      ResponseHandlerThrow.throw(
        400,
        false,
        "Invalid id or something went wrong"
      );
    }
  };

  public getEmployeeByEmailAndUpdate = async (
    email: string
  ): Promise<boolean | null> => {
    try {
      return await EmployeeModel.findOneAndUpdate(
        { email },
        { $set: { isVerified: true } },
        {
          new: true,
        }
      );
    } catch (error: any) {
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  };

  public updateEmployeeById = async (
    data: IUser | any,
    id: string
  ): Promise<IUser | null> => {
    try {
      const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      return updatedEmployee;
    } catch (error: any) {
      ResponseHandlerThrow.throw(400, false, "Invalid id");
    }
  };

  public deleteEmployeeById = async (id: string): Promise<IUser | null> => {
    try {
      return await EmployeeModel.findByIdAndDelete(id);
    } catch (error: any) {
      ResponseHandlerThrow.throw(400, false, "Invalid id");
    }
  };
}

export default EmployeeDao;
