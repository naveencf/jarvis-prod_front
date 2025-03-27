import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../../../../utils/config';
import authBaseQuery from '../../../../utils/authBaseQuery';

const BoostingApi = createApi({
    reducerPath: 'boostingApi',
    baseQuery: authBaseQuery,
    endpoints: (builder) => ({
        // Create a new boosting creator
        createItem: builder.mutation({
            query: (newItem) => ({
                url: '/v1/create_boosting_creator',
                method: 'POST',
                body: newItem,
            }),
        }),

        // Fetch all boosting creators
        getBoostingCreators: builder.query({
            query: () => "v1/get_boosting_creators",
            transformResponse: (response) => response?.data,
        }),

        // Fetch creator names
        getCreatorNames: builder.query({
            query: () => "v1/get_creator_names",
            transformResponse: (response) => response?.data,
        }),

        // Create a new Instagram Boosting Default Service
        createInstaBoostingDefaultService: builder.mutation({
            query: (data) => ({
                url: "/v1/insta_boosting_default_service",
                method: "POST",
                body: data,
            }),
        }),

        // Fetch all Instagram Boosting Default Services
        getInstaBoostingDefaultServices: builder.query({
            query: () => "/v1/insta_boosting_default_service",
            transformResponse: (response) => response?.data,
        }),

        // Fetch a single Instagram Boosting Default Service by ID
        getSingleInstaBoostingDefaultService: builder.query({
            query: (id) => `/v1/insta_boosting_default_service/${id}`,
            transformResponse: (response) => response?.data,
        }),

        // Edit an Instagram Boosting Default Service by ID
        editInstaBoostingDefaultService: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/v1/insta_boosting_default_service/${id}`,
                method: "PUT",
                body: updatedData,
            }),
        }),
        // Delete a boosting creator by ID
        deleteBoostingCreator: builder.mutation({
            query: (id) => ({
                url: `/v1/delete_boosting_creator/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["BoostingCreators"],
        }),
        // Fetch Instagram Boosting Data with Date Filter
        getInstaBoostingData: builder.query({
            query: ({ startDate, endDate }) => ({
                url: `/v1/get_instaboosting_data`,
                method: "GET",
                params: { startDate, endDate },
            }),
            transformResponse: (response) => response?.boostingPosts,
        }),
        // Edit a boosting creator by ID
        editBoostingCreator: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/v1/edit_boosting_creator/${id}`,
                method: "PUT",
                body: updatedData
            })
        })
    }),

});

export const {
    useCreateItemMutation,
    useGetBoostingCreatorsQuery,
    useGetCreatorNamesQuery,
    useCreateInstaBoostingDefaultServiceMutation,
    useGetInstaBoostingDefaultServicesQuery,
    useGetSingleInstaBoostingDefaultServiceQuery,
    useEditInstaBoostingDefaultServiceMutation,
    useDeleteBoostingCreatorMutation,
    useGetInstaBoostingDataQuery,
     useEditBoostingCreatorMutation
} = BoostingApi;

export default BoostingApi;
