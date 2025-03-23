import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const PantryApi = createApi({
    reducerPath: "pantryApi",
    baseQuery: authBaseQuery,
    endpoints: (builder) => ({
        getPantryById: builder.query({
            query: (id) => `pantry/order_request/${id}`,
            transformResponse: (response) => response.data,
            keepUnusedDataFor: 0,
        }),

        editPantry: builder.mutation({
            query: ({ id, ...updatedPantry }) => ({
                url: `pentry/accept_order_request/${id}`,
                method: "PUT",
                body: updatedPantry,
            }),
            keepUnusedDataFor: 0,
        }),

        deletePantry: builder.mutation({
            query: (id) => ({
                url: `pantry/delete_pantry_overview_list/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetPantryByIdQuery,
    useEditPantryMutation,
    useDeletePantryMutation,
} = PantryApi;

export default PantryApi;
