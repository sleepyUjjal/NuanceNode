# NuanceNode

NuanceNode is a structured claim-analysis system built for people who want more than a one-shot chatbot answer. Instead of responding with a single paragraph, it breaks a claim into multiple reasoning layers, compares source quality, examines the logic behind the claim, and produces a final verdict with a context tree and downloadable report.

## Why It Is Necessary

Information overload makes it easy to confuse confidence with accuracy. Viral claims, headlines, screenshots, and opinion threads often mix partial truth, weak evidence, emotional framing, and flawed reasoning. A normal chatbot can still be useful here, but it usually answers in one pass and in one voice. That often hides how it arrived at the conclusion.

NuanceNode is necessary because it is designed to slow that process down in a useful way:

- It separates fact extraction, source review, logic review, and belief dynamics instead of blending everything together.
- It gives users a structured explanation of why a claim may appear true, why it may be false, and what evidence is still missing.
- It preserves analysis history and lets users revisit past investigations instead of losing everything in a single chat thread.
- It produces a report-oriented output that is easier to review, compare, and share than a typical conversational answer.

In short, the goal is not just to answer a claim, but to make the reasoning inspectable.

## How It Works

NuanceNode uses a React frontend and a FastAPI backend with authenticated user history and report generation.

### High-Level Flow

1. A user signs in and submits a claim.
2. The backend runs a multi-step analysis pipeline.
3. The result is saved to the user’s history.
4. The frontend presents the verdict, node-by-node reasoning, and a context tree.
5. The user can download the analysis as a PDF report.

### Analysis Pipeline

The backend uses a local LLM through Ollama and organizes the reasoning into multiple nodes:

- `Facts Node`
  Focuses on factual observations, supporting evidence, contradictions, and open questions.
- `Sources Node`
  Reviews the quality of available source signals and separates stronger sources from weaker or incomplete ones.
- `Logic Node`
  Tests whether the claim is actually supported by the evidence, and highlights assumptions, weaknesses, and fallacies.
- `Anatomy of Belief Node`
  Examines why people may believe or spread the claim, including emotional and cognitive factors.
- `Verdict Layer`
  Merges the above outputs into a final verdict and confidence score.
- `Context Tree`
  Shows the strongest arguments for and against the claim in a structured, inspectable format.

### Supporting Features

- User authentication and personal analysis history
- Claim retrieval from a user’s past analyses for better contextual continuity
- Live search context for source-aware review
- PDF report generation for saved analyses
- A staged frontend loader that makes long-running analysis easier to follow

## Who The Target Users Are

NuanceNode is best suited for people who need structured claim analysis rather than casual chat.

### Primary Users

- Students who want to examine news, viral claims, or controversial statements more critically
- Researchers and analysts who want a quick first-pass reasoning framework before deeper manual verification
- Journalists or content reviewers who need a repeatable way to inspect claims and weak evidence
- Educators teaching media literacy, critical thinking, or misinformation awareness
- Curious general users who want a more disciplined answer than a normal chatbot reply

### Especially Useful For

- Claims that spread because they sound plausible
- Topics where weak sources create false confidence
- Situations where users want to see reasoning structure, not just the final answer

## How It Is Different From Asking ChatGPT Or Gemini

Even with a strong prompt, ChatGPT or Gemini usually behave like highly capable general assistants. They are optimized to answer the user in a coherent and helpful way, but not necessarily to preserve a visible analysis structure every time.

NuanceNode is different by design.

### 1. It Is Workflow-Driven, Not Just Prompt-Driven

With a general chatbot, the quality of the answer depends heavily on the exact prompt, the follow-up questions, and whether the user knows how to ask for source separation, uncertainty handling, counterarguments, and reasoning checks.

NuanceNode bakes that structure into the system itself. The user does not need to manually prompt for:

- separate fact review
- source-quality analysis
- logic testing
- belief dynamics
- a context tree of arguments for and against the claim

### 2. It Produces Inspectable Reasoning

A good chatbot prompt can ask for a balanced answer, but the result is still often a single blended response. NuanceNode intentionally decomposes the analysis into explicit layers so the user can inspect where the verdict is coming from.

That makes it easier to ask:

- Is the weakness factual or logical?
- Are the sources poor, or is the claim merely incomplete?
- Is this persuasive because of evidence, or because of framing?

### 3. It Is Better For Repeatable Claim Reviews

Chatbots are conversation-first tools. NuanceNode is analysis-first. It stores past claims, keeps reports tied to a user account, and supports downloading a report. That makes it more useful when users want continuity, comparison, and review over time.

### 4. It Is More Explicit About Uncertainty

A general chatbot can sometimes sound polished even when evidence is weak. NuanceNode is built to surface uncertainty as part of the output. It is designed to show what is known, what is weak, what is missing, and why a claim may still feel convincing despite poor support.

### 5. It Is A Specialized Product, Not A General Assistant

ChatGPT and Gemini are broad tools for writing, coding, brainstorming, summarizing, and much more. NuanceNode is intentionally narrower. Its strength comes from being specialized for structured claim investigation.

That specialization is the difference:

- ChatGPT or Gemini answer many things well.
- NuanceNode is designed to investigate claims in a disciplined format.

## Current Stack

- Frontend: React + Vite
- Backend: FastAPI
- Database: SQLAlchemy + Supabase
- Model runtime: Ollama
- Reporting: PDF generation

### Frontend: React + Vite

The frontend is built with React and bundled with Vite.

- React is used to create a modular interface for authentication, claim submission, history review, phase-based loading, report viewing, and PDF downloads.
- Vite keeps local development fast and lightweight, which is useful when iterating on UI behavior around long-running model calls.
- The frontend is intentionally structured around reusable modules so the product can evolve from a single-page prototype into a more maintainable application.

### Backend: FastAPI

The backend is built with FastAPI and acts as the orchestration layer for the entire system.

- It exposes the authentication routes, claim analysis route, user history route, and protected PDF download route.
- It coordinates the multi-step analysis pipeline instead of letting the frontend talk directly to the model layer.
- FastAPI is a good fit here because the project is API-first, typed, and structured around clear request-response flows.

### Database Layer: SQLAlchemy + MySQL / Supabase Postgres

NuanceNode uses SQLAlchemy as the ORM and can work with either MySQL or Supabase Postgres.

- SQLAlchemy handles the application-side models, sessions, and database interaction.
- Supabase Postgres stores users, analyzed claims, timestamps, and saved analysis reports.
- This matters because NuanceNode is not just a transient chatbot session. It keeps a user-linked history of investigations and supports revisiting previous reports.

### Local LLM Runtime: Ollama

The model layer runs through Ollama, which allows the project to use local models instead of relying entirely on a hosted API.

- The backend sends structured prompts to the local model for facts, sources, logic, anatomy of belief, and final verdict generation.
- Running locally gives more control over experimentation, privacy, and cost.
- It also makes the system feel more like a specialized analysis engine rather than a wrapper around a generic cloud chatbot.

### Retrieval and Source Context

NuanceNode does not rely on a single prompt in isolation. It enriches the model with additional context before generating the final output.

- Prior user analysis history can be retrieved and reused as limited background context.
- Live search context is fetched to improve source awareness and reduce purely model-internal reasoning.
- This helps the verdict feel more grounded than a one-pass model answer.

### Report Generation

The system includes PDF report generation so an analysis becomes a reusable artifact rather than only an on-screen response.

- Each completed analysis can be downloaded as a formatted report.
- This makes the tool more useful for students, researchers, and reviewers who need to save or share investigations.

### Why This Stack Makes Sense For NuanceNode

This stack is well-suited to the product because each layer has a distinct responsibility:

- React handles the user experience and modular interface.
- FastAPI handles orchestration and API boundaries.
- SQLAlchemy and MySQL / Supabase Postgres handle persistence and user-linked history.
- Ollama handles local reasoning and claim analysis.
- The PDF layer turns the result into a usable report.

Together, the stack supports a product that is more structured, inspectable, and repeatable than a normal chatbot workflow.

## Setup

The project has two main parts:

- `backend/` for the FastAPI API, model orchestration, database access, and PDF generation
- `frontend/` for the React user interface

### Prerequisites

Before running the project, make sure you have:

- Python 3.11 or 3.12 recommended
- Node.js and npm
- A database connection, either:
  - MySQL running locally, or
  - a Supabase Postgres connection string
- Ollama installed and running locally

### 1. Clone The Project

```bash
git clone "https://github.com/sleepyUjjal/NuanceNode.git"
cd NuanceNode
```

### 2. Set Up The Backend

Create a virtual environment and install the backend dependencies:

```bash
cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

### 3. Configure Backend Environment Variables

For local MySQL, configure the MySQL variables.

For Supabase, prefer a direct environment URL:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
```

The backend will automatically use `DATABASE_URL` when it is present.

### 4. Supabase Setup & RLS Hardening (Crucial)

If you are using Supabase, you must run the master setup script to ensure the security rules and table upgrades are applied. The backend creates tables on its own via SQLAlchemy, but it cannot apply security rules.

Run the SQL in:

- [01_master_setup.sql](NuanceNode/backend/sql/01_master_setup.sql)

This script is fully idempotent. It will:
- Safely update the database for the 3-table robust Auth system.
- Enable RLS on `public.users` and `public.chats`.
- Revoke `anon` and `authenticated` access from those tables to prevent unauthorized public read/writes via the Supabase Javascript API.
- Keep server-side `service_role` access available for FastAPI.

Create a `backend/.env` file with values like these:

```env
# Fast API & Security
JWT_SECRET_KEY="your-secret-key"
JWT_ALGORITHM="HS256"
JWT_EXPIRATION_TIME_MINUTES=1440

# Database
DB_USER="your_mysql_user"
DB_PASSWORD="your_mysql_password"
DB_HOST="localhost"
DB_NAME="nuancenode_db"

# Authentication Features
SMTP_EMAIL="your.email@gmail.com"
SMTP_PASSWORD="your-16-digit-app-password"
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"

OLLAMA_MODEL="mistral:7b"
OLLAMA_TEMPERATURE=0.1
OLLAMA_NUM_CTX=4096

API_BASE_URL="http://127.0.0.1:8000"
FRONTEND_BASE_URL="http://localhost:5173"
```

Notes:

- `JWT_SECRET_KEY` is required.
- `DB_NAME` should already exist in MySQL before you start the app.
- `OLLAMA_MODEL` should match a model you have already pulled locally.

### 4. Prepare The MySQL Database

Create the database in MySQL if it does not already exist:

```sql
CREATE DATABASE nuancenode_db;
```

The backend currently creates the tables on startup.

### 5. Start Ollama

Run Ollama locally and pull the model you want to use:

```bash
ollama serve
```

In another terminal:

```bash
ollama pull YOUR_PREFERRED_MODEL
```

If you choose a different model, update `OLLAMA_MODEL` in `backend/.env`.

### 6. Run The Backend

From the `backend/` folder:

```bash
source env/bin/activate
uvicorn main:app --reload
```

The backend should start on:

```text
http://127.0.0.1:8000
```

### 7. Set Up The Frontend

In a new terminal:

```bash
cd frontend
npm install
```

If needed, create a frontend environment file such as `frontend/.env`:

```env
VITE_API_URL="http://127.0.0.1:8000"
VITE_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
```

### 8. Run The Frontend

From the `frontend/` folder:

```bash
npm run dev
```

The frontend should start on:

```text
http://localhost:5173
```

### 9. Typical Local Run Flow

To run the project locally, you generally need three things active at the same time:

1. MySQL
2. Ollama
3. Backend and frontend dev servers

### 10. Useful Commands

Backend:

```bash
cd backend
source env/bin/activate
uvicorn main:app --reload
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run lint
```

Ollama:

```bash
ollama serve
ollama list
ollama pull YOUR_PREFERRED_MODEL
```

### 11. Setup Notes

- If the backend fails on startup, first check MySQL connection settings and whether Ollama is running.
- If login or analysis requests fail from the frontend, check that `VITE_API_URL` points to the backend correctly.
- If you use a different local port for frontend or backend, update the corresponding environment variables.
- It is a good idea to keep `.env` files out of version control and use sample values only in documentation.

## Project Goal

NuanceNode is not trying to replace expert fact-checkers, researchers, or formal verification. Its purpose is to help users reason better, inspect claims more carefully, and reduce the chance of accepting confident-sounding misinformation at face value.

The core idea is simple:

Ask less like a chatbot. Investigate more like a system.
