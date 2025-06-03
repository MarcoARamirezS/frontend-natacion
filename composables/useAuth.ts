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
    } catch (err) {
      console.error(err)
      return false
    }
  }

  const logout = async () => {
    try {
      await axiosInstance.post('/users/logout', {}, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
    // eslint-disable-next-line no-empty
    } catch {}
    token.value = null
    user.value = null
    return navigateTo('/')
  }

  return { token, user, login, logout }
}
