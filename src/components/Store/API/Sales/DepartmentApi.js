import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const DepartmentApi = createApi({
  reducerPath: "departmentApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getDepartmentList: builder.query({
      query: () => `accounts/department`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    getDepartmentDetails: builder.query({
      query: (id) => `accounts/department/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    createDepartment: builder.mutation({
      query: (newDepartment) => ({
        url: "accounts/department",
        method: "POST",
        body: newDepartment,
      }),
      onQueryStarted: async (newDepartment, { dispatch, queryFulfilled }) => {
        try {
          const { data: addedDepartment } = await queryFulfilled;

          dispatch(
            DepartmentApi.util.updateQueryData(
              "getDepartmentList",
              undefined,
              (draft) => {
                draft.unshift(addedDepartment.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add department:", error);
        }
      },
    }),

    updateDepartment: builder.mutation({
      query: ({ id, ...updatedDepartment }) => ({
        url: `accounts/department/${id}`,
        method: "PUT",
        body: updatedDepartment,
      }),
      onQueryStarted: async (
        { id, ...updatedDepartment },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: returnedDepartment } = await queryFulfilled;

          dispatch(
            DepartmentApi.util.updateQueryData(
              "getDepartmentList",
              undefined,
              (draft) => {
                const departmentIndex = draft.findIndex(
                  (department) => department._id === id
                );
                if (departmentIndex !== -1) {
                  draft[departmentIndex] = returnedDepartment.data;
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to update department:", error);
        }
      },
    }),

    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `accounts/department/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(
            DepartmentApi.util.updateQueryData(
              "getDepartmentList",
              undefined,
              (draft) => {
                return draft.filter((department) => department._id !== id);
              }
            )
          );
        } catch (error) {
          console.error("Failed to delete department:", error);
        }
      },
    }),
  }),
});

export const {
  useGetDepartmentListQuery,
  useGetDepartmentDetailsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = DepartmentApi;

export default DepartmentApi;
