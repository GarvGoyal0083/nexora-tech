# ✨ Gemini Q&A Assistant (Streamlit)

A Streamlit web application that answers questions using the Google Gemini API.

## Features

- 🔑 **Secure API Key Management:** Reads `GEMINI_API_KEY` from a `.env` file (with optional manual override in the UI).
- 💬 **Interactive Q&A & Chat:** Modern chat interface with prompt suggestions and markdown rendering for code and text.
- ⚡ **Real-Time Streaming:** Streams responses token-by-token for responsive feedback.
- 🧠 **Multi-Turn Memory:** Toggle to enable conversational memory for follow-up questions.
- ⚙️ **Configurable Parameters:** Model selection (`gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-2.0-flash`, `gemini-1.5-flash`), temperature slider, and custom system instructions.

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have Python installed (Python 3.10+ recommended).

### 2. Install Dependencies

Install the required packages using `requirements.txt`:

```bash
py -m pip install -r requirements.txt
```
*(or `pip install -r requirements.txt`)*

### 3. Configure Gemini API Key

1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Open or create the `.env` file in the project folder:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

### 4. Run the Streamlit App

Start the app using:

```bash
py -m streamlit run app.py
```
*(or `streamlit run app.py`)*

The application will automatically open in your default web browser at `http://localhost:8501`.
