import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../api/axios"
import { useAuthStore } from "../store/useAuthStore"
import { Eye, EyeOff, Zap } from "lucide-react"

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const setToken = useAuthStore((s) => s.setToken)
  const setUser = useAuthStore((s) => s.setUser)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      params.append("username", form.username)
      params.append("password", form.password)
      const res = await api.post("/auth/login", params)
      setToken(res.data.access_token)
      setUser({ username: form.username })
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-primary p-12">
        <div className="flex items-center gap-3">
          <Zap size={28} color="white" fill="white" />
          <span className="text-2xl font-black text-white tracking-tight">NewsNova AI</span>
        </div>
        <div>
          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            Stay ahead of<br />the news cycle.
          </h1>
          <p className="text-red-200 text-lg leading-relaxed">
            AI-powered news recommendations, real-time feeds, and an intelligent chatbot — all in one place.
          </p>
        </div>
        <div className="flex gap-4">
          {["50+ Sources", "5 Categories", "AI Powered"].map((tag) => (
            <span key={tag} className="bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <Zap size={22} className="text-primary" fill="#E63946" />
            <span className="text-xl font-black tracking-tight">News<span className="text-primary">Nova</span></span>
          </div>

          <h2 className="text-3xl font-black mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-8">Sign in to continue to your feed</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Username</label>
              <input
                type="text"
                placeholder="your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-white placeholder-gray-700 focus:outline-none focus:border-primary transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-white placeholder-gray-700 focus:outline-none focus:border-primary transition-colors text-sm pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-red-600 active:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm tracking-wide mt-2"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-8">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-semibold">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
