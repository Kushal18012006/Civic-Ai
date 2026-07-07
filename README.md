# 🏛️ CivicAI – AI-Powered Digital Governance Platform

> A production-ready Generative AI platform that simplifies access to government services, helps citizens report civic issues, and provides personalized assistance through an intelligent AI companion.
>
> <img width="1917" height="908" alt="image" src="https://github.com/user-attachments/assets/d564fae5-d06e-4def-8718-481a61720720" />


---

## 📌 Problem Statement

Build a GenAI-powered civic platform that helps citizens access government services, report public issues, and receive personalized assistance through an intelligent AI companion.

The solution should:

- Simplify complex government information using Generative AI
- Answer citizen queries in natural language
- Recommend relevant government schemes and services
- Assist users with document requirements
- Enable complaint registration and tracking
- Provide multilingual support
- Promote transparency, accessibility, and digital inclusion

---

# 🚀 Our Solution

**CivicAI** is an intelligent citizen companion designed to make everyday interactions with government services faster, simpler, and more accessible.

Instead of searching through multiple government websites and lengthy documents, users can simply ask CivicAI questions in natural language. The platform explains policies, recommends eligible schemes, guides users through required documentation, and enables seamless civic issue reporting using AI.

---

# ✨ Key Features

## 🤖 AI Citizen Assistant

- Chat-based government assistance powered by Google Gemini
- Explains government policies in simple language
- Answers citizen queries instantly
- Recommends relevant government services
- Provides multilingual responses
- Maintains conversational context

---

## 🏛 Government Services Explorer

Browse government services including:

- Aadhaar Services
- PAN Card
- Passport
- Driving Licence
- Income Certificate
- Caste Certificate
- Water Connection
- Electricity Services
- Government Welfare Schemes

Each service includes:

- Eligibility
- Required Documents
- Processing Time
- Step-by-Step Guide
- AI Simplification
- Frequently Asked Questions

---

## 🎯 Personalized Scheme Recommendation

Based on:

- Age
- Occupation
- Income
- Education
- Location

CivicAI intelligently recommends:

- Scholarships
- Subsidies
- Government Schemes
- Financial Assistance Programs

along with AI-generated reasoning.

---

## 📄 AI Document Assistant

Helps citizens by:

- Verifying uploaded documents
- Checking document completeness
- Detecting missing requirements
- Identifying expired documents
- Explaining why each document is required

---

## 🚧 Smart Civic Issue Reporting

Users can report issues such as:

- Potholes
- Garbage Collection
- Water Leakage
- Street Light Failure
- Drainage Problems
- Public Cleanliness

Features include:

- Interactive location selection
- Photo upload simulation
- AI-generated complaint description
- Automatic department routing
- Complaint submission

---

## 📊 Complaint Tracking Dashboard

Track complaints through every stage:

- Submitted
- Under Review
- Assigned
- In Progress
- Resolved

Includes:

- Timeline View
- Department Assignment
- Resolution Progress
- Status Updates

---

## 🌐 Multilingual Support

Supports multilingual AI conversations to improve accessibility and digital inclusion.

---

# 🛠️ Tech Stack

| Category | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| AI | Google Gemini API |
| Authentication | Supabase Auth |
| Database | Supabase |
| Animations | Framer Motion |
| Icons | Lucide React |
| Deployment | Vercel |

---

# 🧩 System Architecture

```text
                  +----------------------+
                  |      Citizen         |
                  +----------+-----------+
                             |
                             v
                  +----------------------+
                  |   CivicAI Frontend   |
                  |  (Next.js + React)   |
                  +----------+-----------+
                             |
        +--------------------+--------------------+
        |                                         |
        v                                         v
+----------------------+              +----------------------+
|  Google Gemini API   |              |      Supabase        |
|  AI Assistant        |              | Auth + Database      |
+----------------------+              +----------------------+
        |                                         |
        +--------------------+--------------------+
                             |
                             v
                  +----------------------+
                  | Government Services  |
                  | Complaint System     |
                  | Scheme Matching      |
                  | Document Guidance    |
                  +----------+-----------+
                             |
                             v
                  +----------------------+
                  | Citizen Dashboard    |
                  +----------------------+
```

# 📂 Project Structure

```
app/
components/
hooks/
lib/
services/
types/
utils/
public/
styles/

README.md
package.json
.env.example
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/your-username/civicai.git
```

Move into the project

```bash
cd civicai
```

Install dependencies

```bash
npm install
```

Create environment variables

```bash
cp .env.example .env.local
```

Add your Gemini API Key

```env
GEMINI_API_KEY=your_api_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

Start Development Server

```bash
npm run dev
```

Visit

```
http://localhost:3000
```

---

# 🌍 Live Demo

> https://civic-ai-rouge.vercel.app/

---

# 💻 GitHub Repository

https://github.com/Kushal18012006/Civic-Ai

---

# 🎬 3-Minute Demo Flow

### 1️⃣ Login

Use the Demo Login to access the dashboard instantly.

---

### 2️⃣ AI Assistant

Ask questions like:

> "I'm a student from Uttar Pradesh. Which scholarships am I eligible for?"

Watch Gemini generate a personalized response.

---

### 3️⃣ Scheme Recommendation

Update income, occupation, or education and observe AI-powered recommendations update dynamically.

---

### 4️⃣ Government Service Explorer

Open a service such as Passport or Income Certificate.

Click **"Simplify with AI"** to convert complex government terminology into easy-to-understand language.

---

### 5️⃣ Report Civic Issue

Select a location.

Describe the issue.

Click

> **Auto Generate Complaint using AI**

Watch CivicAI:

- Generate a professional complaint
- Classify the issue
- Route it to the correct department

---

### 6️⃣ Complaint Tracker

Advance the complaint through different stages to demonstrate the complete lifecycle.

---


# 🧠 How Generative AI is Used

- Natural Language Conversations
- Government Policy Simplification
- Personalized Scheme Recommendations
- Complaint Draft Generation
- Document Guidance
- Multilingual Assistance

---

# 📝 Prompt Workflow / Strategy

The project was developed using a structured prompting approach in Antigravity to ensure high-quality code generation, clean architecture, and production-ready deployment.

### Step 1: Problem Analysis
- Analyzed the hackathon problem statement.
- Identified target users, pain points, and key requirements.
- Defined the MVP features and user journey.

### Step 2: Product Planning
- Designed the application architecture.
- Planned the database schema and authentication flow.
- Selected the technology stack (Next.js, Supabase, Gemini API, Tailwind CSS).

### Step 3: AI-Assisted Application Generation
- Used Antigravity to generate the initial full-stack application.
- Focused on modular architecture, reusable components, and responsive design.

### Step 4: Iterative Refinement
- Improved the UI/UX.
- Localized the platform for Indian government services.
- Refined AI prompts for better citizen assistance and recommendations.
- Enhanced responsiveness and accessibility.

### Step 5: Deployment & Validation
- Tested the application locally.
- Deployed on Vercel.
- Published the source code on GitHub.
- Verified the production build and overall functionality.

## 🔄 Prompt Workflow Diagram

```text
           Problem Statement
                   │
                   ▼
         Requirement Analysis
                   │
                   ▼
         Prompt Engineering
                   │
                   ▼
     Antigravity Code Generation
                   │
                   ▼
         Manual Refinement
      (UI, Localization, README)
                   │
                   ▼
       Testing & Deployment
                   │
                   ▼
          GitHub + Vercel
```


# ♿ Accessibility

Designed following accessibility best practices:

- Responsive Layout
- Keyboard Navigation
- High Contrast UI
- Large Touch Targets
- WCAG-friendly Components

---

# 🔒 Security

- Secure Authentication
- Environment Variables
- Protected Routes
- Input Validation
- Safe API Integration

---

# 📈 Future Improvements

- OCR for real government documents
- Voice Assistant
- Speech-to-Text
- Real Government API Integration
- Push Notifications
- Aadhaar-based Authentication
- Real Complaint Tracking
- AI-powered Document Verification

---

# 📸 Screenshots


## 🏠 Dashboard

<img width="1917" alt="Dashboard" src="https://github.com/user-attachments/assets/c92e1239-5295-4704-a371-cce34fadf070" />

---

## 🤖 AI Assistant

<img width="525" alt="AI Assistant" src="https://github.com/user-attachments/assets/d115a5da-1f10-4ac1-ad8d-bccc0f0cac11" />

---

## 🚧 Report Civic Issue

<img width="1917" alt="Report Civic Issue" src="https://github.com/user-attachments/assets/a5a6ab26-f638-43fe-b71c-b4ce5700653f" />

---

## 📊 Complaint Tracker

<img width="1917" alt="Complaint Tracker" src="https://github.com/user-attachments/assets/9f4ac594-860f-42dc-81f6-f76474ff30c7" />
---

# 👨‍💻 Developed For

**PromptWar Hackathon 2026**

### Theme

> GenAI for Digital Governance

---

## ⭐ If you like this project, consider giving it a star!
