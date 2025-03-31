import { ResponseHandlerThrow } from "../../utils/responseHandler.util";
import CompanyModel, { ICompany } from "./company.model";

class CompanyDao {
  public createCompany = async (data: ICompany): Promise<ICompany> => {
    try {
      return await CompanyModel.create(data);
    } catch (error: any) {
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  };

  public getCompanyByIdOrEmail = async (pipeline: any[]): Promise<any> => {
    try {
      return await CompanyModel.aggregate(pipeline);
    } catch (error: any) {
      ResponseHandlerThrow.throw(
        400,
        false,
        "Invalid id or something went wrong"
      );
    }
  };

  public deleteCompanyById = async (id: string): Promise<ICompany | null> => {
    try {
      return await CompanyModel.findByIdAndDelete(id);
    } catch (error: any) {
      ResponseHandlerThrow.throw(400, false, "Invalid id");
    }
  };

  public updateCompanyById = async (
    data: ICompany | any,
    id: string
  ): Promise<ICompany | null> => {
    try {
      return await CompanyModel.findByIdAndUpdate(id, data, { new: true });
    } catch (error: any) {
      ResponseHandlerThrow.throw(400, false, "Invalid id");
    }
  };
}

export default CompanyDao;
