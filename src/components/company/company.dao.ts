import { ResponseHandlerThrow } from "../../utils/responseHandler";
import CompanyModel, { ICompany } from "./company.model";

class CompanyDao {
  public createCompany = async (data: ICompany): Promise<ICompany> => {
    try {
      return await CompanyModel.create(data);
    } catch (error) {
      console.error("Error", error);
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  };

  public getCompanyByIdOrEmail = async (pipeline: any[]): Promise<any> => {
    try {
      const company = await CompanyModel.aggregate(pipeline);
      return company;
    } catch (error) {
      console.error("Error getCompanyByIdOrEmail", error);
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  };

  public getCompanyByEmailAndUpdate = async (
    email: string
  ): Promise<boolean> => {
    try {
      const company = await CompanyModel.findOneAndUpdate(
        { email: email },
        { $set: { isVerified: true } },
        {
          new: true,
        }
      );
      if (!company) {
        ResponseHandlerThrow.throw(500, false, "Internal server error");
      }
      return true;
    } catch (error) {
      console.error("Error", error);
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  };
}

export default CompanyDao;
