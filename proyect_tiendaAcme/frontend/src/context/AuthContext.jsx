import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.exp * 1000 < Date.now()) {
        localStorage.clear()
        return null
      }
      return {
        accessToken: token,
        refreshToken: localStorage.getItem('refresh_token'),
        email: localStorage.getItem('user_email') || payload.sub,
        name: localStorage.getItem('user_name') || '',
        role: localStorage.getItem('user_role') || payload.role,
      }
    } catch {
      return null
    }
  })

  async function login(email, password) {
    const { data } = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('access_token',  data.accessToken)
    localStorage.setItem('refresh_token', data.refreshToken)
    localStorage.setItem('user_email',    data.email)
    localStorage.setItem('user_name',     data.name)
    localStorage.setItem('user_role',     data.role)
    setAuth({
      accessToken:  data.accessToken,
      refreshToken: data.refreshToken,
      email:  data.email,
      name:   data.name,
      role:   data.role,
    })
  }

  function logout() {
    api.post('/api/auth/logout', { refreshToken: auth?.refreshToken }).catch(() => {})
    localStorage.clear()
    setAuth(null)
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
