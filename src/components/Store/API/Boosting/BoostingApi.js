import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../../../../utils/config';

const BoostingApi = createApi({
    reducerPath: 'boostingApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        createItem: builder.mutation({
            query: (newItem) => ({
                url: '/v1/create_boosting_creator',
                method: 'POST',
                body: newItem,
            }),
        }),
        getBoostingCreators: builder.query({
            query: () => "v1/get_boosting_creators",
            transformResponse: (response) => response?.data,
        }),
        getCreatorNames: builder.query({
            query: () => "v1/get_creator_names",
            transformResponse: (response) => response?.data,
        }),
    }),
});

export const { useCreateItemMutation, useGetBoostingCreatorsQuery, useGetCreatorNamesQuery } = BoostingApi;
export default BoostingApi;
