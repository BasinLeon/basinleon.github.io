/**
 * BASIN::NEXUS Email Capture Popup
 * Lead generation widget with timing and dismissal logic
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        showDelay: 30000,        // 30 seconds before showing
        cookieExpiry: 7,         // Days until popup shows again after dismiss
        cookieName: 'basin_popup_dismissed',
        formEndpoint: 'https://formspree.io/f/meeeqyrg'  // Your Formspree endpoint
    };

    // Check if popup was already dismissed
    function wasPopupDismissed() {
        return document.cookie.includes(CONFIG.cookieName + '=true');
    }

    // Set dismissal cookie
    function setDismissedCookie() {
        const date = new Date();
        date.setTime(date.getTime() + (CONFIG.cookieExpiry * 24 * 60 * 60 * 1000));
        document.cookie = `${CONFIG.cookieName}=true; expires=${date.toUTCString()}; path=/`;
    }

    // Create the popup HTML
    function createPopupHTML() {
        const popup = document.createElement('div');
        popup.id = 'basin-email-popup';
        popup.innerHTML = `
            <div class="popup-overlay" id="popup-overlay">
                <div class="popup-container">
                    <button class="popup-close" id="popup-close" aria-label="Close popup">×</button>
                    
                    <div class="popup-content">
                        <div class="popup-icon">📡</div>
                        <h2 class="popup-title">Join the Signal Feed</h2>
                        <p class="popup-desc">
                            Get my <strong>Revenue Architecture</strong> frameworks, tool releases, and GTM insights.
                            <br><span style="opacity: 0.7;">No spam. Unsubscribe anytime.</span>
                        </p>
                        
                        <form class="popup-form" id="popup-form" action="${CONFIG.formEndpoint}" method="POST">
                            <input type="email" name="email" placeholder="your@email.com" required class="popup-input">
                            <input type="hidden" name="_subject" value="🔔 New Signal Feed Subscriber (Popup)">
                            <button type="submit" class="popup-btn">
                                <span class="btn-text">GET THE SIGNALS</span>
                                <span class="btn-loading" style="display: none;">Subscribing...</span>
                            </button>
                        </form>
                        
                        <div class="popup-proof">
                            <span>⚡</span> Join 1,800+ revenue architects
                        </div>
                        
                        <div class="popup-bonus">
                            <strong>BONUS:</strong> Get my "$0 GTM Stack Blueprint" PDF free
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            #basin-email-popup .popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                backdrop-filter: blur(4px);
            }
            
            #basin-email-popup .popup-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            #basin-email-popup .popup-container {
                background: linear-gradient(145deg, #0a0a0f, #050508);
                border: 1px solid rgba(212, 175, 55, 0.4);
                border-radius: 16px;
                padding: 40px;
                max-width: 440px;
                width: 90%;
                position: relative;
                transform: scale(0.9) translateY(20px);
                transition: transform 0.3s ease;
                box-shadow: 0 0 60px rgba(212, 175, 55, 0.15);
            }
            
            #basin-email-popup .popup-overlay.active .popup-container {
                transform: scale(1) translateY(0);
            }
            
            #basin-email-popup .popup-close {
                position: absolute;
                top: 16px;
                right: 16px;
                background: transparent;
                border: none;
                color: #5a584f;
                font-size: 28px;
                cursor: pointer;
                padding: 4px 12px;
                border-radius: 4px;
                transition: all 0.2s;
                line-height: 1;
            }
            
            #basin-email-popup .popup-close:hover {
                color: #D4AF37;
                background: rgba(212, 175, 55, 0.1);
            }
            
            #basin-email-popup .popup-content {
                text-align: center;
            }
            
            #basin-email-popup .popup-icon {
                font-size: 3rem;
                margin-bottom: 16px;
            }
            
            #basin-email-popup .popup-title {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.5rem;
                color: #D4AF37;
                margin-bottom: 12px;
                letter-spacing: 1px;
            }
            
            #basin-email-popup .popup-desc {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.85rem;
                color: #8b8573;
                margin-bottom: 24px;
                line-height: 1.6;
            }
            
            #basin-email-popup .popup-form {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            #basin-email-popup .popup-input {
                padding: 14px 16px;
                background: #0f0f14;
                border: 1px solid rgba(212, 175, 55, 0.3);
                border-radius: 8px;
                color: #f0e6d3;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.9rem;
                text-align: center;
                transition: border-color 0.3s;
            }
            
            #basin-email-popup .popup-input:focus {
                outline: none;
                border-color: #D4AF37;
                box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
            }
            
            #basin-email-popup .popup-input::placeholder {
                color: #5a584f;
            }
            
            #basin-email-popup .popup-btn {
                padding: 14px 24px;
                background: linear-gradient(135deg, #D4AF37, #B8860B);
                border: none;
                border-radius: 8px;
                color: #000;
                font-family: 'Orbitron', sans-serif;
                font-size: 0.85rem;
                font-weight: 700;
                cursor: pointer;
                letter-spacing: 1px;
                transition: all 0.3s;
            }
            
            #basin-email-popup .popup-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
            }
            
            #basin-email-popup .popup-btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
            
            #basin-email-popup .popup-proof {
                margin-top: 20px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.75rem;
                color: #5a584f;
            }
            
            #basin-email-popup .popup-bonus {
                margin-top: 16px;
                padding: 12px;
                background: rgba(34, 197, 94, 0.1);
                border: 1px dashed rgba(34, 197, 94, 0.3);
                border-radius: 8px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.75rem;
                color: #22c55e;
            }
            
            #basin-email-popup .popup-success {
                text-align: center;
                padding: 20px;
            }
            
            #basin-email-popup .popup-success h3 {
                font-family: 'Orbitron', sans-serif;
                color: #22c55e;
                margin-bottom: 12px;
            }
            
            @media (max-width: 480px) {
                #basin-email-popup .popup-container {
                    padding: 28px 20px;
                }
                
                #basin-email-popup .popup-title {
                    font-size: 1.2rem;
                }
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(popup);
        
        return popup;
    }

    // Show popup
    function showPopup() {
        const overlay = document.getElementById('popup-overlay');
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Track event
            if (typeof plausible !== 'undefined') {
                plausible('Popup Shown');
            }
        }
    }

    // Hide popup
    function hidePopup() {
        const overlay = document.getElementById('popup-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const btn = form.querySelector('.popup-btn');
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');
        const emailInput = form.querySelector('input[type="email"]');
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        btn.disabled = true;
        
        // Submit to Formspree
        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Success
                const content = document.querySelector('#basin-email-popup .popup-content');
                content.innerHTML = `
                    <div class="popup-success">
                        <div style="font-size: 3rem; margin-bottom: 16px;">✅</div>
                        <h3>You're In!</h3>
                        <p style="color: #8b8573; font-size: 0.85rem; margin-top: 12px;">
                            Check your inbox for the $0 GTM Stack Blueprint.
                        </p>
                        <p style="color: #5a584f; font-size: 0.75rem; margin-top: 16px;">
                            This popup will close in 3 seconds...
                        </p>
                    </div>
                `;
                
                // Track conversion
                if (typeof plausible !== 'undefined') {
                    plausible('Email Captured', { props: { source: 'popup' } });
                }
                
                // Set cookie and close
                setDismissedCookie();
                setTimeout(() => {
                    hidePopup();
                }, 3000);
            } else {
                throw new Error('Submission failed');
            }
        })
        .catch(error => {
            // Error state
            btnText.textContent = 'Try Again';
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            btn.disabled = false;
            console.error('Popup form error:', error);
        });
    }

    // Initialize popup
    function initPopup() {
        // Don't show if already dismissed
        if (wasPopupDismissed()) {
            return;
        }

        // Create popup
        const popup = createPopupHTML();
        
        // Set up event listeners
        const closeBtn = document.getElementById('popup-close');
        const overlay = document.getElementById('popup-overlay');
        const form = document.getElementById('popup-form');
        
        // Close button
        closeBtn.addEventListener('click', () => {
            setDismissedCookie();
            hidePopup();
        });
        
        // Click outside to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                setDismissedCookie();
                hidePopup();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                setDismissedCookie();
                hidePopup();
            }
        });
        
        // Form submission
        form.addEventListener('submit', handleFormSubmit);
        
        // Show popup after delay
        setTimeout(showPopup, CONFIG.showDelay);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPopup);
    } else {
        initPopup();
    }

})();
