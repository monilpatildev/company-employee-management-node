import { ResponseHandlerThrow } from "../../utils/responseHandler";
import EmployeeModel, { IUser } from "./employee.model";

class EmployeeDao {
  public createEmployee = async (data: IUser): Promise<IUser> => {
    try {
      return await EmployeeModel.create(data);
    } catch (error) {
      console.error("Error", error);
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  };

  public getEmployeeByIdOrEmail = async (pipeline: any[]): Promise<any> => {
    try {
      return await EmployeeModel.aggregate(pipeline);
    } catch (error) {
      console.error("Error", error);
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  };

  public getEmployeeByEmailAndUpdate = async (
    email: string
  ): Promise<boolean> => {
    try {
      const employee = await EmployeeModel.findOneAndUpdate(
        { email },
        { $set: { isVerified: true } },
        {
          new: true,
        }
      );
      if (!employee) {
        ResponseHandlerThrow.throw(400, false, "No employee found");
      }
      return true;
    } catch (error) {
      console.error("Error", error);
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
    } catch (error) {
      console.error("Error", error);
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  };

  public deleteEmployeeById = async (id: string): Promise<IUser | null> => {
    try {
      return await EmployeeModel.findByIdAndDelete(id);
    } catch (error) {
      console.error("Error", error);
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  };
}

export default EmployeeDao;
