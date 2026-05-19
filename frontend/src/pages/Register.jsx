import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../api/axios"
import { Zap, CheckCircle } from "lucide-react"

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await api.post("/auth/register", form)
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed.")
    } finally {
      setLoading(false)
    }
  }

  const perks = [
    "Personalised AI news feed",
    "Smart recommendations",
    "AI chatbot assistant",
    "5 news categories",
  ]

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-card border-r border-border p-12">
        <div className="flex items-center gap-3">
          <Zap size={28} className="text-primary" fill="#E63946" />
          <span className="text-2xl font-black tracking-tight">News<span className="text-primary">Nova</span> AI</span>
        </div>
        <div>
          <h1 className="text-5xl font-black leading-tight mb-8">
            Your AI-powered<br />
            <span className="text-primary">news companion.</span>
          </h1>
          <div className="space-y-4">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <CheckCircle size={18} className="text-primary shrink-0" />
                <span className="text-gray-300">{perk}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-700 text-sm">Free forever. No credit card required.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <Zap size={22} className="text-primary" fill="#E63946" />
            <span className="text-xl font-black tracking-tight">News<span className="text-primary">Nova</span></span>
          </div>

          <h2 className="text-3xl font-black mb-2">Create account</h2>
          <p className="text-gray-500 mb-8">Join thousands of readers today</p>

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
                placeholder="johndoe"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-white placeholder-gray-700 focus:outline-none focus:border-primary transition-colors text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-white placeholder-gray-700 focus:outline-none focus:border-primary transition-colors text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-white placeholder-gray-700 focus:outline-none focus:border-primary transition-colors text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-red-600 active:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-40 text-sm tracking-wide mt-2"
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
