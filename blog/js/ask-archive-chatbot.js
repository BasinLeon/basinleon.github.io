// "Ask the Archive" AI Chatbot for Blog
(function() {
    const ArchiveChatbot = {
        isOpen: false,
        
        async init() {
            // Create chatbot UI
            this.createUI();
            
            // Load blog content for context
            await this.loadBlogContent();
        },
        
        createUI() {
            const chatbotHTML = `
                <div id="archive-chatbot" class="archive-chatbot">
                    <div class="archive-chatbot-toggle" id="archive-chatbot-toggle">
                        <span>💬</span>
                        <span class="archive-chatbot-label">Ask the Archive</span>
                    </div>
                    <div class="archive-chatbot-window" id="archive-chatbot-window">
                        <div class="archive-chatbot-header">
                            <h4>Ask the Archive</h4>
                            <button class="archive-chatbot-close" id="archive-chatbot-close">×</button>
                        </div>
                        <div class="archive-chatbot-messages" id="archive-chatbot-messages">
                            <div class="archive-chatbot-message agent">
                                Ask me anything about the blog content, GTM strategies, revenue architecture, or case studies.
                            </div>
                        </div>
                        <div class="archive-chatbot-input-container">
                            <input type="text" id="archive-chatbot-input" placeholder="Ask a question...">
                            <button id="archive-chatbot-send">→</button>
                        </div>
                    </div>
                </div>
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                .archive-chatbot {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    z-index: 9999;
                }
                .archive-chatbot-toggle {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
                    border: 1px solid rgba(212, 175, 55, 0.3);
                    border-radius: 24px;
                    color: #050508;
                    cursor: pointer;
                    font-family: 'Orbitron', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 600;
                    box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
                    transition: all 0.3s;
                }
                .archive-chatbot-toggle:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 30px rgba(212, 175, 55, 0.6);
                }
                .archive-chatbot-window {
                    position: absolute;
                    bottom: 60px;
                    left: 0;
                    width: 380px;
                    height: 500px;
                    background: linear-gradient(180deg, #0a0a0f 0%, #050508 100%);
                    border: 1px solid rgba(212, 175, 55, 0.3);
                    border-radius: 16px;
                    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                }
                .archive-chatbot-window.open {
                    display: flex;
                }
                .archive-chatbot-header {
                    padding: 16px;
                    border-bottom: 1px solid rgba(212, 175, 55, 0.2);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(212, 175, 55, 0.05);
                }
                .archive-chatbot-header h4 {
                    color: #D4AF37;
                    font-family: 'Orbitron', sans-serif;
                    font-size: 0.9rem;
                    margin: 0;
                }
                .archive-chatbot-close {
                    background: none;
                    border: none;
                    color: #8b8573;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                }
                .archive-chatbot-close:hover {
                    color: #D4AF37;
                }
                .archive-chatbot-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .archive-chatbot-message {
                    max-width: 85%;
                    padding: 12px 16px;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    line-height: 1.6;
                }
                .archive-chatbot-message.user {
                    align-self: flex-end;
                    background: rgba(212, 175, 55, 0.2);
                    color: #f0e6d3;
                }
                .archive-chatbot-message.agent {
                    align-self: flex-start;
                    background: rgba(212, 175, 55, 0.1);
                    color: #f0e6d3;
                }
                .archive-chatbot-input-container {
                    padding: 16px;
                    border-top: 1px solid rgba(212, 175, 55, 0.2);
                    display: flex;
                    gap: 10px;
                }
                #archive-chatbot-input {
                    flex: 1;
                    background: rgba(212, 175, 55, 0.05);
                    border: 1px solid rgba(212, 175, 55, 0.2);
                    border-radius: 8px;
                    padding: 10px 14px;
                    color: #f0e6d3;
                    font-size: 0.85rem;
                    font-family: 'JetBrains Mono', monospace;
                }
                #archive-chatbot-input:focus {
                    outline: none;
                    border-color: #D4AF37;
                }
                #archive-chatbot-send {
                    padding: 10px 20px;
                    background: #D4AF37;
                    border: none;
                    border-radius: 8px;
                    color: #050508;
                    font-weight: 600;
                    cursor: pointer;
                    font-family: 'Orbitron', sans-serif;
                }
                #archive-chatbot-send:hover {
                    background: #FFD700;
                }
                @media (max-width: 768px) {
                    .archive-chatbot {
                        bottom: 10px;
                        left: 10px;
                    }
                    .archive-chatbot-window {
                        width: calc(100vw - 20px);
                        height: calc(100vh - 100px);
                    }
                }
            `;
            
            document.head.appendChild(style);
            document.body.insertAdjacentHTML('beforeend', chatbotHTML);
            
            // Event listeners
            document.getElementById('archive-chatbot-toggle').addEventListener('click', () => this.toggle());
            document.getElementById('archive-chatbot-close').addEventListener('click', () => this.close());
            document.getElementById('archive-chatbot-send').addEventListener('click', () => this.sendMessage());
            document.getElementById('archive-chatbot-input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        },
        
        async loadBlogContent() {
            try {
                const response = await fetch('/data/posts.json');
                this.blogPosts = await response.json();
            } catch (error) {
                console.error('Error loading blog content:', error);
                this.blogPosts = [];
            }
        },
        
        toggle() {
            this.isOpen = !this.isOpen;
            const window = document.getElementById('archive-chatbot-window');
            if (this.isOpen) {
                window.classList.add('open');
                document.getElementById('archive-chatbot-input').focus();
            } else {
                window.classList.remove('open');
            }
        },
        
        close() {
            this.isOpen = false;
            document.getElementById('archive-chatbot-window').classList.remove('open');
        },
        
        async sendMessage() {
            const input = document.getElementById('archive-chatbot-input');
            const message = input.value.trim();
            if (!message) return;
            
            const messagesContainer = document.getElementById('archive-chatbot-messages');
            
            // Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'archive-chatbot-message user';
            userMsg.textContent = message;
            messagesContainer.appendChild(userMsg);
            
            input.value = '';
            
            // Add thinking indicator
            const thinking = document.createElement('div');
            thinking.className = 'archive-chatbot-message agent';
            thinking.textContent = '...';
            messagesContainer.appendChild(thinking);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Generate response
            const response = await this.generateResponse(message);
            thinking.remove();
            
            // Add agent response
            const agentMsg = document.createElement('div');
            agentMsg.className = 'archive-chatbot-message agent';
            agentMsg.textContent = response;
            messagesContainer.appendChild(agentMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        },
        
        async generateResponse(query) {
            const lowerQuery = query.toLowerCase();
            
            // Try to use Claude API if available
            if (window.ANTHROPIC_API_KEY || window.OPENAI_API_KEY) {
                try {
                    return await this.generateWithAI(query);
                } catch (error) {
                    console.error('AI API error:', error);
                    // Fall through to keyword-based search
                }
            }
            
            // Enhanced keyword-based search
            const relevantPosts = (this.blogPosts || []).filter(post => {
                const title = (post.title || '').toLowerCase();
                const desc = (post.description || '').toLowerCase();
                const tags = (post.tags || []).map(t => t.toLowerCase()).join(' ');
                const category = (post.category || '').toLowerCase();
                
                const searchText = `${title} ${desc} ${tags} ${category}`;
                const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);
                
                return queryWords.some(word => searchText.includes(word));
            }).slice(0, 3);
            
            if (relevantPosts.length > 0) {
                const baseUrl = window.location.origin;
                return `I found ${relevantPosts.length} relevant article(s):\n\n${relevantPosts.map((p, i) => {
                    const url = p.url.startsWith('http') ? p.url : `${baseUrl}${p.url.startsWith('/') ? '' : '/'}${p.url}`;
                    return `${i + 1}. "${p.title}"\n   ${url}`;
                }).join('\n\n')}\n\nWould you like me to search for something more specific?`;
            }
            
            // Contextual responses based on keywords
            if (lowerQuery.includes('roi') || lowerQuery.includes('savings') || lowerQuery.includes('424k')) {
                return 'Check out "How I Replaced 10 SDRs" - it covers $424K in annual savings through signal architecture. Link: /blog/posts/how-i-replaced-10-sdrs.html';
            }
            
            if (lowerQuery.includes('signal') || lowerQuery.includes('architecture')) {
                return 'The "Signal Architecture" post explains how to detect buying signals across 7 vectors. Also check "The Architecture of Revenue" for the methodology.';
            }
            
            if (lowerQuery.includes('case study') || lowerQuery.includes('example') || lowerQuery.includes('project')) {
                return 'I have several case studies. The flagship is the $424K SDR replacement project. Check /case-studies/ for more detailed breakdowns.';
            }
            
            if (lowerQuery.includes('python') || lowerQuery.includes('code') || lowerQuery.includes('gtm engineering')) {
                return 'Check out the GTM Engineering Learning Roadmap at /library/gtm-engineering-learning.html - covers Python, SQL, Clay, Apollo, and more.';
            }
            
            if (lowerQuery.includes('who is') || lowerQuery.includes('leon basin')) {
                return 'Leon Basin is a Revenue Architect who codes. 15+ years GTM leadership, 88,000+ lines of code, $424K savings case study. Read "Why Leon Basin Matters" at /blog/posts/why-leon-basin-matters.html';
            }
            
            return 'I can help you find articles about GTM strategy, revenue architecture, signal detection, case studies, Python automation, or Leon\'s background. What specifically are you looking for?';
        },
        
        async generateWithAI(query) {
            // This would call Claude/OpenAI API
            // For now, return enhanced keyword search
            // TODO: Implement actual API call when keys are available
            return this.generateResponse(query);
        }
    };
    
    // Initialize on blog pages
    if (window.location.pathname.includes('/blog')) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => ArchiveChatbot.init());
        } else {
            ArchiveChatbot.init();
        }
    }
    
    window.ArchiveChatbot = ArchiveChatbot;
})();
