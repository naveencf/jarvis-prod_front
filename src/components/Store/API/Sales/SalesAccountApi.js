import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const SalesAccountApi = createApi({
  reducerPath: "salesAccountApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllAccount: builder.query({
      query: (id) => `accounts/get_all_account${id ? `?userId=${id}` : ""}`,
      transformResponse: (response, args) => response.data,
      keepUnusedDataFor: 0,
    }),

    getSingleAccount: builder.query({
      query: (id) => `accounts/get_single_account/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),
    getSingleAccountSalesBooking: builder.query({
      query: (id) => `accounts/get_single_account_billing/${id}`,
      transformResponse: (response, args) => response.data,
      keepUnusedDataFor: 0,
    }),

    addAccount: builder.mutation({
      query: (newAccount) => ({
        url: "accounts/add_account",
        method: "POST",
        body: newAccount,
      }),
      onQueryStarted: async (newAccount, { dispatch, queryFulfilled }) => {
        try {
          const { data: addedAccount } = await queryFulfilled;

          dispatch(
            SalesAccountApi.util.updateQueryData(
              "getAllAccount",
              undefined,
              (draft) => {
                draft.unshift(addedAccount.data.accountMaster);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add account:", error);
        }
      },
    }),

    editAccount: builder.mutation({
      query: ({ id, ...updatedAccount }) => ({
        url: `accounts/edit_account/${id}`,
        method: "PUT",
        body: updatedAccount,
      }),
      onQueryStarted: async (
        { id, ...updatedAccount },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: returnedAccount } = await queryFulfilled;

          dispatch(
            SalesAccountApi.util.updateQueryData(
              "getAllAccount",
              undefined,
              (draft) => {
                const accountIndex = draft.findIndex(
                  (account) => account._id === id
                );
                if (accountIndex !== -1) {
                  draft[accountIndex] = returnedAccount.data.accountMaster; // Update the object in its current position
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to edit account:", error);
        }
      },
    }),

    deleteAccount: builder.mutation({
      query: (id) => ({
        url: `accounts/delete_account/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllAccountQuery,
  useGetSingleAccountQuery,
  useGetSingleAccountSalesBookingQuery,
  useAddAccountMutation,
  useEditAccountMutation,
  useDeleteAccountMutation,
} = SalesAccountApi;

export default SalesAccountApi;
