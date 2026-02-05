/**
 * BASIN::NEXUS Blog Chatbot
 * Ask questions about Leon's writing, experience, and insights
 * Powered by OpenAI (user provides API key)
 */

(function() {
    'use strict';

    const SYSTEM_PROMPT = `You are Leon Basin's AI assistant. You help visitors understand Leon's writing, experience, and GTM architecture philosophy.

Context about Leon:
- 15+ years GTM leadership (Google, Fudo Security, SurveyMonkey, Sense)
- Revenue Architect who builds AI-powered systems
- Author of "The Architecture of Revenue" thesis
- MBA from Santa Clara University
- Specializes in: Python, AI/ML, Revenue Operations, Cybersecurity GTM
- Built BASIN::NEXUS - 27,000+ line GTM operating system
- Key achievements: 160% pipeline growth, $424K cost savings through automation

Writing themes:
- Revenue as architecture, not arithmetic
- Signal-based GTM vs volume-based selling
- AI agents replacing manual sales workflows
- "Code is the new revenue capacity"
- Ancient wisdom applied to modern business

Answer questions about:
1. Leon's career and experience
2. His blog posts and ideas
3. BASIN::NEXUS tools and methodology
4. How to apply his concepts
5. GTM strategy and revenue architecture

Keep responses:
- Concise (2-3 sentences)
- Practical and actionable
- Rooted in Leon's actual writing
- Professional but conversational

If asked about something not covered in Leon's work, say: "That's outside my knowledge of Leon's writing. Check his blog or reach out to him directly at lbasin23@gmail.com"`;

    const STYLES = `
        #blog-chatbot-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            font-family: 'JetBrains Mono', monospace;
        }

        #blog-chatbot-toggle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: all 0.3s ease;
        }

        #blog-chatbot-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
        }

        #blog-chatbot-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 380px;
            height: 500px;
            background: #0a0a0f;
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
            display: none;
            flex-direction: column;
            overflow: hidden;
        }

        #blog-chatbot-window.open {
            display: flex;
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        #chatbot-header {
            padding: 16px;
            background: rgba(212, 175, 55, 0.1);
            border-bottom: 1px solid rgba(212, 175, 55, 0.3);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #chatbot-header h3 {
            margin: 0;
            font-size: 14px;
            color: #D4AF37;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        #chatbot-close {
            background: none;
            border: none;
            color: #666;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #chatbot-close:hover {
            color: #D4AF37;
        }

        #chatbot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .chat-message {
            max-width: 80%;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 13px;
            line-height: 1.5;
            word-wrap: break-word;
        }

        .chat-message.user {
            align-self: flex-end;
            background: #D4AF37;
            color: #000;
        }

        .chat-message.assistant {
            align-self: flex-start;
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.3);
            color: #f0e6d3;
        }

        .chat-message.system {
            align-self: center;
            background: transparent;
            color: #666;
            font-size: 11px;
            font-style: italic;
            max-width: 100%;
            text-align: center;
        }

        #chatbot-input-area {
            padding: 12px;
            border-top: 1px solid rgba(212, 175, 55, 0.3);
            background: rgba(212, 175, 55, 0.05);
        }

        #chatbot-input {
            width: 100%;
            padding: 10px;
            background: #050508;
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 6px;
            color: #f0e6d3;
            font-family: inherit;
            font-size: 13px;
            resize: none;
            outline: none;
        }

        #chatbot-input:focus {
            border-color: #D4AF37;
        }

        #chatbot-api-key-prompt {
            padding: 16px;
            text-align: center;
            color: #f0e6d3;
        }

        #chatbot-api-key-prompt input {
            width: 100%;
            padding: 8px;
            margin: 8px 0;
            background: #050508;
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 4px;
            color: #f0e6d3;
            font-family: inherit;
            font-size: 12px;
        }

        #chatbot-api-key-prompt button {
            background: #D4AF37;
            color: #000;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        #chatbot-api-key-prompt button:hover {
            background: #FFD700;
        }

        .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 10px 14px;
            align-self: flex-start;
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 8px;
        }

        .typing-indicator span {
            width: 6px;
            height: 6px;
            background: #D4AF37;
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
            animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typing {
            0%, 60%, 100% {
                opacity: 0.3;
                transform: translateY(0);
            }
            30% {
                opacity: 1;
                transform: translateY(-4px);
            }
        }

        @media (max-width: 480px) {
            #blog-chatbot-window {
                width: calc(100vw - 32px);
                height: calc(100vh - 120px);
                bottom: 80px;
                right: 16px;
            }
        }
    `;

    let apiKey = localStorage.getItem('basin_chatbot_api_key');
    let conversationHistory = [];

    function init() {
        // Inject styles
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);

        // Create chatbot HTML
        const container = document.createElement('div');
        container.id = 'blog-chatbot-container';
        container.innerHTML = `
            <button id="blog-chatbot-toggle" aria-label="Open chat">
                💬
            </button>
            <div id="blog-chatbot-window">
                <div id="chatbot-header">
                    <h3>Ask Leon's AI</h3>
                    <button id="chatbot-close" aria-label="Close chat">×</button>
                </div>
                <div id="chatbot-messages">
                    <div class="chat-message system">
                        Hi! I'm Leon's AI assistant. Ask me about his writing, experience, or BASIN::NEXUS tools.
                    </div>
                </div>
                <div id="chatbot-input-area">
                    <textarea id="chatbot-input" placeholder="Ask a question..." rows="2"></textarea>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Event listeners
        document.getElementById('blog-chatbot-toggle').addEventListener('click', toggleChat);
        document.getElementById('chatbot-close').addEventListener('click', toggleChat);
        document.getElementById('chatbot-input').addEventListener('keydown', handleInput);

        // Check for API key
        if (!apiKey) {
            promptForApiKey();
        }
    }

    function toggleChat() {
        const window = document.getElementById('blog-chatbot-window');
        window.classList.toggle('open');

        if (window.classList.contains('open')) {
            document.getElementById('chatbot-input').focus();
        }
    }

    function promptForApiKey() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.innerHTML = `
            <div id="chatbot-api-key-prompt">
                <p style="font-size: 12px; margin-bottom: 12px;">
                    This chatbot uses OpenAI's API. Enter your API key to start:
                </p>
                <input type="password" id="api-key-input" placeholder="sk-...">
                <button id="save-api-key">Save Key</button>
                <p style="font-size: 10px; color: #666; margin-top: 8px;">
                    Your key is stored locally and never sent anywhere except OpenAI.
                </p>
            </div>
        `;

        document.getElementById('save-api-key').addEventListener('click', () => {
            const key = document.getElementById('api-key-input').value.trim();
            if (key) {
                apiKey = key;
                localStorage.setItem('basin_chatbot_api_key', key);
                messagesContainer.innerHTML = `
                    <div class="chat-message system">
                        Hi! I'm Leon's AI assistant. Ask me about his writing, experience, or BASIN::NEXUS tools.
                    </div>
                `;
            }
        });
    }

    async function handleInput(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const input = e.target.value.trim();
            if (!input) return;

            if (!apiKey) {
                alert('Please set your OpenAI API key first.');
                return;
            }

            // Clear input
            e.target.value = '';

            // Add user message
            addMessage(input, 'user');

            // Show typing indicator
            const typingEl = document.createElement('div');
            typingEl.className = 'typing-indicator';
            typingEl.innerHTML = '<span></span><span></span><span></span>';
            document.getElementById('chatbot-messages').appendChild(typingEl);
            scrollToBottom();

            // Get response
            try {
                const response = await fetchChatCompletion(input);
                typingEl.remove();
                addMessage(response, 'assistant');
            } catch (error) {
                typingEl.remove();
                addMessage('Sorry, I encountered an error. Please check your API key and try again.', 'system');
                console.error('Chat error:', error);
            }
        }
    }

    async function fetchChatCompletion(userMessage) {
        conversationHistory.push({ role: 'user', content: userMessage });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...conversationHistory
                ],
                max_tokens: 200,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;
        conversationHistory.push({ role: 'assistant', content: assistantMessage });

        return assistantMessage;
    }

    function addMessage(text, type) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${type}`;
        messageEl.textContent = text;
        messagesContainer.appendChild(messageEl);
        scrollToBottom();
    }

    function scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
