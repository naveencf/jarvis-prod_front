import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const CompanyTypeApi = createApi({
  reducerPath: "companyTypeApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllCompanyType: builder.query({
      query: () => "accounts/get_all_account_company_type",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getSingleCompanyType: builder.query({
      query: (id) => `accounts/get_single_account_company_type/${id}`,
      transformResponse: (res) => res.data,
    }),

    addCompanyType: builder.mutation({
      query: (newCompanyType) => ({
        url: "accounts/add_account_company_type",
        method: "POST",
        body: newCompanyType,
      }),
      onQueryStarted: async (newCompanyType, { dispatch, queryFulfilled }) => {
        try {
          const { data: addedCompanyType } = await queryFulfilled;

          dispatch(
            CompanyTypeApi.util.updateQueryData(
              "getAllCompanyType",
              undefined,
              (draft) => {
                draft.unshift(addedCompanyType.data);
              }
            )
          );
          // dispatch(newCompanyType.actions.addedCompanyType(addedCompanyType));
        } catch (error) {
          console.error("Failed to add company type:", error);
        }
      },
    }),

    editCompanyType: builder.mutation({
      query: ({ id, ...updatedCompanyType }) => ({
        url: `accounts/edit_account_company_type/${id}`,
        method: "PUT",
        body: updatedCompanyType,
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        try {
          const { data: returnedCompanyType } = await queryFulfilled;

          dispatch(
            CompanyTypeApi.util.updateQueryData(
              "getAllCompanyType",
              undefined,
              (draft) => {
                const companyTypeIndex = draft.findIndex(
                  (companyType) => companyType.id === id
                );
                if (companyTypeIndex !== -1) {
                  draft[companyTypeIndex] = returnedCompanyType.data; // Update the object in its current position
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to edit company type:", error);
        }
      },
    }),

    deleteCompanyType: builder.mutation({
      query: (id) => ({
        url: `accounts/delete_account_company_type/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllCompanyTypeQuery,
  useGetSingleCompanyTypeQuery,
  useAddCompanyTypeMutation,
  useEditCompanyTypeMutation,
  useDeleteCompanyTypeMutation,
} = CompanyTypeApi;

export default CompanyTypeApi;
