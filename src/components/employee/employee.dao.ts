import EmployeeModel, { IUser } from "./employee.model";

class EmployeeDao {
  public createEmployee = async (data: IUser): Promise<IUser> => {
    try {
      return await EmployeeModel.create(data);
    } catch (error: any) {
      throw error;
    }
  };

  public getEmployeeByIdOrEmail = async (pipeline: any[]): Promise<any> => {
    try {
      return await EmployeeModel.aggregate(pipeline);
    } catch (error: any) {
      throw error;
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
      throw error;
    }
  };

  public updateEmployeeById = async (
    data: IUser | any,
    id: string
  ): Promise<IUser | null> => {
    try {
      const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id, data, {
        new: true,
        upsert: true,
      });
      return updatedEmployee;
    } catch (error: any) {
      throw error;
    }
  };

  public deleteEmployeeById = async (id: string): Promise<IUser | null> => {
    try {
      return await EmployeeModel.findByIdAndUpdate(
        id,
        { $set: { isDeleted: false } },
        { new: true }
      );
    } catch (error: any) {
      throw error;
    }
  };
}

export default EmployeeDao;
