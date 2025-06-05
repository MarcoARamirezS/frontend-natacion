import axios from 'axios'
import { jwtDecode } from 'jwt-decode'


type Usuario = {
  id: string
  rol: 'admin' | 'coach' | string
}

type TokenPayload = {
  id: string
  rol: 'admin' | 'coach' | string
  iat?: number
  exp?: number
}

export const useAuth = () => {
  const token = useCookie<string | null>('token')
  const user = useState<Usuario | null>('user', () => null)

  const axiosInstance = useNuxtApp().$axios

  const login = async (usuario: string, password: string) => {
    try {
      const res = await axiosInstance.post('/users/login', { usuario, password })
      token.value = res.data.token

      const decoded = jwtDecode<TokenPayload>(res.data.token)
      user.value = {
        id: decoded.id,
        rol: decoded.rol,
      }

      return true
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        throw err 
      }
      throw new Error('Error desconocido al iniciar sesión')
    }
  }

  const logout = async () => {
    try {
      await axiosInstance.post('/users/logout', {}, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        throw err
      }
      throw new Error('Error desconocido al cerrar sesión')
    }
    token.value = null
    user.value = null
    return navigateTo('/')
  }

  return { token, user, login, logout }
}
