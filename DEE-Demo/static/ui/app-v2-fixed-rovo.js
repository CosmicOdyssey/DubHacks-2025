// This is a patch file - copy the Rovo HTML section below and manually replace in app-v2.js

  // Rovo Chat Instructions with Prompt Buttons - REPLACE THE OLD VERSION WITH THIS
  const rovoInstructionsHTML = `
    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
      <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px; color: rgba(255,255,255,0.9);">
        🤖 Ask Rovo AI
      </div>
      <div style="font-size: 12px; line-height: 1.6; color: rgba(255,255,255,0.8); margin-bottom: 12px;">
        Click a button below to copy a prompt for Rovo Chat
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
        <button class="rovo-prompt-btn" data-prompt-type="analyze" style="
          flex: 1;
          min-width: 120px;
          padding: 8px 12px;
          background: linear-gradient(135deg, #8400FF 0%, #00D4FF 100%);
          border: none;
          border-radius: 4px;
          color: white;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s;
        ">
          📊 Analyze
        </button>
        <button class="rovo-prompt-btn" data-prompt-type="tasks" style="
          flex: 1;
          min-width: 120px;
          padding: 8px 12px;
          background: linear-gradient(135deg, #00FF88 0%, #00D4FF 100%);
          border: none;
          border-radius: 4px;
          color: white;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s;
        ">
          📝 Create Tasks
        </button>
        <button class="rovo-prompt-btn" data-prompt-type="improve" style="
          flex: 1;
          min-width: 120px;
          padding: 8px 12px;
          background: linear-gradient(135deg, #FFB800 0%, #FF006E 100%);
          border: none;
          border-radius: 4px;
          color: white;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s;
        ">
          💡 Improvements
        </button>
      </div>
      <div style="font-size: 11px; color: rgba(255,255,255,0.6); line-height: 1.5;">
        <strong>How to use:</strong><br>
        1. Click one of the buttons above<br>
        2. Open Rovo Chat from the top navigation<br>
        3. Enable "CodeGraph AI Assistant" agent<br>
        4. Paste the prompt in chat and press Enter
      </div>
    </div>
  `;
