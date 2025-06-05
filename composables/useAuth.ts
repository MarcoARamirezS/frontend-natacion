import axios from 'axios'

export const useAuth = () => {
  const token = useCookie('token')
  const user = useState('user', () => null)
  const axiosInstance = useNuxtApp().$axios

  const login = async (usuario: string, password: string) => {
    try {
      const res = await axiosInstance.post('/users/login', { usuario, password })
      token.value = res.data.token
      user.value = res.data.user
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
