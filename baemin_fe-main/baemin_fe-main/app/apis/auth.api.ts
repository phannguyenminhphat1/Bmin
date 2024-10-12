import { AuthRequestBody } from '../types/auth.type'
import http from '../utils/http'

const authApi = {
  registerApi: (body: AuthRequestBody) => http.post('auth/register', body),
  loginApi: (body: Omit<AuthRequestBody, 'full_name' | 'email' | 'confirm_password' | 'phone_number'>) =>
    http.post('auth/login', body),
  logoutApi: () => http.post('auth/logout')
}

export default authApi
