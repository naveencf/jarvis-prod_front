import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const SalesAccountTypeApi = createApi({
  reducerPath: "salesAccountTypeApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllAccountType: builder.query({
      query: () => "accounts/get_account_type_list",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getSingleAccountType: builder.query({
      query: (id) => `accounts/get_account_type/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    addAccountType: builder.mutation({
      query: (newAccountType) => ({
        url: "accounts/add_account_type",
        method: "POST",
        body: newAccountType,
      }),
      onQueryStarted: async (newAccountType, { dispatch, queryFulfilled }) => {
        try {
          const { data: addedAccountType } = await queryFulfilled;

          dispatch(
            SalesAccountTypeApi.util.updateQueryData(
              "getAllAccountType",
              undefined,
              (draft) => {
                draft.unshift(addedAccountType.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add account type:", error);
        }

        /*
        // Optimistic update (commented out)
        const patchResult = dispatch(
          SalesAccountTypeApi.util.updateQueryData('getAllAccountType', undefined, (draft) => {
            draft.unshift(newAccountType);
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error('Failed to add account type:', error);
        }
        */
      },
    }),

    editAccountType: builder.mutation({
      query: ({ id, ...updatedAccountType }) => ({
        url: `accounts/update_account_type/${id}`,
        method: "PUT",
        body: updatedAccountType,
      }),
      onQueryStarted: async (
        { id, ...updatedAccountType },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: returnedAccountType } = await queryFulfilled;

          dispatch(
            SalesAccountTypeApi.util.updateQueryData(
              "getAllAccountType",
              undefined,
              (draft) => {
                const accountTypeIndex = draft.findIndex(
                  (account) => account.id === id
                );
                if (accountTypeIndex !== -1) {
                  draft[accountTypeIndex] = returnedAccountType.data; // Update the object in its current position
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to edit account type:", error);
        }

        /*
        // Optimistic update (commented out)
        const patchResult = dispatch(
          SalesAccountTypeApi.util.updateQueryData('getAllAccountType', undefined, (draft) => {
            const accountTypeIndex = draft.findIndex(account => account.id === id);
            if (accountTypeIndex !== -1) {
              draft[accountTypeIndex] = { ...draft[accountTypeIndex], ...updatedAccountType };
            }
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error('Failed to edit account type:', error);
        }
        */
      },
    }),

    deleteAccountType: builder.mutation({
      query: (id) => ({
        url: `accounts/delete_account_type/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(
            SalesAccountTypeApi.util.updateQueryData(
              "getAllAccountType",
              undefined,
              (draft) => {
                return draft.filter((account) => account.id !== id);
              }
            )
          );
        } catch (error) {
          console.error("Failed to delete account type:", error);
        }

        /*
        // Optimistic update (commented out)
        const patchResult = dispatch(
          SalesAccountTypeApi.util.updateQueryData('getAllAccountType', undefined, (draft) => {
            return draft.filter(account => account.id !== id);
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error('Failed to delete account type:', error);
        }
        */
      },
    }),
  }),
});

export const {
  useGetAllAccountTypeQuery,
  useGetSingleAccountTypeQuery,
  useAddAccountTypeMutation,
  useEditAccountTypeMutation,
  useDeleteAccountTypeMutation,
} = SalesAccountTypeApi;

export default SalesAccountTypeApi;
