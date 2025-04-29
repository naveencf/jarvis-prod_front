import { createApi } from '@reduxjs/toolkit/query/react';
import authBaseQuery from '../../utils/authBaseQuery';
import { add } from 'date-fns';
import jwtDecode from 'jwt-decode';

export const reduxBaseURL = createApi({
  baseQuery: authBaseQuery,
  tagTypes: ['addVendor', 'addPaycycle', 'addPlatform', 'addPayMethod', 'whatsappLinkType', 'addBankName', 'addVendorMaster'],
  endpoints: (builder) => ({
    getnotAssignedVendors: builder.query({
      query: () => `notAssignedToPageVendors`,
    }),
    AddPmsVendorType: builder.mutation({
      query: (data) => ({
        // url: `addVendor`,
        url: `/v1/vendor_type`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['addVendor'],
    }),
    getAllVendorType: builder.query({
      // query: () => `getAllVendor`,
      query: () => `v1/vendor_type`,
      providesTags: ['addVendor'],
    }),

    getAllVendorWiseList: builder.query({
      query: () => 'v1/get_page_count_with_unique_vendor_name',
      transformResponse: (response) => response,
      keepUnusedDataFor: 0,
    }),

    updateVendorType: builder.mutation({
      query: (data) => ({
        // url: `updateVendor/${data._id}`,
        url: `/v1/vendor_type`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['addVendor'],
    }),
    addPmsPlatform: builder.mutation({
      query: (data) => ({
        url: `v1/vendor_platform`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['addPlatform'],
    }),

    getPmsPlatform: builder.query({
      query: () => `v1/vendor_platform`,
      providesTags: ['addPlatform'],
    }),
    updatePmsPlatform: builder.mutation({
      query: (data) => ({
        // url: `updatePlatform/${data._id}`,
        url: `v1/vendor_platform`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['addPlatform'],
    }),
    addPmsPaymentMethod: builder.mutation({
      query: (data) => ({
        // url: `addpayMethod`,
        url: `v1/payment_method`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['addPayMethod'],
    }),

    getPmsPaymentMethod: builder.query({
      query: () => `v1/payment_method`,
      providesTags: ['addPayMethod'],
      transformResponse: (res) => res.data,
    }),

    updatePmsPaymentMethod: builder.mutation({
      query: (data) => ({
        // url: `updatePay/${data._id}`,
        url: `v1/payment_method`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['addPayMethod'],
    }),
    addPmsPayCycle: builder.mutation({
      query: (data) => ({
        // url: `addPayCycle`,
        url: `v1/paycycle`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['addPaycycle'],
    }),
    getPmsPayCycle: builder.query({
      query: () => `v1/paycycle`,
      providesTags: ['addPaycycle'],
    }),

    updatePmsPayCycle: builder.mutation({
      query: (data) => ({
        // url: `updatePayCycle/${data._id}`,
        url: `v1/paycycle`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['addPaycycle'],
    }),

    //Vendor Whatsapp group
    addVendorWhatsappLinkType: builder.mutation({
      query: (data) => ({
        url: `v1/group_link_type`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['whatsappLinkType'],
    }),
    getVendorWhatsappLinkType: builder.query({
      query: () => `v1/group_link_type`,
      providesTags: ['whatsappLinkType'],
    }),
    updateVendorWhatsappLinkType: builder.mutation({
      query: (data) => ({
        url: `v1/group_link_type`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['whatsappLinkType'],
    }),
    getSingleBankDetail: builder.query({
      query: (data) => `v1/bank_details_by_vendor_id/${data}`,
      transformResponse: (res) => res.data,
    }),

    //venodr whatsapp group link
    getVendorWhatsappLink: builder.query({
      query: (id) => `v1/vendor_group_link_vendor_id/${id}`,
    }),

    //Country Code
    getCountryCode: builder.query({
      query: () => `v1/country_code`,
      transformResponse: (response) => response.data,
    }),
    addCountryCode: builder.mutation({
      query: (data) => ({
        url: `v1/country_code`,
        method: 'POST',
        body: data,
      }),
    }),
    updateCountryCode: builder.mutation({
      query: (data) => ({
        url: `v1/country_code`,
        method: 'PUT',
        body: data,
      }),
    }),

    getAllVendor: builder.query({
      queryFn: async ({ page, limit, search } = {}, _queryApi, _extraOptions, baseQuery) => {
        const storedToken = sessionStorage.getItem('token');
        if (!storedToken) {
          return { error: { status: 401, message: 'No token found' } };
        }

        const decodedToken = jwtDecode(storedToken);
        const userID = decodedToken.id;
        const roleToken = decodedToken.role_id;

        const queryParams = [];
        if (page) queryParams.push(`page=${page}`);
        if (limit) queryParams.push(`limit=${limit}`);
        if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        let res;
        if (roleToken === 1) {
          // If the user is an admin, fetch all vendor data with pagination and search
          res = await baseQuery({
            url: `v1/vendor${queryString}`,
            method: 'GET',
          });
        } else {
          // If the user is not an admin, fetch vendors based on their user ID with pagination and search
          const body = { user_id: userID };
          if (page) body.page = page;
          if (limit) body.limit = limit;
          if (search) body.search = search;

          res = await baseQuery({
            url: `v1/get_all_vendors_for_users`,
            method: 'POST',
            body,
          });
        }

        if (res.error) {
          return { error: res.error };
        }

        return { data: res.data.data || res.data };
      },
      keepUnusedDataFor: 60 * 60,
      providesTags: ['addVendorMaster'],
    }),
    getVendorsWithPagination: builder.query({
      queryFn: async ({ page, limit, search } = {}, _queryApi, _extraOptions, baseQuery) => {
        const storedToken = sessionStorage.getItem('token');
        if (!storedToken) {
          return { error: { status: 401, message: 'No token found' } };
        }
    
        const decodedToken = jwtDecode(storedToken);
        const userID = decodedToken.id;
        const roleToken = decodedToken.role_id;
    
        const queryParams = [];
        if (page) queryParams.push(`page=${page}`);
        if (limit) queryParams.push(`limit=${limit}`);
        if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
        let res;
        if (roleToken === 1) {
          res = await baseQuery({
            url: `v1/vendor${queryString}`,
            method: 'GET',
          });
        } else {
          const body = { user_id: userID };
          if (page) body.page = page;
          if (limit) body.limit = limit;
          if (search) body.search = search;
    
          res = await baseQuery({
            url: `v1/get_all_vendors_for_users`,
            method: 'POST',
            body,
          });
        }
    
        if (res.error) {
          return { error: res.error };
        }
    
        return { data: res.data || res.data };
      },
      keepUnusedDataFor: 60 * 60,
      providesTags: ['addVendorMaster'],
    }),
    
    
    addVendor: builder.mutation({
      query: (data) => ({
        url: `v1/vendor`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['addVendorMaster'],
    }),
    updateVenodr: builder.mutation({
      query: (data) => ({
        url: `v1/vendor/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['addVendorMaster'],
      transformErrorResponse: (error) => {
        return error.data;
      },
    }),

    // Bank Detail Api's:-
    getBankNameDetail: builder.query({
      query: () => `v1/bank_name`,
      providesTags: ['addBankName'],
    }),

    addBankNameDetail: builder.mutation({
      query: (data) => ({
        // url: `addPayCycle`,
        url: `v1/bank_name`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['addBankName'],
    }),

    updateBankNameDetail: builder.mutation({
      query: (data) => ({
        // url: `updatePayCycle/${data._id}`,
        url: `v1/bank_name`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['addBankName'],
    }),
    getVendorDocumentByVendorDetail: builder.query({
      query: (data) => ({
        url: `v1/vendor_wise_document_detail/${data}`,
      }),
      transformResponse: (response) => response.data,
    }),

    //vendor document
    addVendorDocument: builder.mutation({
      query: (data) => ({
        url: `v1/document_detail`,
        method: 'POST',
        body: data,
      }),
    }),

    updateVendorDocument: builder.mutation({
      query: (data) => ({
        url: `v1/document_detail/${data.get(_id)}`, // Include the _id in the endpoint
        method: 'PUT', // Use the PUT method for updating
        body: data, // Pass the updated data in the body
      }),
      invalidatesTags: ['addVendor'], // Invalidate relevant tags to refresh data
    }),

    //company name and details
    addCompanyData: builder.mutation({
      query: (data) => ({
        url: `v1/company_name`,
        method: 'POST',
        body: data,
      }),
    }),
    //upload csv file to get spreadsheet
    uploadExcel: builder.mutation({
      query: (formData) => ({
        url: `//192.168.2.28:8080/google_sheet_static_with_excel`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [],
    }),
  }),
});

export const { useGetnotAssignedVendorsQuery, useAddPmsVendorTypeMutation, useGetAllVendorTypeQuery, useUpdateVendorTypeMutation, useAddPmsPlatformMutation, useGetPmsPlatformQuery, useUpdatePmsPlatformMutation, useAddPmsPaymentMethodMutation, useGetPmsPaymentMethodQuery, useUpdatePmsPaymentMethodMutation, useAddPmsPayCycleMutation, useGetPmsPayCycleQuery, useUpdatePmsPayCycleMutation, useAddVendorWhatsappLinkTypeMutation, useGetVendorWhatsappLinkTypeQuery, useUpdateVendorWhatsappLinkTypeMutation, useGetSingleBankDetailQuery, useGetVendorWhatsappLinkQuery, useGetCountryCodeQuery, useAddCountryCodeMutation, useUpdateCountryCodeMutation, useGetAllVendorQuery, useGetVendorsWithPaginationQuery, useAddVendorMutation, useUpdateVenodrMutation, useGetBankNameDetailQuery, useAddBankNameDetailMutation, useUpdateBankNameDetailMutation, useGetVendorDocumentByVendorDetailQuery, useAddVendorDocumentMutation, useAddCompanyDataMutation, useGetAllVendorWiseListQuery, useUpdateVendorDocumentMutation, useUploadExcelMutation } =
  reduxBaseURL;
