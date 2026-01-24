/**
 * Mobile Payment Integration
 * Apple Pay & Google Pay for iPhone/Android
 */

(function() {
    'use strict';

    const MobilePayments = {
        // Detect device type
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
        isAndroid: /Android/.test(navigator.userAgent),
        isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),

        // Check if Apple Pay is available
        async checkApplePay() {
            if (!this.isIOS) return false;
            
            try {
                if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
                    return true;
                }
            } catch (e) {
                            }
            return false;
        },

        // Check if Google Pay is available
        async checkGooglePay() {
            if (!this.isAndroid && !this.isMobile) return false;
            
            try {
                if (window.PaymentRequest) {
                    const paymentMethods = [{
                        supportedMethods: 'https://google.com/pay',
                        data: {
                            environment: 'TEST',
                            apiVersion: 2,
                            apiVersionMinor: 0,
                            merchantInfo: {
                                merchantId: 'basin-associates',
                                merchantName: 'Basin & Associates'
                            },
                            allowedPaymentMethods: [{
                                type: 'CARD',
                                parameters: {
                                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                    allowedCardNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA']
                                }
                            }]
                        }
                    }];
                    
                    const request = new PaymentRequest(paymentMethods, {
                        total: {
                            label: 'Premium Subscription',
                            amount: { currency: 'USD', value: '99.00' }
                        }
                    });
                    
                    if (await request.canMakePayment()) {
                        return true;
                    }
                }
            } catch (e) {
                            }
            return false;
        },

        // Initialize Apple Pay
        async initApplePay(amount, description, tier) {
            if (!this.isIOS) {
                this.fallbackToEmail(tier, amount);
                return;
            }

            try {
                const request = {
                    countryCode: 'US',
                    currencyCode: 'USD',
                    supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
                    merchantCapabilities: ['supports3DS'],
                    total: {
                        label: description,
                        amount: amount.toString()
                    }
                };

                const session = new ApplePaySession(3, request);
                
                session.onvalidatemerchant = async (event) => {
                    // In production, validate with your server
                    // For now, use test validation
                    try {
                        const validationURL = event.validationURL;
                        // Call your backend to validate
                        // const merchantSession = await fetch('/api/apple-pay-validate', { ... });
                        // session.completeMerchantValidation(merchantSession);
                        
                        // For demo, we'll show email fallback
                        session.abort();
                        this.fallbackToEmail(tier, amount);
                    } catch (e) {
                        console.error('Apple Pay validation error:', e);
                        session.abort();
                        this.fallbackToEmail(tier, amount);
                    }
                };

                session.onpaymentauthorized = (event) => {
                    // Process payment on your server
                    // For now, redirect to email
                    session.completePayment(ApplePaySession.STATUS_SUCCESS);
                    this.fallbackToEmail(tier, amount, 'Apple Pay initiated');
                };

                session.begin();
            } catch (e) {
                console.error('Apple Pay error:', e);
                this.fallbackToEmail(tier, amount);
            }
        },

        // Initialize Google Pay
        async initGooglePay(amount, description, tier) {
            if (!this.isMobile) {
                this.fallbackToEmail(tier, amount);
                return;
            }

            try {
                const paymentMethods = [{
                    supportedMethods: 'https://google.com/pay',
                    data: {
                        environment: 'PRODUCTION',
                        apiVersion: 2,
                        apiVersionMinor: 0,
                        merchantInfo: {
                            merchantId: 'basin-associates',
                            merchantName: 'Basin & Associates'
                        },
                        allowedPaymentMethods: [{
                            type: 'CARD',
                            parameters: {
                                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                allowedCardNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA']
                            },
                            tokenizationSpecification: {
                                type: 'PAYMENT_GATEWAY',
                                parameters: {
                                    gateway: 'stripe',
                                    'stripe:version': '2018-10-31',
                                    'stripe:publishableKey': 'pk_live_YOUR_KEY' // Replace with your Stripe key
                                }
                            }
                        }]
                    }
                }];

                const paymentDetails = {
                    total: {
                        label: description,
                        amount: {
                            currency: 'USD',
                            value: amount.toString()
                        }
                    }
                };

                const request = new PaymentRequest(paymentMethods, paymentDetails);
                
                if (await request.canMakePayment()) {
                    try {
                        const response = await request.show();
                        // Process payment
                        await response.complete('success');
                        this.fallbackToEmail(tier, amount, 'Google Pay initiated');
                    } catch (e) {
                        console.error('Google Pay error:', e);
                        this.fallbackToEmail(tier, amount);
                    }
                } else {
                    this.fallbackToEmail(tier, amount);
                }
            } catch (e) {
                console.error('Google Pay setup error:', e);
                this.fallbackToEmail(tier, amount);
            }
        },

        // Fallback to email if payment fails
        fallbackToEmail(tier, amount, method = '') {
            const tierName = tier === 'premium' ? 'Premium' : 'Founder\'s Circle';
            const subject = encodeURIComponent(`${tierName} Subscription - ${method || 'Mobile Payment'}`);
            const body = encodeURIComponent(
                `Hi Leon,\n\n` +
                `I'm interested in the ${tierName} tier ($${amount}/month).\n\n` +
                `${method ? `Payment method: ${method}\n\n` : ''}` +
                `Please let me know how to proceed.\n\n` +
                `Thanks!`
            );
            window.location.href = `mailto:lbasin23@gmail.com?subject=${subject}&body=${body}`;
        },

        // Show mobile payment options
        showMobilePaymentOptions(tier, amount, description) {
            const tierName = tier === 'premium' ? 'Premium' : 'Founder\'s Circle';
            
            // Create mobile-optimized payment modal
            const modal = document.createElement('div');
            modal.className = 'mobile-payment-modal';
            modal.innerHTML = `
                <div class="mobile-payment-content">
                    <div class="mobile-payment-close">×</div>
                    <h3>${tierName} Subscription</h3>
                    <p class="mobile-payment-price">$${amount}/month</p>
                    <p class="mobile-payment-desc">${description}</p>
                    <div class="mobile-payment-buttons">
                        ${this.isIOS ? `
                            <button class="mobile-pay-btn apple-pay" id="apple-pay-btn">
                                <span class="apple-pay-logo">🍎</span>
                                <span>Pay with Apple Pay</span>
                            </button>
                        ` : ''}
                        ${this.isMobile ? `
                            <button class="mobile-pay-btn google-pay" id="google-pay-btn">
                                <span class="google-pay-logo">G</span>
                                <span>Pay with Google Pay</span>
                            </button>
                        ` : ''}
                        <button class="mobile-pay-btn email-fallback" id="email-pay-btn">
                            📧 Email to Subscribe
                        </button>
                    </div>
                </div>
            `;

            // Add styles
            if (!document.getElementById('mobile-payment-styles')) {
                const style = document.createElement('style');
                style.id = 'mobile-payment-styles';
                style.textContent = `
                    .mobile-payment-modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.95);
                        z-index: 100000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                    }
                    .mobile-payment-content {
                        background: #0a0a0f;
                        border: 2px solid #D4AF37;
                        border-radius: 16px;
                        padding: 32px;
                        max-width: 400px;
                        width: 100%;
                        text-align: center;
                        position: relative;
                    }
                    .mobile-payment-close {
                        position: absolute;
                        top: 16px;
                        right: 16px;
                        font-size: 24px;
                        color: #f0e6d3;
                        cursor: pointer;
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        background: rgba(212, 175, 55, 0.1);
                    }
                    .mobile-payment-content h3 {
                        color: #D4AF37;
                        font-family: 'Orbitron', sans-serif;
                        margin-bottom: 8px;
                    }
                    .mobile-payment-price {
                        font-size: 2rem;
                        font-weight: 700;
                        color: #f0e6d3;
                        margin: 16px 0;
                    }
                    .mobile-payment-desc {
                        color: #8b8573;
                        margin-bottom: 24px;
                        font-size: 0.9rem;
                    }
                    .mobile-payment-buttons {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }
                    .mobile-pay-btn {
                        padding: 16px 24px;
                        border: 2px solid #D4AF37;
                        border-radius: 8px;
                        background: rgba(212, 175, 55, 0.1);
                        color: #f0e6d3;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        min-height: 48px;
                    }
                    .mobile-pay-btn:hover,
                    .mobile-pay-btn:active {
                        background: rgba(212, 175, 55, 0.2);
                        border-color: #FFD700;
                        transform: translateY(-2px);
                    }
                    .mobile-pay-btn.apple-pay {
                        background: #000;
                        color: #fff;
                        border-color: #000;
                    }
                    .mobile-pay-btn.google-pay {
                        background: #fff;
                        color: #000;
                        border-color: #fff;
                    }
                    @media (max-width: 480px) {
                        .mobile-payment-content {
                            padding: 24px;
                            margin: 10px;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(modal);

            // Event handlers
            modal.querySelector('.mobile-payment-close').addEventListener('click', () => modal.remove());
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });

            // Payment button handlers
            if (this.isIOS) {
                modal.querySelector('#apple-pay-btn')?.addEventListener('click', () => {
                    this.initApplePay(amount, description, tier);
                });
            }

            if (this.isMobile) {
                modal.querySelector('#google-pay-btn')?.addEventListener('click', () => {
                    this.initGooglePay(amount, description, tier);
                });
            }

            modal.querySelector('#email-pay-btn')?.addEventListener('click', () => {
                this.fallbackToEmail(tier, amount);
                modal.remove();
            });
        }
    };

    // Expose globally
    window.MobilePayments = MobilePayments;

    // Auto-detect and show mobile payment options if on mobile
    if (MobilePayments.isMobile) {
            }
})();
