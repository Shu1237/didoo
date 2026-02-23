import http from "@/lib/http";
import {
  LoginInput,
  LoginGoogleInput,
  RegisterInput,
  VerifyRegisterInput,
  ForgotPasswordInput,
  VerifyForgotPasswordInput,
  ChangeEmailInput,
  VerifyChangeEmailInput,
  ChangePasswordInput,
  LogoutInput,
  RefreshInput
} from "@/schemas/auth";

import { ENDPOINT_CLIENT, ENDPOINT_SERVER } from "@/utils/endpoint";
import { CredentialResponse } from "@react-oauth/google";

export const authRequest = {
  loginClient: (data: LoginInput) =>
    http.post<{ accessToken: string; refreshToken: string }>(
      ENDPOINT_CLIENT.LOGIN,
      data,
    ),
  loginServer: (body: { accessToken: string; refreshToken: string }) =>
    http.post(ENDPOINT_SERVER.LOGIN, body, {
      baseURL: "",
    }),
  loginGoogle: (data: LoginGoogleInput) =>
    http.post<{ accessToken: string; refreshToken: string }>(
      ENDPOINT_CLIENT.LOGIN_GOOGLE,
      data
    ),
  register: (data: Omit<RegisterInput, 'confirmPassword'>) =>
    http.post(ENDPOINT_CLIENT.REGISTER, data),
  verifyRegister: (data: VerifyRegisterInput) =>
    http.post(ENDPOINT_CLIENT.VERIFY_REGISTER, data),
  logoutClient: (data: LogoutInput) =>
    http.post(ENDPOINT_CLIENT.LOGOUT, data),
  logoutServer: () =>
    http.post(ENDPOINT_SERVER.LOGOUT, undefined, {
      baseURL: "",
    }),
  refreshTokenClient: (body: RefreshInput) =>
    http.post<{ accessToken: string, refreshToken: string }>(ENDPOINT_CLIENT.REFRESH, body, {
    }),
  refreshTokenServer: (body: { accessToken: string, refreshToken: string }) =>
    http.post<{ accessToken: string, refreshToken: string }>(ENDPOINT_SERVER.REFRESH, body, {
      baseURL: "",
    }),
  forgotPassword: (data: ForgotPasswordInput) =>
    http.post(ENDPOINT_CLIENT.FORGOT_PASSWORD, data),
  verifyForgotPassword: (data: Omit<VerifyForgotPasswordInput, 'confirmPassword'>) =>
    http.post(ENDPOINT_CLIENT.VERIFY_FORGOT_PASSWORD, data),
  changeEmail: (data: ChangeEmailInput) =>
    http.post(ENDPOINT_CLIENT.CHANGE_EMAIL, data),
  verifyChangeEmail: (data: VerifyChangeEmailInput) =>
    http.post(ENDPOINT_CLIENT.VERIFY_CHANGE_EMAIL, data),
  changePassword: (data: ChangePasswordInput) =>
    http.post(ENDPOINT_CLIENT.CHANGE_PASSWORD, data),
};
