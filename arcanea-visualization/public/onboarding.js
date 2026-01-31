// Arcanea Platform Onboarding Experience
class ArcaneanOnboarding {
    constructor() {
        this.hasSeenOnboarding = localStorage.getItem('arcanea-onboarding-complete');
        this.currentStep = 0;
        this.steps = [
            {
                title: "Welcome to Arcanea",
                content: "Where mythology meets artificial intelligence. Let's begin your journey through the cosmos of creation.",
                target: null,
                position: 'center'
            },
            {
                title: "The Mythology Explorer",
                content: "Navigate through interactive visualizations showing how myths connect across cultures and time.",
                target: '.portal-card[data-feature="mythology"]',
                position: 'bottom'
            },
            {
                title: "Novel Crafter",
                content: "Harness AI to write your own myths and stories. Get intelligent assistance for characters, plots, and worlds.",
                target: '.portal-card[data-feature="novel"]',
                position: 'bottom'
            },
            {
                title: "The Lore Library",
                content: "Immerse yourself in ancient wisdom and modern interpretations of timeless stories.",
                target: '.portal-card[data-feature="lore"]',
                position: 'bottom'
            },
            {
                title: "Gallery of Wonders",
                content: "Explore visual representations of mythological beings, realms, and artifacts.",
                target: '.portal-card[data-feature="gallery"]',
                position: 'top'
            },
            {
                title: "Harmonic Spaces",
                content: "Experience soundscapes inspired by cosmic harmonies. Perfect for meditation and creative work.",
                target: '.portal-card[data-feature="harmonic"]',
                position: 'top'
            },
            {
                title: "Your Journey Begins",
                content: "Choose your path and begin exploring. The cosmos awaits your story.",
                target: null,
                position: 'center'
            }
        ];
    }

    start() {
        if (this.hasSeenOnboarding) return;
        
        this.createOverlay();
        this.showStep(0);
    }

    createOverlay() {
        const overlayHTML = `
            <div class="onboarding-overlay" id="onboardingOverlay">
                <div class="onboarding-backdrop"></div>
                <div class="onboarding-tooltip" id="onboardingTooltip">
                    <div class="onboarding-content">
                        <h3 class="onboarding-title" id="onboardingTitle"></h3>
                        <p class="onboarding-text" id="onboardingText"></p>
                    </div>
                    <div class="onboarding-actions">
                        <button class="onboarding-skip" onclick="arcaneanOnboarding.skip()">Skip Tour</button>
                        <div class="onboarding-progress">
                            <span id="onboardingProgress">1</span> / ${this.steps.length}
                        </div>
                        <button class="onboarding-next" onclick="arcaneanOnboarding.nextStep()">
                            <span id="nextButtonText">Next</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
                <div class="onboarding-spotlight" id="onboardingSpotlight"></div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        this.injectStyles();
    }

    injectStyles() {
        const styles = `
            <style>
                .onboarding-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 9999;
                    pointer-events: none;
                }

                .onboarding-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(10, 10, 15, 0.8);
                    pointer-events: all;
                }

                .onboarding-tooltip {
                    position: absolute;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border: 2px solid #f7d794;
                    border-radius: 15px;
                    padding: 2rem;
                    max-width: 400px;
                    box-shadow: 0 20px 60px rgba(247, 215, 148, 0.3);
                    pointer-events: all;
                    animation: fadeInScale 0.5s ease-out;
                }

                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .onboarding-tooltip.center {
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .onboarding-title {
                    font-family: 'Cinzel', serif;
                    font-size: 1.8rem;
                    color: #f7d794;
                    margin-bottom: 1rem;
                }

                .onboarding-text {
                    color: #dcdde1;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                }

                .onboarding-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .onboarding-skip {
                    background: transparent;
                    border: 1px solid #95afc0;
                    color: #95afc0;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: 'Raleway', sans-serif;
                }

                .onboarding-skip:hover {
                    border-color: #f7d794;
                    color: #f7d794;
                }

                .onboarding-progress {
                    color: #95afc0;
                    font-size: 0.9rem;
                }

                .onboarding-next {
                    background: #f7d794;
                    color: #0a0a0f;
                    border: none;
                    padding: 0.6rem 1.5rem;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s ease;
                    font-family: 'Raleway', sans-serif;
                }

                .onboarding-next:hover {
                    transform: translateX(5px);
                    box-shadow: 0 5px 20px rgba(247, 215, 148, 0.4);
                }

                .onboarding-spotlight {
                    position: absolute;
                    border: 3px solid #f7d794;
                    border-radius: 10px;
                    pointer-events: none;
                    transition: all 0.5s ease;
                    box-shadow: 0 0 0 2000px rgba(10, 10, 15, 0.8);
                }

                .onboarding-spotlight::before {
                    content: '';
                    position: absolute;
                    top: -5px;
                    left: -5px;
                    right: -5px;
                    bottom: -5px;
                    border: 2px solid rgba(247, 215, 148, 0.3);
                    border-radius: 12px;
                    animation: pulse 2s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.02); }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    showStep(stepIndex) {
        const step = this.steps[stepIndex];
        const tooltip = document.getElementById('onboardingTooltip');
        const spotlight = document.getElementById('onboardingSpotlight');
        
        // Update content
        document.getElementById('onboardingTitle').textContent = step.title;
        document.getElementById('onboardingText').textContent = step.content;
        document.getElementById('onboardingProgress').textContent = stepIndex + 1;
        
        // Update button text for last step
        const nextButton = document.getElementById('nextButtonText');
        nextButton.textContent = stepIndex === this.steps.length - 1 ? 'Begin Journey' : 'Next';
        
        // Position tooltip and spotlight
        if (step.target) {
            const targetEl = document.querySelector(step.target);
            if (targetEl) {
                const rect = targetEl.getBoundingClientRect();
                
                // Position spotlight
                spotlight.style.display = 'block';
                spotlight.style.top = rect.top - 10 + 'px';
                spotlight.style.left = rect.left - 10 + 'px';
                spotlight.style.width = rect.width + 20 + 'px';
                spotlight.style.height = rect.height + 20 + 'px';
                
                // Position tooltip
                tooltip.classList.remove('center');
                if (step.position === 'bottom') {
                    tooltip.style.top = rect.bottom + 20 + 'px';
                    tooltip.style.left = rect.left + rect.width / 2 - 200 + 'px';
                } else if (step.position === 'top') {
                    tooltip.style.top = rect.top - tooltip.offsetHeight - 20 + 'px';
                    tooltip.style.left = rect.left + rect.width / 2 - 200 + 'px';
                }
            }
        } else {
            // Center position
            tooltip.classList.add('center');
            tooltip.style.top = '';
            tooltip.style.left = '';
            spotlight.style.display = 'none';
        }
        
        this.currentStep = stepIndex;
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        } else {
            this.complete();
        }
    }

    skip() {
        this.complete();
    }

    complete() {
        localStorage.setItem('arcanea-onboarding-complete', 'true');
        const overlay = document.getElementById('onboardingOverlay');
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.5s ease';
        setTimeout(() => overlay.remove(), 500);
    }
}

// Initialize onboarding when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.arcaneanOnboarding = new ArcaneanOnboarding();
    });
} else {
    window.arcaneanOnboarding = new ArcaneanOnboarding();
}
