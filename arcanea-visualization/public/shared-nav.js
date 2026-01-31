// Shared Navigation Component for Arcanea Platform
class ArcaneanNav {
    constructor() {
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.initializeNav();
    }

    initializeNav() {
        // Create navigation HTML
        const navHTML = `
            <header class="arcanea-nav" id="arcaneanNav">
                <div class="nav-container">
                    <a href="arcanea_landing.html" class="nav-logo">
                        <span class="logo-icon">✦</span>
                        <span class="logo-text">ARCANEA</span>
                    </a>
                    
                    <nav class="nav-menu">
                        <a href="arcanea-portal.html" class="nav-item ${this.isActive('arcanea-portal.html')}">
                            <i class="fas fa-compass"></i>
                            <span>Portal</span>
                        </a>
                        <a href="novel-crafter.html" class="nav-item ${this.isActive('novel-crafter.html')}">
                            <i class="fas fa-feather"></i>
                            <span>Create</span>
                        </a>
                        <a href="lore-library.html" class="nav-item ${this.isActive('lore-library.html')}">
                            <i class="fas fa-book"></i>
                            <span>Lore</span>
                        </a>
                        <a href="gallery.html" class="nav-item ${this.isActive('gallery.html')}">
                            <i class="fas fa-images"></i>
                            <span>Gallery</span>
                        </a>
                        <a href="harmonic-spaces.html" class="nav-item ${this.isActive('harmonic-spaces.html')}">
                            <i class="fas fa-music"></i>
                            <span>Music</span>
                        </a>
                    </nav>
                    
                    <div class="nav-actions">
                        <button class="nav-search" onclick="arcaneanNav.toggleSearch()">
                            <i class="fas fa-search"></i>
                        </button>
                        <button class="nav-user">
                            <i class="fas fa-user-circle"></i>
                        </button>
                    </div>
                </div>
                
                <div class="search-overlay" id="searchOverlay">
                    <div class="search-container">
                        <input type="text" class="search-input" placeholder="Search the cosmos..." id="searchInput">
                        <button class="search-close" onclick="arcaneanNav.toggleSearch()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="search-suggestions" id="searchSuggestions"></div>
                </div>
            </header>
        `;

        // Insert navigation at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', navHTML);

        // Add CSS styles
        this.injectStyles();

        // Initialize search functionality
        this.initializeSearch();

        // Add scroll behavior
        this.initializeScrollBehavior();
    }

    isActive(page) {
        return this.currentPage === page ? 'active' : '';
    }

    injectStyles() {
        const styles = `
            <style>
                .arcanea-nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background: rgba(26, 26, 46, 0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(247, 215, 148, 0.2);
                    transition: all 0.3s ease;
                }

                .arcanea-nav.scrolled {
                    background: rgba(26, 26, 46, 0.98);
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
                }

                .nav-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 1rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .nav-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    text-decoration: none;
                    color: #f7d794;
                    font-family: 'Cinzel', serif;
                    font-size: 1.5rem;
                    letter-spacing: 2px;
                    transition: all 0.3s ease;
                }

                .logo-icon {
                    font-size: 1.8rem;
                    animation: pulse 3s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.8; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); }
                }

                .nav-logo:hover {
                    text-shadow: 0 0 20px rgba(247, 215, 148, 0.5);
                }

                .nav-menu {
                    display: flex;
                    gap: 1rem;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    color: #dcdde1;
                    text-decoration: none;
                    border-radius: 25px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .nav-item::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(247, 215, 148, 0.1);
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                }

                .nav-item:hover::before {
                    transform: translateX(0);
                }

                .nav-item:hover {
                    color: #f7d794;
                }

                .nav-item.active {
                    background: rgba(247, 215, 148, 0.1);
                    color: #f7d794;
                }

                .nav-item i {
                    font-size: 1rem;
                }

                .nav-actions {
                    display: flex;
                    gap: 1rem;
                }

                .nav-search, .nav-user {
                    background: transparent;
                    border: 1px solid rgba(247, 215, 148, 0.3);
                    color: #dcdde1;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .nav-search:hover, .nav-user:hover {
                    border-color: #f7d794;
                    color: #f7d794;
                    transform: scale(1.1);
                }

                /* Search Overlay */
                .search-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(10, 10, 15, 0.95);
                    z-index: 2000;
                    display: none;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .search-overlay.active {
                    display: block;
                    opacity: 1;
                }

                .search-container {
                    max-width: 800px;
                    margin: 10rem auto 2rem;
                    padding: 0 2rem;
                    position: relative;
                }

                .search-input {
                    width: 100%;
                    padding: 1.5rem 3rem;
                    background: rgba(26, 26, 46, 0.8);
                    border: 2px solid rgba(247, 215, 148, 0.3);
                    border-radius: 50px;
                    color: #dcdde1;
                    font-size: 1.5rem;
                    font-family: 'Raleway', sans-serif;
                    outline: none;
                    transition: all 0.3s ease;
                }

                .search-input:focus {
                    border-color: #f7d794;
                    box-shadow: 0 0 30px rgba(247, 215, 148, 0.3);
                }

                .search-close {
                    position: absolute;
                    right: 3rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: transparent;
                    border: none;
                    color: #95afc0;
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .search-close:hover {
                    color: #f7d794;
                }

                .search-suggestions {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }

                .search-suggestion {
                    display: block;
                    padding: 1rem 2rem;
                    color: #dcdde1;
                    text-decoration: none;
                    border-radius: 10px;
                    margin-bottom: 0.5rem;
                    transition: all 0.3s ease;
                    background: rgba(26, 26, 46, 0.5);
                }

                .search-suggestion:hover {
                    background: rgba(247, 215, 148, 0.1);
                    color: #f7d794;
                    transform: translateX(10px);
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .nav-menu {
                        display: none;
                    }

                    .nav-container {
                        padding: 1rem;
                    }

                    .search-input {
                        font-size: 1.2rem;
                        padding: 1rem 2rem;
                    }
                }

                /* Ensure content doesn't hide behind nav */
                body {
                    padding-top: 80px;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        const suggestionsContainer = document.getElementById('searchSuggestions');

        const suggestions = [
            { title: 'Novel Crafter - AI Writing Assistant', url: 'novel-crafter.html' },
            { title: 'Mythology Visualization', url: 'arcanea-portal.html' },
            { title: 'The Lore Library', url: 'lore-library.html' },
            { title: 'Gallery of Wonders', url: 'gallery.html' },
            { title: 'Harmonic Spaces - Meditation & Music', url: 'harmonic-spaces.html' },
            { title: 'Greek Mythology', url: 'lore-library.html#greek' },
            { title: 'Norse Legends', url: 'lore-library.html#norse' },
            { title: 'Creation Myths', url: 'lore-library.html#creation' }
        ];

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = suggestions.filter(s => 
                s.title.toLowerCase().includes(query)
            );

            suggestionsContainer.innerHTML = filtered
                .slice(0, 5)
                .map(s => `
                    <a href="${s.url}" class="search-suggestion">
                        <i class="fas fa-search"></i> ${s.title}
                    </a>
                `).join('');
        });

        // Close search on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.toggleSearch(false);
            }
        });
    }

    toggleSearch(show = null) {
        const overlay = document.getElementById('searchOverlay');
        const searchInput = document.getElementById('searchInput');
        
        if (show === null) {
            overlay.classList.toggle('active');
        } else {
            overlay.classList.toggle('active', show);
        }

        if (overlay.classList.contains('active')) {
            setTimeout(() => searchInput.focus(), 100);
        } else {
            searchInput.value = '';
            document.getElementById('searchSuggestions').innerHTML = '';
        }
    }

    initializeScrollBehavior() {
        let lastScroll = 0;
        const nav = document.getElementById('arcaneanNav');

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }
}

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.arcaneanNav = new ArcaneanNav();
    });
} else {
    window.arcaneanNav = new ArcaneanNav();
}
