import base64
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
    page_title="Gemini AI Assistant",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom modern CSS for ChatGPT / Claude / Gemini aesthetic
st.markdown(
    """
    <style>
    /* Global styles and typography */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Main container max-width for modern chat experience */
    .block-container {
        max-width: 860px;
        padding-top: 2rem;
        padding-bottom: 5rem;
    }

    /* Gemini gradient title */
    .hero-title {
        font-size: 2.6rem;
        font-weight: 700;
        background: linear-gradient(135deg, #4285F4 0%, #9B72CB 50%, #D96570 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.3rem;
        line-height: 1.2;
    }

    .hero-subtitle {
        font-size: 1.15rem;
        color: #9aa0a6;
        margin-bottom: 2rem;
        font-weight: 400;
    }

    /* Status badge */
    .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 0.82rem;
        font-weight: 500;
        margin-bottom: 1rem;
    }
    .status-ok {
        background-color: rgba(52, 168, 83, 0.15);
        color: #81c995;
        border: 1px solid rgba(52, 168, 83, 0.3);
    }
    .status-warn {
        background-color: rgba(251, 188, 4, 0.15);
        color: #fdd663;
        border: 1px solid rgba(251, 188, 4, 0.3);
    }

    /* Message bubbles */
    .stChatMessage {
        border-radius: 16px;
        padding: 1rem;
        margin-bottom: 1rem;
    }

    /* File badge inside chat */
    .file-attachment-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 0.82rem;
        color: #d1d5db;
        margin-bottom: 8px;
    }

    /* Style the chat input bar for ChatGPT/Claude look */
    div[data-testid="stChatInput"] {
        border-radius: 24px;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

def get_configured_api_key() -> str:
    """Retrieves API key from session state, .env, or Streamlit secrets."""
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

def format_chat_for_export(messages) -> str:
    """Formats full chat history into markdown format for export."""
    lines = ["# 💬 Gemini AI Chat Export\n"]
    for i, msg in enumerate(messages, 1):
        role_label = "🧑 **User**" if msg["role"] == "user" else "✨ **Gemini Assistant**"
        lines.append(f"### {role_label}\n")
        if "files" in msg and msg["files"]:
            file_names = ", ".join([f["name"] for f in msg["files"]])
            lines.append(f"*Attached files: {file_names}*\n")
        lines.append(f"{msg['content']}\n")
        lines.append("---\n")
    return "\n".join(lines)

active_key = get_configured_api_key()

# Initialize session state variables
if "messages" not in st.session_state:
    st.session_state.messages = []

# Sidebar configuration
with st.sidebar:
    st.markdown("### ⚙️ Settings")

    # API Key Section
    if active_key:
        st.markdown(
            """
            <div class="status-badge status-ok">
                <span>🔒</span> <b>API Key Configured & Protected</b>
            </div>
            """,
            unsafe_allow_html=True,
        )
        with st.expander("🔑 Change API Key"):
            new_key = st.text_input("New API Key", type="password", key="new_key_input")
            if st.button("Update Key", use_container_width=True):
                if new_key.strip():
                    save_key_to_env(new_key.strip())
                    st.session_state["session_api_key"] = new_key.strip()
                    st.success("Key updated!")
                    st.rerun()
    else:
        st.markdown(
            """
            <div class="status-badge status-warn">
                <span>⚠️</span> <b>API Key Missing</b>
            </div>
            """,
            unsafe_allow_html=True,
        )
        entered_key = st.text_input("Enter Gemini API Key", type="password", key="side_key_input")
        if st.button("Save Key", use_container_width=True, disabled=not entered_key):
            save_key_to_env(entered_key.strip())
            st.session_state["session_api_key"] = entered_key.strip()
            st.rerun()

    st.markdown("---")

    # Model parameters
    st.subheader("🤖 Model")
    model_choice = st.selectbox(
        "Select Model",
        options=[
            "gemini-3.5-flash",
            "gemini-3.5-flash-lite",
            "gemini-3.8-flash",
            "gemini-3.5-pro",
        ],
        index=0,
        help="Gemini 3.5 Flash is Google's recommended high-speed multimodal model.",
    )

    temperature = st.slider(
        "Creativity (Temperature)",
        min_value=0.0,
        max_value=2.0,
        value=0.7,
        step=0.05,
        help="Higher values make responses more diverse and creative.",
    )

    enable_history = st.checkbox(
        "Multi-turn Memory",
        value=True,
        help="Maintains context from previous messages in the conversation.",
    )

    with st.expander("🎭 Custom Persona / Instructions"):
        system_instruction = st.text_area(
            "System Prompt",
            placeholder="e.g. You are a senior software engineer. Answer questions concisely with production-ready code.",
            help="Custom instructions to guide Gemini's persona.",
        )

    st.markdown("---")

    # Action buttons
    col_clear, col_export = st.columns(2)
    with col_clear:
        if st.button("🗑️ Clear", use_container_width=True):
            st.session_state.messages = []
            st.rerun()
    with col_export:
        if st.session_state.messages:
            full_chat_md = format_chat_for_export(st.session_state.messages)
            st.download_button(
                "📥 Export",
                data=full_chat_md,
                file_name="gemini_conversation.md",
                mime="text/markdown",
                use_container_width=True,
                help="Export entire conversation as Markdown file",
            )
        else:
            st.button("📥 Export", disabled=True, use_container_width=True)

    st.markdown(
        """
        <div style="font-size: 0.75rem; color: #70757a; text-align: center; margin-top: 1.5rem;">
            Powered by <b>Gemini API</b> & <b>Streamlit</b>
        </div>
        """,
        unsafe_allow_html=True,
    )

# Alert if API key is not configured
if not active_key:
    st.markdown('<div class="hero-title">✨ Welcome to Gemini AI</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="hero-subtitle">To get started, please provide your Google Gemini API key.</div>',
        unsafe_allow_html=True,
    )

    with st.container():
        st.info(
            """
            **Get your API key in 30 seconds:**
            1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and generate a free API key.
            2. Paste it in the field below and click **Save & Continue**.
            """
        )
        col1, col2 = st.columns([4, 1])
        with col1:
            direct_key = st.text_input(
                "Gemini API Key",
                type="password",
                placeholder="Paste key here (starts with AIzaSy... or AQ...)",
                label_visibility="collapsed",
            ).strip()
        with col2:
            if st.button("Save & Continue", type="primary", use_container_width=True):
                if direct_key:
                    save_key_to_env(direct_key)
                    st.session_state["session_api_key"] = direct_key
                    st.success("API key saved!")
                    st.rerun()
                else:
                    st.error("Please enter a key.")
    st.stop()

# Header when chat is empty
if len(st.session_state.messages) == 0:
    st.markdown('<div class="hero-title">✨ How can I help you today?</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="hero-subtitle">Ask questions, analyze images & documents, inspect code, or brainstorm ideas.</div>',
        unsafe_allow_html=True,
    )

    # Prompt Suggestion Cards
    c1, c2 = st.columns(2)
    suggested_prompt = None

    with c1:
        if st.button("⚛️  Explain Quantum Computing\n\nBreak it down for a beginner with simple analogies.", use_container_width=True):
            suggested_prompt = "Explain quantum computing in simple terms for a beginner, with clear everyday analogies."
        st.write("")
        if st.button("🐍  Write & Optimize Code\n\nCreate a Python script to find all duplicate files in a folder.", use_container_width=True):
            suggested_prompt = "Write a fast, clean Python script to find duplicate files in a directory using hashing."

    with c2:
        if st.button("🌐  Architectural Comparison\n\nCompare REST vs GraphQL vs gRPC: trade-offs & use cases.", use_container_width=True):
            suggested_prompt = "Compare REST, GraphQL, and gRPC with key differences, strengths, and when to use each."
        st.write("")
        if st.button("📄  Document & Image Analysis\n\nAttach a file using the + icon below to get instant insights.", use_container_width=True):
            suggested_prompt = "Please explain the multimodal capabilities of Gemini, including what types of files and images you can analyze."
else:
    suggested_prompt = None

# Render existing messages
for idx, msg in enumerate(st.session_state.messages):
    avatar = "👤" if msg["role"] == "user" else "✨"
    with st.chat_message(msg["role"], avatar=avatar):
        # Display attached file badges if any
        if "files" in msg and msg["files"]:
            for f in msg["files"]:
                st.markdown(
                    f'<div class="file-attachment-badge">📎 <b>{f["name"]}</b> ({f.get("size_str", "Attached")})</div>',
                    unsafe_allow_html=True,
                )
                if f.get("is_image", False) and "data_b64" in f:
                    st.image(base64.b64decode(f["data_b64"]), width=300)

        # Message text content
        st.markdown(msg["content"])

        # Assistant Actions: Copy & Export
        if msg["role"] == "assistant":
            col_act1, col_act2, _ = st.columns([1.2, 1.4, 6])
            with col_act1:
                st.download_button(
                    "📥 Export",
                    data=msg["content"],
                    file_name=f"gemini_answer_{idx}.md",
                    mime="text/markdown",
                    key=f"dl_{idx}",
                    help="Download this response as a Markdown file",
                )
            with col_act2:
                with st.popover("📋 Copy Text"):
                    st.caption("Select and copy response:")
                    st.code(msg["content"], language="markdown")

# Modern ChatGPT / Claude style chat input with inline file attachment button (+)
submission = st.chat_input(
    "Ask a question or attach files (Images, PDFs, Code, Docs)...",
    accept_file="multiple",
    file_type=["png", "jpg", "jpeg", "webp", "pdf", "txt", "py", "csv", "md", "json", "html", "js"],
)

# Determine user query and submitted files
user_query = ""
submitted_files = []

if suggested_prompt:
    user_query = suggested_prompt
elif submission:
    if hasattr(submission, "text"):
        user_query = submission.text.strip()
        if hasattr(submission, "files") and submission.files:
            submitted_files = submission.files
    else:
        user_query = str(submission).strip()

    # If user attached files without typing text, default to an analysis prompt
    if not user_query and submitted_files:
        user_query = "Please analyze the attached file(s) and provide a comprehensive summary and key insights."

# Process user submission
if user_query or submitted_files:
    # Prepare attached files metadata and Gemini parts
    attached_files_meta = []
    gemini_file_parts = []

    for uf in submitted_files:
        file_bytes = uf.getvalue()
        mime = uf.type or "application/octet-stream"
        size_kb = len(file_bytes) / 1024
        size_str = f"{size_kb:.1f} KB" if size_kb < 1024 else f"{size_kb/1024:.1f} MB"
        is_img = mime.startswith("image/")

        meta = {
            "name": uf.name,
            "mime": mime,
            "size_str": size_str,
            "is_image": is_img,
        }
        if is_img:
            meta["data_b64"] = base64.b64encode(file_bytes).decode("utf-8")

        attached_files_meta.append(meta)

        # Build Gemini part
        if is_img or mime == "application/pdf":
            gemini_file_parts.append(
                types.Part.from_bytes(data=file_bytes, mime_type=mime)
            )
        else:
            # Text/code/csv/json files
            text_content = file_bytes.decode("utf-8", errors="ignore")
            gemini_file_parts.append(
                types.Part.from_text(text=f"--- Attached File: {uf.name} ---\n{text_content}\n")
            )

    # Append user question to session state
    st.session_state.messages.append({
        "role": "user",
        "content": user_query,
        "files": attached_files_meta,
    })

    # Render user message
    with st.chat_message("user", avatar="👤"):
        if attached_files_meta:
            for f in attached_files_meta:
                st.markdown(
                    f'<div class="file-attachment-badge">📎 <b>{f["name"]}</b> ({f["size_str"]})</div>',
                    unsafe_allow_html=True,
                )
                if f.get("is_image", False) and "data_b64" in f:
                    st.image(base64.b64decode(f["data_b64"]), width=300)
        st.markdown(user_query)

    # Generate assistant answer
    with st.chat_message("assistant", avatar="✨"):
        response_placeholder = st.empty()
        full_response = ""

        try:
            client = genai.Client(api_key=active_key)

            # Build generation config
            config_args = {"temperature": temperature}
            if "system_instruction" in locals() and system_instruction.strip():
                config_args["system_instruction"] = system_instruction.strip()
            config = types.GenerateContentConfig(**config_args)

            # Build contents
            if enable_history and len(st.session_state.messages) > 1:
                contents = []
                for msg in st.session_state.messages[:-1]:
                    role = "user" if msg["role"] == "user" else "model"
                    contents.append(
                        types.Content(
                            role=role,
                            parts=[types.Part.from_text(text=msg["content"])],
                        )
                    )
                # Current user message with any attached files
                current_parts = gemini_file_parts + [types.Part.from_text(text=user_query)]
                contents.append(types.Content(role="user", parts=current_parts))
            else:
                current_parts = gemini_file_parts + [types.Part.from_text(text=user_query)]
                contents = current_parts

            # Call Gemini streaming API
            stream = client.models.generate_content_stream(
                model=model_choice,
                contents=contents,
                config=config,
            )

            # Stream chunks
            for chunk in stream:
                if chunk.text:
                    full_response += chunk.text
                    response_placeholder.markdown(full_response + "▌")

            response_placeholder.markdown(full_response)
            st.session_state.messages.append({
                "role": "assistant",
                "content": full_response,
            })
            st.rerun()

        except APIError as e:
            error_message = getattr(e, "message", str(e))
            response_placeholder.error(
                f"**Gemini API Error:** {error_message}\n\n"
                "- Please check that your API key is valid and has Gemini API enabled.\n"
                "- Ensure your project has sufficient quota at https://aistudio.google.com/."
            )
        except Exception as e:
            response_placeholder.error(f"**Unexpected Error:** {str(e)}")
