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

// Chat Types
export interface CreateChatRequest {
  model_name: string;
  message_content: string;
}

export interface CreateChatResponse {
  Message: string;
  data: {
    id: number;
    owner: number;
    title: string;
    messages: any[];
    timestamp: string;
  };
}

export interface AddMessageRequest {
  chat_id: number;
  model_name: string;
  message_content: string;
}

export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  created_at: string;
}

export interface Chat {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  model_name?: string;
  last_message?: string;
  owner?: number;
  timestamp?: string;
}

export interface ChatContent {
  id: number;
  title: string;
  messages: Message[];
  model_name?: string;
  owner?: number;
  timestamp?: string;
}

export interface UpdateChatTitleRequest {
  title: string;
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
  tagTypes: ['UserProfile', 'ChatList', 'ChatContent'],
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
    // Chat Endpoints
    createChat: builder.mutation<CreateChatResponse, CreateChatRequest>({
      query: (data) => ({
        url: 'chat/create_chat/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ChatList'],
    }),
    addMessageToChat: builder.mutation<Message, AddMessageRequest>({
      query: (data) => ({
        url: 'chat/add_message_to_chat/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ChatContent', 'ChatList'],
    }),
    getUserChatList: builder.query<Chat[], void>({
      query: () => 'chat/get_users_chat_list/',
      providesTags: ['ChatList'],
    }),
    getChatContent: builder.query<ChatContent, number>({
      query: (chatId) => `chat/get_a_chat_content/${chatId}/`,
      providesTags: ['ChatContent'],
    }),
    updateChatTitle: builder.mutation<Chat, { chatId: number; title: string }>({
      query: ({ chatId, title }) => ({
        url: `chat/update_chat_title/${chatId}/`,
        method: 'PATCH',
        body: { title },
      }),
      invalidatesTags: ['ChatList', 'ChatContent'],
    }),
    deleteChat: builder.mutation<void, number>({
      query: (chatId) => ({
        url: `chat/delete_chat/${chatId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ChatList'],
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useLogoutMutation,
  useCreateChatMutation,
  useAddMessageToChatMutation,
  useGetUserChatListQuery,
  useGetChatContentQuery,
  useUpdateChatTitleMutation,
  useDeleteChatMutation,
} = authApi;