import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useAuthStore } from "../store/useAuthStore"
import {
  Zap, LogOut, Sparkles, MessageSquare, Globe,
  Cpu, TrendingUp, Trophy, RefreshCw, Send, ExternalLink,
  FlaskConical, Search
} from "lucide-react"

const CATEGORIES = ["all", "technology", "science", "business", "sports", "world"]

const CAT_STYLE = {
  technology: { bg: "bg-blue-500/10 border-blue-500/20 text-blue-400", dot: "bg-blue-400" },
  science:    { bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", dot: "bg-emerald-400" },
  business:   { bg: "bg-amber-500/10 border-amber-500/20 text-amber-400", dot: "bg-amber-400" },
  sports:     { bg: "bg-orange-500/10 border-orange-500/20 text-orange-400", dot: "bg-orange-400" },
  world:      { bg: "bg-purple-500/10 border-purple-500/20 text-purple-400", dot: "bg-purple-400" },
}

function CategoryBadge({ category }) {
  const style = CAT_STYLE[category]
  if (!style) return null
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${style.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {category}
    </span>
  )
}

function NewsCard({ article }) {
  return (
    <a
      href={article.source_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/50 hover:bg-white/[0.02] transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        {article.category && <CategoryBadge category={article.category} />}
        <ExternalLink size={14} className="text-gray-700 group-hover:text-primary transition-colors ml-auto" />
      </div>
      <h3 className="font-bold text-white group-hover:text-primary transition-colors leading-snug text-sm">
        {article.title}
      </h3>
      {article.content && (
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">{article.content}</p>
      )}
      {article.published_at && (
        <p className="text-gray-700 text-xs mt-auto pt-2 border-t border-border">
          {new Date(article.published_at).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          })}
        </p>
      )}
    </a>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 animate-pulse">
      <div className="h-3 bg-white/5 rounded-full w-1/4 mb-4" />
      <div className="h-4 bg-white/5 rounded-full w-full mb-2" />
      <div className="h-4 bg-white/5 rounded-full w-3/4 mb-4" />
      <div className="h-3 bg-white/5 rounded-full w-1/3" />
    </div>
  )
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("feed")
  const [news, setNews] = useState([])
  const [category, setCategory] = useState("all")
  const [newsLoading, setNewsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [interest, setInterest] = useState("")
  const [recLoading, setRecLoading] = useState(false)
  const [recError, setRecError] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Hi! I'm your AI news assistant. Ask me anything about today's headlines!" }
  ])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef(null)

  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  useEffect(() => { fetchNews() }, [category])
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [chatMessages])

  async function fetchNews() {
    setNewsLoading(true)
    try {
      const params = category !== "all" ? { category, limit: 20 } : { limit: 20 }
      const res = await api.get("/news/", { params })
      setNews(res.data)
    } catch {
      setNews([])
    } finally {
      setNewsLoading(false)
    }
  }

  async function fetchRecommendations() {
    if (!interest.trim()) {
      setRecError("Please enter a topic first.")
      return
    }
    setRecError("")
    setRecLoading(true)
    try {
      const res = await api.get("/recommend/", { params: { interest } })
      setRecommendations(res.data.recommended_news)
      if (res.data.recommended_news.length === 0) {
        setRecError("No articles found. Try fetching news from the backend first.")
      }
    } catch {
      setRecError("Failed to fetch recommendations.")
      setRecommendations([])
    } finally {
      setRecLoading(false)
    }
  }

  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return
    const question = chatInput
    setChatInput("")
    setChatMessages((p) => [...p, { role: "user", text: question }])
    setChatLoading(true)
    try {
      const res = await api.get("/chat/", { params: { question } })
      setChatMessages((p) => [...p, { role: "assistant", text: res.data.answer }])
    } catch {
      setChatMessages((p) => [...p, { role: "assistant", text: "Sorry, couldn't connect to the AI. Make sure Ollama is running." }])
    } finally {
      setChatLoading(false)
    }
  }

  const tabs = [
    { id: "feed", label: "Live Feed", icon: Globe },
    { id: "recommend", label: "For You", icon: Sparkles },
    { id: "chat", label: "AI Chat", icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-dark">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-border bg-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-primary p-1.5 rounded-lg">
              <Zap size={18} color="white" fill="white" />
            </div>
            <span className="font-black text-lg tracking-tight">
              News<span className="text-primary">Nova</span>
            </span>
          </div>

          <nav className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 bg-card border border-border px-3 py-2 rounded-xl">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-300">{user?.username}</span>
            </div>
            <button
              onClick={() => { logout(); navigate("/login") }}
              className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm font-medium"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* FEED */}
        {activeTab === "feed" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black">Live News Feed</h1>
                <p className="text-gray-600 text-sm mt-0.5">Latest from BBC across all categories</p>
              </div>
              <button
                onClick={fetchNews}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white border border-border hover:border-primary px-4 py-2 rounded-xl transition-all font-medium"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            <div className="flex gap-2 mb-8 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all border ${
                    category === cat
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                      : "border-border text-gray-500 hover:border-primary/50 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {newsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : news.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center mb-4">
                  <Globe size={28} className="text-gray-700" />
                </div>
                <p className="text-gray-400 font-semibold mb-1">No articles found</p>
                <p className="text-gray-700 text-sm mb-4">Run this command in your backend terminal to fetch news:</p>
                <code className="bg-card border border-border text-primary text-xs px-4 py-2 rounded-xl">
                  python -c "from app.database import SessionLocal; from app.services.news_fetcher import fetch_and_store_news; db=SessionLocal(); fetch_and_store_news(db); db.close()"
                </code>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {news.map((article) => <NewsCard key={article.id} article={article} />)}
              </div>
            )}
          </div>
        )}

        {/* FOR YOU */}
        {activeTab === "recommend" && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-black mb-1">For You</h1>
              <p className="text-gray-600 text-sm">AI-powered recommendations based on your interests</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 mb-6">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 block">
                What are you interested in?
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type="text"
                    placeholder="e.g. artificial intelligence, electric vehicles..."
                    value={interest}
                    onChange={(e) => {
                      setInterest(e.target.value)
                      setRecError("")
                    }}
                    onKeyDown={(e) => e.key === "Enter" && fetchRecommendations()}
                    className="w-full bg-dark border border-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <button
                  onClick={fetchRecommendations}
                  disabled={recLoading}
                  className="bg-primary hover:bg-red-600 active:scale-95 text-white font-bold px-5 py-3 rounded-xl transition-all disabled:opacity-40 flex items-center gap-2 text-sm shrink-0 cursor-pointer"
                >
                  {recLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Sparkles size={16} /> Find</>
                  )}
                </button>
              </div>
              {recError && (
                <p className="text-red-400 text-xs mt-3">{recError}</p>
              )}
            </div>

            {recommendations.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4">
                  Top {recommendations.length} matches for "{interest}"
                </p>
                {recommendations.map((rec, i) => (
                  <a
                    key={i}
                    href={rec.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-card border border-border rounded-2xl p-5 flex items-start gap-4 hover:border-primary/50 transition-all block"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors text-sm leading-snug mb-2">
                        {rec.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        {rec.category && <CategoryBadge category={rec.category} />}
                        <div className="flex items-center gap-1.5 ml-auto">
                          <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.round(rec.score * 100)}%` }}
                            />
                          </div>
                          <span className="text-gray-600 text-xs">{Math.round(rec.score * 100)}%</span>
                        </div>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-gray-700 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CHAT */}
        {activeTab === "chat" && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-black mb-1">AI News Chat</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <p className="text-gray-600 text-sm">Powered by Llama 3.2 · Running locally via Ollama</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col" style={{ height: "520px" }}>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Zap size={14} className="text-primary" fill="#E63946" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-white rounded-tr-sm font-medium"
                          : "bg-dark border border-border text-gray-200 rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Zap size={14} className="text-primary" fill="#E63946" />
                    </div>
                    <div className="bg-dark border border-border px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="border-t border-border p-4 flex gap-3 bg-dark/50">
                <input
                  type="text"
                  placeholder="Ask about any news topic..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-white placeholder-gray-700 focus:outline-none focus:border-primary transition-colors text-sm"
                />
                <button
                  onClick={sendChat}
                  disabled={chatLoading || !chatInput.trim()}
                  className="bg-primary hover:bg-red-600 text-white px-4 py-2.5 rounded-xl transition-all disabled:opacity-40 shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
