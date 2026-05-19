# 📰 NewsNova AI

> An AI-powered news platform with personalized recommendations, real-time chat, and smart authentication — built with React + FastAPI.

![NewsNova AI Banner](https://img.shields.io/badge/NewsNova-AI%20Powered-blue?style=for-the-badge&logo=newspaper)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🚀 Features

- 🤖 **AI-Powered News** — Personalized news feed based on your reading habits
- 💬 **Real-Time Chat** — Chat interface powered by AI for news discussions
- 🔐 **Authentication** — Secure login/signup with JWT-based auth
- 📌 **Smart Recommendations** — AI engine suggests articles tailored to your interests
- ⚡ **Blazing Fast** — Built with Vite for instant HMR and optimized builds
- 📱 **Responsive Design** — Fully responsive with Tailwind CSS

---

## 🗂️ Project Structure

```
newsnova-ai/
├── frontend/                  # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-based pages
│   │   ├── store/             # Zustand global state (auth, etc.)
│   │   ├── api/               # Axios API call handlers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/                   # FastAPI Python backend
    ├── app/
    │   ├── routers/
    │   │   ├── auth.py        # Authentication endpoints
    │   │   ├── chat.py        # Chat endpoints
    │   │   ├── news.py        # News fetch endpoints
    │   │   └── recommendations.py
    │   ├── models/
    │   ├── schemas/
    │   ├── core/              # Config, security, DB
    │   └── main.py            # FastAPI app entry point
    ├── requirements.txt
    └── .env.example
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React](https://react.dev/) | UI development |
| [Vite](https://vitejs.dev/) | Dev server & bundler |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Axios](https://axios-http.com/) | HTTP API calls |
| [React Router](https://reactrouter.com/) | Client-side routing |
| [Zustand](https://zustand-demo.pmnd.rs/) | State management (auth) |
| [Lucide React](https://lucide.dev/) | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | REST API framework |
| [Python 3.10+](https://www.python.org/) | Backend language |
| REST APIs | Auth, Chat, News, Recommendations |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js `v18+`
- Python `3.10+`
- `pip` or `pipenv`
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/Keshavjain12/newsnova-ai.git
cd newsnova-ai
```

---

### 2. Backend Setup

```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and secrets
```

**Start the backend server:**

```bash
uvicorn app.main:app --reload --port 8000
```

Backend will be live at: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env — set VITE_API_BASE_URL=http://localhost:8000
```

**Start the frontend dev server:**

```bash
npm run dev
```

Frontend will be live at: `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend `.env`
```env
SECRET_KEY=your_jwt_secret_key
NEWS_API_KEY=your_news_api_key
OPENAI_API_KEY=your_openai_key       # If using OpenAI for chat/recommendations
DATABASE_URL=sqlite:///./newsnova.db  # or PostgreSQL URL
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:8000
```

> ⚠️ **Never commit `.env` files to Git.** They are already listed in `.gitignore`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login & get JWT token |
| `GET` | `/news/feed` | Get personalized news feed |
| `GET` | `/news/search?q=` | Search news articles |
| `POST` | `/chat/message` | Send a message to AI chat |
| `GET` | `/recommendations/` | Get AI recommendations |

Full interactive API docs available at `/docs` when backend is running.

---

## 🏗️ Build for Production

### Frontend
```bash
cd frontend
npm run build
# Output will be in frontend/dist/
```

### Backend
```bash
# Use gunicorn for production
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Keshav Raj Jain**  
GitHub: https://github.com/Keshavjain12

---


