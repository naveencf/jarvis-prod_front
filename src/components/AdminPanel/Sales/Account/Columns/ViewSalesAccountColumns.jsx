import DateISOtoNormal from "../../../../../utils/DateISOtoNormal";
import { useGetAllBrandCategoryTypeQuery } from "../../../../Store/API/BrandCategoryTypeApi";
import { useGetAllCompanyTypeQuery } from "../../../../Store/API/CompanyTypeApi";
import { useGetAllAccountTypeQuery } from "../../../../Store/API/SalesAccountTypeApi";

export const useAllData = () => {
    const {
        data: allAccountTypes,
        error: allAccountTypesError,
        isLoading: allAccountTypesLoading,
    } = useGetAllAccountTypeQuery();

    const {
        data: allCompanyType,
        error: allCompanyTypeError,
        isLoading: allCompanyTypeLoading,
    } = useGetAllCompanyTypeQuery();

    const {
        data: allBrandCatType,
        error: allBrandCatTypeError,
        isLoading: allBrandCatTypeLoading,
    } = useGetAllBrandCategoryTypeQuery();

    return {
        allAccountTypes,
        allAccountTypesError,
        allAccountTypesLoading,
        allCompanyType,
        allCompanyTypeError,
        allCompanyTypeLoading,
        allBrandCatType,
        allBrandCatTypeError,
        allBrandCatTypeLoading,
    };
};

export const ViewSalesAccountColumns = [
    { key: "Serial_no", name: "S.NO", renderRowCell: (row, index) => index + 1, width: 20, showCol: true, sortable: true },
    { key: "account_name", name: "Account Name", renderRowCell: (row) => row.account_name, width: 100, sortable: true, showCol: true },
    { key: "description", name: "Description", renderRowCell: (row) => row.description, width: 100, sortable: true, showCol: true },
    { key: "turn_over", name: "Turn Over", renderRowCell: (row) => row.turn_over, width: 100, sortable: true, showCol: true },
    { key: "website", name: "Website", renderRowCell: (row) => (<a href={row.website} target="_blank">{row.website}</a>), width: 100, sortable: true, showCol: true },
    { key: "createdAt", name: "Created Date", renderRowCell: (row) => (DateISOtoNormal(row.createdAt)), width: 100, sortable: true, showCol: true },
    { key: "updatedAt", name: "Updated Date", renderRowCell: (row) => (DateISOtoNormal(row.updatedAt)), width: 100, sortable: true, showCol: true },
    // {
    //     key: "AccountType", name: "Account Type", renderRowCell: (row) => {
    //         const { allAccountTypes } = useAllData();
    //         return allAccountTypes?.filter(accountType => accountType.id === row.account_type_id);
    //     }, width: 100, sortable: true, showCol: true
    // },
];