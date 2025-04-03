import CompanyModel, { ICompany } from "./company.model";

class CompanyDao {
  public createCompany = async (data: ICompany): Promise<ICompany> => {
    try {
      return await CompanyModel.create(data);
    } catch (error: any) {
      throw { status: 400, message: "Internal server error" };
    }
  };

  public getCompanyByIdOrEmail = async (pipeline: any[]): Promise<any> => {
    try {
      return await CompanyModel.aggregate(pipeline);
    } catch (error: any) {
      console.log(error);

      throw { status: 500, message: "Internal server error" };
    }
  };

  public deleteCompanyById = async (id: string): Promise<ICompany | null> => {
    try {
      return await CompanyModel.findByIdAndUpdate(
        id,
        { $set: { isDeleted: true } },
        { new: true }
      );
    } catch (error: any) {
      throw { status: 400, message: "Internal server error" };
    }
  };

  public updateCompanyById = async (
    data: ICompany | any,
    id: string
  ): Promise<ICompany | null> => {
    try {
      return await CompanyModel.findByIdAndUpdate(id, data, { new: true });
    } catch (error: any) {
      throw { status: 400, message: "Internal server error" };
    }
  };
}

export default CompanyDao;
