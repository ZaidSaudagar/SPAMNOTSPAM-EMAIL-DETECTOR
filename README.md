# 📧 SPAM-NOTSPAM DETECTOR — Hybrid AI Email Classification

> A full-stack intelligent email security system that combines **Classic Machine Learning** with **Generative AI** for real-time spam detection.

---

## 📌 Overview

**SPAM-NOTSPAM DETECTOR** is a hybrid AI-powered tool designed to classify emails as **Spam** or **Not Spam** with high accuracy. It uses a dual-engine approach:

- **Primary Engine** — A Naive Bayes classifier trained on a labeled SMS/email dataset for instant, low-latency predictions.
- **Fallback Engine** — Google's Gemini Pro LLM, which activates automatically when the primary model is uncertain (confidence < 70%) or when manually triggered via the **AI Mode** toggle.

This intelligent routing ensures both **speed** (millisecond-level responses for clear-cut cases) and **accuracy** (deep semantic analysis for ambiguous content).

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 🔀 **Hybrid Detection** | Combines Naive Bayes (ML) + Gemini Pro (Gen AI) with automatic fallback |
| ⚡ **Real-Time API** | FastAPI backend with sub-second response times |
| 🧠 **AI Mode Toggle** | Force Gemini Pro analysis for maximum accuracy |
| 🎨 **Premium Dashboard** | Dark-themed UI with glassmorphism, animations, and responsive design |
| 📊 **Confidence Scoring** | Shows prediction confidence percentage alongside the verdict |
| 🔍 **Explainability** | Displays which method was used and why the email was flagged |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 16)                │
│         Dark UI · Glassmorphism · Framer Motion         │
│                  http://localhost:3000                   │
└──────────────────────┬──────────────────────────────────┘
                       │ POST /predict
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI)                     │
│                  http://localhost:8000                   │
│                                                         │
│   ┌───────────────┐    confidence < 70%    ┌──────────┐ │
│   │  Naive Bayes  │ ──────────────────────▶│  Gemini  │ │
│   │  (Primary)    │    or AI Mode ON       │  Pro API │ │
│   └───────────────┘                        └──────────┘ │
│         ▲                                               │
│         │                                               │
│   ┌─────────────┐                                       │
│   │ spam_model   │                                      │
│   │ .joblib      │                                      │
│   └─────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
SPAM-NOTSPAM DETECTOR/
├── server/                  # Backend — FastAPI + ML Engine
│   ├── app.py               # API server with /predict endpoint
│   ├── brain/
│   │   └── spam_model.joblib # Pre-trained Naive Bayes pipeline
│   └── .env                 # Gemini API key (not committed)
│
├── web/                     # Frontend — Next.js 16 Dashboard
│   ├── app/
│   │   ├── page.tsx         # Main UI (input, results, animations)
│   │   ├── layout.tsx       # Root layout with dark theme
│   │   └── globals.css      # Global styles + glassmorphism utilities
│   └── package.json
│
├── scripts/
│   └── rebuild_brain.py     # Script to retrain the ML model
│
├── dataset/
│   └── spam.csv             # Labeled dataset (5,572 samples)
│
└── requirements.txt         # Python dependencies
```

---

## 🚀 How to Run

### Prerequisites
- **Python 3.10+** — [Download](https://python.org)
- **Node.js 18+** — [Download](https://nodejs.org)
- **Google Gemini API Key** — [Get one free](https://aistudio.google.com/apikey) *(optional, only for AI Mode)*

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure API Key
Create or edit `server/.env`:
```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Start the Backend
```bash
cd server
python app.py
```
> Backend runs at **http://localhost:8000**

### 4. Start the Frontend *(new terminal)*
```bash
cd web
npm install
npm run dev
```
> Frontend runs at **http://localhost:3000**

### 5. Open the App
Navigate to **http://localhost:3000** — paste any email content and click **Check Now**.

---

## 🔌 API Reference

### `POST /predict`

Classify an email as spam or not spam.

**Request Body:**
```json
{
  "content": "Congratulations! You've won a free iPhone. Click here now!",
  "use_ai": false
}
```

**Response:**
```json
{
  "is_spam": true,
  "confidence": 0.97,
  "method": "Classic ML (Naive Bayes)",
  "explanation": "Detected using text pattern frequency."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `content` | string | The email text to analyze |
| `use_ai` | boolean | Force Gemini Pro analysis (default: `false`) |

### `GET /`
Health check endpoint. Returns `{ "status": "healthy" }`.

---

## 🧠 How It Works

1. **User submits email text** via the web dashboard.
2. **Naive Bayes pipeline** (CountVectorizer → MultinomialNB) makes an instant prediction.
3. **Decision logic** kicks in:
   - If confidence **≥ 70%** → return the ML result immediately.
   - If confidence **< 70%** or **AI Mode is ON** → forward to Gemini Pro for deeper analysis.
4. **Result displayed** with verdict (Spam / Not Spam), confidence %, method used, and explanation.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python, FastAPI, Uvicorn |
| **ML Model** | Scikit-learn (Naive Bayes + CountVectorizer Pipeline) |
| **Generative AI** | Google Gemini Pro via `google-generativeai` |
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **Icons** | Lucide React |
| **Dataset** | SMS Spam Collection (5,572 labeled messages) |

---

## 🔁 Retraining the Model

To retrain the Naive Bayes model on the dataset:

```bash
cd scripts
python rebuild_brain.py
```

This will generate a new `spam_model.joblib` from `dataset/spam.csv`.

---

## 🏁 Future Enhancements

- [ ] Add support for email file attachments (.eml, .msg)
- [ ] Implement scan history with local storage
- [ ] Export detection reports as PDF
- [ ] Add batch email scanning mode
- [ ] Deploy as a hosted web application

---

<div align="center">
  <sub>Built with 🛡️ for email security</sub>
</div>
