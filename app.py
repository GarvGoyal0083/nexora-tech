import os
from pathlib import Path
import streamlit as st
from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.errors import APIError

# Load environment variables from .env file
ENV_FILE_PATH = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=ENV_FILE_PATH, override=True)

# Page configuration
st.set_page_config(
    page_title="Gemini Q&A Assistant",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom styling
st.markdown(
    """
    <style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1rem;
        color: #6c757d;
        margin-bottom: 1.5rem;
    }
    .status-box {
        padding: 0.6rem 0.8rem;
        border-radius: 6px;
        font-size: 0.88rem;
        margin-bottom: 1rem;
    }
    .status-ok {
        background-color: #e6f4ea;
        color: #137333;
        border: 1px solid #ceead6;
    }
    .status-warn {
        background-color: #fef7e0;
        color: #b06000;
        border: 1px solid #feefc3;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

def get_configured_api_key() -> str:
    """Retrieves the API key from session state, .env, or Streamlit secrets."""
    # 1. User session override
    if st.session_state.get("session_api_key", "").strip():
        return st.session_state["session_api_key"].strip()

    # 2. Environment variable (.env)
    env_key = os.getenv("GEMINI_API_KEY", "").strip()
    if env_key:
        return env_key

    # 3. Streamlit Cloud Secrets (for deployed apps)
    try:
        if "GEMINI_API_KEY" in st.secrets:
            return str(st.secrets["GEMINI_API_KEY"]).strip()
    except Exception:
        pass

    return ""

def save_key_to_env(key: str):
    """Saves the provided API key to the .env file if writable."""
    try:
        with open(ENV_FILE_PATH, "w", encoding="utf-8") as f:
            f.write("# Google Gemini API Key\n")
            f.write(f"GEMINI_API_KEY={key.strip()}\n")
    except Exception:
        pass

active_key = get_configured_api_key()

# Sidebar configuration
with st.sidebar:
    st.title("⚙️ Settings")
    st.markdown("Configure your Gemini API settings below.")

    # API Key Section
    st.subheader("🔑 API Key")
    if active_key:
        st.markdown(
            """
            <div class="status-box status-ok">
                🔒 <b>API Key:</b> <code>Configured & Hidden</code>
            </div>
            """,
            unsafe_allow_html=True,
        )
        if st.button("🔄 Change / Reset API Key"):
            st.session_state["session_api_key"] = ""
            save_key_to_env("")
            st.rerun()
    else:
        st.markdown(
            """
            <div class="status-box status-warn">
                ⚠️ <b>GEMINI_API_KEY not configured</b>
            </div>
            """,
            unsafe_allow_html=True,
        )
        show_key = st.checkbox("Show key characters", value=False, key="side_show_key")
        entered_key = st.text_input(
            "Paste Gemini API Key",
            type="default" if show_key else "password",
            placeholder="AIzaSy...",
            help="Get your key from https://aistudio.google.com/app/apikey",
            key="sidebar_key_input",
        ).strip()

        col_s1, col_s2 = st.columns(2)
        if col_s1.button("💾 Save to .env", use_container_width=True, disabled=not entered_key):
            save_key_to_env(entered_key)
            st.success("Saved to .env!")
            st.rerun()
        if col_s2.button("Use for session", use_container_width=True, disabled=not entered_key):
            st.session_state["session_api_key"] = entered_key
            st.rerun()

    st.divider()

    # Model parameters
    st.subheader("🤖 Model Configuration")
    model_choice = st.selectbox(
        "Select Model",
        options=[
            "gemini-3.5-flash",
            "gemini-3.5-flash-lite",
            "gemini-3.8-flash",
            "gemini-3.5-pro",
        ],
        index=0,
        help="Gemini 3.5 Flash is recommended for fast, high-quality responses.",
    )

    temperature = st.slider(
        "Temperature",
        min_value=0.0,
        max_value=2.0,
        value=0.7,
        step=0.05,
        help="Higher values make output more creative, lower values make it more deterministic.",
    )

    enable_history = st.checkbox(
        "Multi-turn Memory",
        value=True,
        help="When enabled, previous questions and answers in this session are remembered for follow-ups.",
    )

    system_instruction = st.text_area(
        "System Instruction (Optional)",
        placeholder="e.g., You are an expert scientific tutor. Explain concepts clearly with examples.",
        help="Optional guidance to steer Gemini's tone or persona.",
    )

    st.divider()

    # Chat controls
    if st.button("🗑️ Clear Conversation", use_container_width=True):
        st.session_state.messages = []
        st.rerun()

    st.markdown(
        """
        ---
        <div style="font-size: 0.8rem; color: #888; text-align: center;">
            Powered by <b>Google GenAI SDK</b> & <b>Streamlit</b>
        </div>
        """,
        unsafe_allow_html=True,
    )

# Main app header
st.markdown('<div class="main-header">✨ Gemini Q&A Assistant</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="sub-header">Ask any question and receive intelligent answers powered by Google\'s Gemini models.</div>',
    unsafe_allow_html=True,
)

# Prominent setup screen if API key is missing
if not active_key:
    st.info(
        """
        ### 🔑 Enter your Gemini API Key to get started

        You can paste your API key below. You can obtain a free key at [Google AI Studio](https://aistudio.google.com/app/apikey).
        """
    )

    col_input, col_show = st.columns([4, 1])
    with col_show:
        show_chars = st.checkbox("Show characters", value=True, key="main_show_key")
    with col_input:
        direct_key = st.text_input(
            "Gemini API Key",
            type="default" if show_chars else "password",
            placeholder="Paste your API key here (starts with AIzaSy...)",
            label_visibility="collapsed",
            key="main_key_input",
        ).strip()

    col_btn1, col_btn2 = st.columns([1, 1])
    with col_btn1:
        if st.button("💾 Save Key to .env (Recommended)", use_container_width=True, type="primary"):
            if direct_key:
                save_key_to_env(direct_key)
                st.session_state["session_api_key"] = direct_key
                st.success("API Key saved to `.env` successfully! Reloading...")
                st.rerun()
            else:
                st.error("Please paste an API key first.")
    with col_btn2:
        if st.button("▶️ Use for this session only", use_container_width=True):
            if direct_key:
                st.session_state["session_api_key"] = direct_key
                st.rerun()
            else:
                st.error("Please paste an API key first.")

    st.markdown("---")
    st.markdown(
        """
        > **Trouble pasting?**
        > - Use keyboard shortcut: **`Ctrl + V`** (Windows) or **`Cmd + V`** (Mac).
        > - Alternatively, open the [`.env`](file:///c:/Users/garvg/OneDrive/Desktop/Equinox/.env) file in your editor or Notepad and paste `GEMINI_API_KEY=your_key` directly.
        """
    )
    st.stop()

# Initialize session state for chat messages
if "messages" not in st.session_state:
    st.session_state.messages = []

# Example prompt suggestions if conversation is empty
prompt_to_submit = None
if len(st.session_state.messages) == 0:
    st.info("💡 **Try asking one of these questions or type your own below:**")
    col1, col2, col3 = st.columns(3)
    example_prompts = [
        "Explain quantum computing in simple terms for a beginner.",
        "Write a Python script to find all duplicate files in a folder.",
        "What are the key architectural differences between REST and GraphQL?",
    ]
    if col1.button("⚛️ Quantum Computing", use_container_width=True):
        prompt_to_submit = example_prompts[0]
    if col2.button("🐍 Python Duplicates", use_container_width=True):
        prompt_to_submit = example_prompts[1]
    if col3.button("🌐 REST vs GraphQL", use_container_width=True):
        prompt_to_submit = example_prompts[2]

# Render existing messages
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# Handle user input (from chat input or quick prompt buttons)
user_query = st.chat_input("Ask a question...")
if prompt_to_submit:
    user_query = prompt_to_submit

if user_query:
    # Append and display user question
    st.session_state.messages.append({"role": "user", "content": user_query})
    with st.chat_message("user"):
        st.markdown(user_query)

    # Generate answer with Gemini
    with st.chat_message("assistant"):
        response_placeholder = st.empty()
        full_response = ""

        try:
            client = genai.Client(api_key=active_key)

            # Build generation config
            config_args = {"temperature": temperature}
            if system_instruction.strip():
                config_args["system_instruction"] = system_instruction.strip()
            config = types.GenerateContentConfig(**config_args)

            # Build contents (multi-turn history or single turn)
            if enable_history:
                contents = []
                for msg in st.session_state.messages:
                    role = "user" if msg["role"] == "user" else "model"
                    contents.append(
                        types.Content(
                            role=role,
                            parts=[types.Part.from_text(text=msg["content"])],
                        )
                    )
            else:
                contents = user_query

            # Call Gemini generate_content_stream
            stream = client.models.generate_content_stream(
                model=model_choice,
                contents=contents,
                config=config,
            )

            # Stream chunks as they arrive
            for chunk in stream:
                if chunk.text:
                    full_response += chunk.text
                    response_placeholder.markdown(full_response + "▌")

            response_placeholder.markdown(full_response)
            st.session_state.messages.append({"role": "assistant", "content": full_response})

        except APIError as e:
            error_message = getattr(e, "message", str(e))
            response_placeholder.error(
                f"**Gemini API Error:** {error_message}\n\n"
                "- Please check that your API key is valid and has Gemini API enabled.\n"
                "- Ensure your project has sufficient quota at https://aistudio.google.com/."
            )
        except Exception as e:
            response_placeholder.error(f"**Unexpected Error:** {str(e)}")
