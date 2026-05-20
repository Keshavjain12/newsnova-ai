import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api/v1",
})

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("newsnova-auth")
  if (raw) {
    const parsed = JSON.parse(raw)
    const token = parsed?.state?.token
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
