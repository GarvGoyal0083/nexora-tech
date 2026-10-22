@echo off
cd /d "%~dp0"
echo Starting Gemini Q&A Assistant...
py -m streamlit run app.py
pause
