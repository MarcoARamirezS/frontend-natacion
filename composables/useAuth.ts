import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

type Usuario = {
  id: string
  nombre: string
  apaterno: string
  amaterno: string
  telefono: string
  rol: 'admin' | 'coach' | string
}

type TokenPayload = {
  id: string
  rol: 'admin' | 'coach' | string
  nombre: string
  apaterno: string
  amaterno: string
  telefono: string
  iat?: number
  exp?: number
}

export const useAuth = () => {
  const token = useCookie<string | null>('token')
  const user = useState<Usuario | null>('user', () => null)
  const isRestored = useState<boolean>('authRestored', () => false)

  const axiosInstance = useNuxtApp().$axios

  const decodeToken = (tokenStr: string): TokenPayload | null => {
    try {
      return jwtDecode<TokenPayload>(tokenStr)
    } catch (error) {
      console.error('Error decodificando token:', error)
      return null
    }
  }

  // Restaurar usuario desde token (solo una vez)
  if (process.client && token.value && !user.value && !isRestored.value) {
    const decoded = decodeToken(token.value)
    if (decoded && (!decoded.exp || decoded.exp * 1000 > Date.now())) {
      user.value = {
        id: decoded.id,
        rol: decoded.rol,
        nombre: decoded.nombre,
        apaterno: decoded.apaterno,
        amaterno: decoded.amaterno,
        telefono: decoded.telefono,
      }
    } else {
      token.value = null
      user.value = null
    }
    isRestored.value = true
  }

  const login = async (usuario: string, password: string) => {
    try {
      const res = await axiosInstance.post('/users/login', { usuario, password })
      token.value = res.data.token

      const decoded = decodeToken(res.data.token)
      if (!decoded) throw new Error('Token inválido recibido')

      user.value = {
        id: decoded.id,
        rol: decoded.rol,
        nombre: decoded.nombre,
        apaterno: decoded.apaterno,
        amaterno: decoded.amaterno,
        telefono: decoded.telefono,
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
    } catch (err) {
      console.warn('Error al hacer logout:', err)
    } finally {
      token.value = null
      user.value = null
      isRestored.value = false

      await navigateTo('/', { replace: true })
    }
  }

  return { token, user, login, logout }
}
