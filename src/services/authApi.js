import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { url } from "../utils.";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axios({ url: baseUrl + url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${url}/api/v1/auth`,
    withCredentials: true,
  }),
  endpoints: (build) => ({
    loginAdmin: build.mutation({
      query: (body) => {
        return {
          url: "/login",
          method: "POST",
          data: body,
        };
      },
    }),
    logout: build.mutation({
      query: (body) => {
        return {
          url: "/logout",
          method: "DELETE",
          data: body,
        };
      },
    }),
    showCurrentAdmin: build.mutation({
      query: (body) => {
        return {
          url: "/show-admin",
          method: "POST",
          data: body,
        };
      },
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useLogoutMutation,
  useShowCurrentAdminMutation,
} = authApi;
