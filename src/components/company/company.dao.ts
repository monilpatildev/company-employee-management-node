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
      return await CompanyModel.aggregate(pipeline);
    } catch (error) {
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  };


  public deleteCompanyById = async (id: string): Promise<ICompany | null> => {
    try {
      return await CompanyModel.findByIdAndDelete(id);
    } catch (error) {
      console.error("Error", error);
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  };

  public updateCompanyById = async (
    data: ICompany | any,
    id: string
  ): Promise<ICompany | null> => {
    try {
      return await CompanyModel.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      console.error("Error", error);
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  };
}

export default CompanyDao;
