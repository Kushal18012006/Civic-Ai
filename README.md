# CivicAI — Future of Digital Governance

An award-winning, production-ready Generative AI civic companion built to simplify government services access. CivicAI bridges the gap between complex legal documents, eligibility requirements, and daily citizen needs.

---

## 🌟 Core Features

- **AI Citizen Assistant**: ChatGPT-like assistant powered by Gemini API, capable of answering citizen questions in multiple languages, listing required documents, and translating policy terms.
- **Government Services Explorer**: Searchable catalog of licenses, passports, water connections, and caste certificates with step-by-step guides and an **AI Simplify** drawer.
- **Smart Recommendation Engine**: Evaluates a citizen's profile (age, occupation, income, location, education) and computes matching subsidies or scholarships with tailored AI reasoning.
- **AI Document Assistant**: Simulates document file auditing, checking utility bills or IDs for expirations, formatting, and profile name mismatches.
- **Civic Issue Reporter**: Visual map coordinate pin placement, photo snap simulation, and AI routing to automatically write descriptions and route tasks to municipal departments (PWD, Sanitation, Water Board, etc.).
- **Interactive Timeline Tracker**: Monitor complaint lifecycles from filing to resolution with a simulator button to advance resolution stages during demonstrations.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Glassmorphic dark design tokens)
- **AI Model**: Google Gemini API (`gemini-1.5-flash`)
- **Authentication**: Supabase Auth (with a persistent LocalStorage simulation driver)
- **Animations**: Framer Motion
- **Icons**: Lucide Icons

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your `GEMINI_API_KEY` to connect to real-time generative capabilities. If left blank, CivicAI will run in **High-Fidelity AI Simulator Mode** automatically!

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ⏱️ 3-Minute Hackathon Demo Script

For hackathon judges, showcase the following continuous flow:

1. **Seamless Auth**: Go to the login screen and click **"Autofill Demo Credentials"** to log in instantly.
2. **Dashboard**: Highlight the personalized widgets, custom AI suggestions, and recent activity log.
3. **Scheme Matching**: Go to the **Scheme Matcher**, change the monthly income or change occupation to "Student", and click **"Recalculate Matches"** to show the percentages and AI match reasons update in real-time.
4. **AI Policy Simplifier**: Navigate to the **Service Explorer**, click "Fresh Passport Application", and tap **"Simplify Terms with AI"** to see legal requirements converted into plain language.
5. **Interactive Issue Reporting**: Navigate to **Report Issue**, click on the grid map to place coordinates, write a description (e.g. *"huge water leak on main crossing"*), and click **"Auto-Generate Complaint using AI"** to see automatic department routing and safety guidelines.
6. **Timeline Tracking**: Submit the complaint, click the reported ticket on the **Complaint Tracker**, and click **"Advance Stage (Demo Simulator)"** to step the complaint from "Submitted" to "Resolved" in seconds.
