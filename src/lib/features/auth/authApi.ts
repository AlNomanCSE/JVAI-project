import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../store';

const BASE_URL = '/api/proxy/';

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access?: string;
  refresh?: string;
  accessToken?: string;
  idToken?: string;
  message?: string;
  email?: string;
  localId?: string;
}

export interface UserProfile {
  id: number;
  subscription_status: string;
  subscription_started_on: string | null;
  subscription_expires_on: string | null;
  created_at: string;
  name: string | null;
  is_individual: boolean;
  subscription_id: string | null;
  number_of_allowed_members: number;
  is_expired: boolean;
  active_refresh_token: string | null;
  active_device_ip: string | null;
  is_verified: boolean;
  otp: string | null;
  user: number;
  attached_management_account: number | null;
}

export interface UpdateUserProfileRequest {
  name?: string;
  subscription_status?: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['UserProfile'],
  endpoints: (builder) => ({
    signUp: builder.mutation<AuthResponse, SignUpRequest>({
      query: (credentials) => ({
        url: 'authentication_app/signup/',
        method: 'POST',
        body: credentials,
      }),
    }),
    signIn: builder.mutation<AuthResponse, SignInRequest>({
      query: (credentials) => ({
        url: 'authentication_app/signin/',
        method: 'POST',
        body: credentials,
      }),
    }),
    getUserProfile: builder.query<UserProfile, void>({
      query: () => 'authentication_app/user_profile/',
      providesTags: ['UserProfile'],
    }),
    updateUserProfile: builder.mutation<UserProfile, UpdateUserProfileRequest>({
      query: (data) => ({
        url: 'authentication_app/user_profile/',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['UserProfile'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'authentication_app/logout/',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useLogoutMutation,
} = authApi;