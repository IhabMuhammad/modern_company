// Global Variables
let currentTheme = 'light';
let currentLang = 'en';
let canvas, ctx;
let particles = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initBackground();
    loadPreferences();
    startBackgroundAnimation();
}

// Background Animation System
function initBackground() {
    canvas = document.getElementById('background-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    createParticles();

    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 20));
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.5 ? '#6366f1' : '#8b5cf6'
        });
    }
}

function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
    });

    // Draw connections
    particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
            const distance = Math.sqrt(
                Math.pow(particle.x - otherParticle.x, 2) + 
                Math.pow(particle.y - otherParticle.y, 2)
            );

            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`;
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animateBackground);
}

function startBackgroundAnimation() {
    animateBackground();
}

// Navigation System
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    document.getElementById(pageId).classList.add('active');

    // Update navigation active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    event.target.classList.add('active');

    // Close mobile menu if open
    closeMobileMenu();
}

// Theme Management
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const themeButton = document.querySelector('.theme-toggle');
    themeButton.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    
    // Save preference
    localStorage.setItem('theme', currentTheme);
}

// Language Management
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    
    updateLanguageContent();
    
    // Save preference
    localStorage.setItem('language', currentLang);
}

function updateLanguageContent() {
    document.querySelectorAll('[data-en]').forEach(element => {
        const text = element.getAttribute(`data-${currentLang}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else if (element.tagName === 'OPTION') {
                element.textContent = text;
            } else {
                element.textContent = text;
            }
        }
    });

    // Update language toggle button
    const langButton = document.querySelector('.lang-toggle');
    langButton.textContent = currentLang === 'en' ? 'العربية' : 'English';
}

// Mobile Menu Management
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (navLinks.style.display === 'flex') {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    navLinks.style.display = 'flex';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.flexDirection = 'column';
    navLinks.style.background = 'var(--surface-color)';
    navLinks.style.border = '1px solid var(--border-color)';
    navLinks.style.borderRadius = '0.5rem';
    navLinks.style.padding = '1rem';
    navLinks.style.gap = '1rem';
    navLinks.style.boxShadow = 'var(--shadow-lg)';
    
    // Animate hamburger
    const spans = mobileMenu.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    navLinks.style.display = '';
    navLinks.style.position = '';
    navLinks.style.top = '';
    navLinks.style.left = '';
    navLinks.style.right = '';
    navLinks.style.flexDirection = '';
    navLinks.style.background = '';
    navLinks.style.border = '';
    navLinks.style.borderRadius = '';
    navLinks.style.padding = '';
    navLinks.style.gap = '';
    navLinks.style.boxShadow = '';
    
    // Reset hamburger
    const spans = mobileMenu.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
}

// Form Management
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('.submit-button');
    const buttonText = submitButton.querySelector('.button-text');
    const loading = submitButton.querySelector('.loading');
    
    // Show loading state
    buttonText.style.display = 'none';
    loading.style.display = 'inline-block';
    submitButton.disabled = true;
    
    // Simulate API call
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success message
        showNotification(
            currentLang === 'en' ? 'Message sent successfully!' : 'تم إرسال الرسالة بنجاح!',
            'success'
        );
        
        // Reset form
        e.target.reset();
        
    } catch (error) {
        // Error message
        showNotification(
            currentLang === 'en' ? 'Failed to send message. Please try again.' : 'فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
            'error'
        );
    } finally {
        // Reset button state
        buttonText.style.display = 'inline';
        loading.style.display = 'none';
        submitButton.disabled = false;
        buttonText.textContent = currentLang === 'en' ? 'Send Message' : 'إرسال الرسالة';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Preference Management
function loadPreferences() {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== currentTheme) {
        toggleTheme();
    }

    // Load language preference
    const savedLang = localStorage.getItem('language');
    if (savedLang && savedLang !== currentLang) {
        toggleLanguage();
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }

    /* Mobile menu visibility fix */
    @media (max-width: 768px) {
        .nav-links {
            display: none !important;
        }
        .nav-links.mobile-open {
            display: flex !important;
        }
    }

    @media (min-width: 769px) {
        .nav-links {
            display: flex !important;
        }
    }

    /* Enhanced mobile responsiveness */
    @media (max-width: 480px) {
        .hero h1 {
            font-size: 2rem;
        }
        
        .hero p {
            font-size: 1rem;
        }
        
        .section {
            padding: 2rem 1rem;
        }
        
        .section h2 {
            font-size: 2rem;
        }
        
        .card {
            padding: 1.5rem;
        }
        
        .form-container {
            padding: 1.5rem;
        }
    }

    /* Accessibility improvements */
    .nav-links a:focus,
    .theme-toggle:focus,
    .lang-toggle:focus,
    input:focus,
    textarea:focus,
    select:focus,
    .submit-button:focus,
    .cta-button:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
        :root {
            --border-color: #000000;
        }
        
        [data-theme="dark"] {
            --border-color: #ffffff;
        }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        #background-canvas {
            display: none;
        }
    }

    /* Print styles */
    @media print {
        header,
        footer,
        .theme-toggle,
        .lang-toggle,
        .mobile-menu,
        #background-canvas {
            display: none !important;
        }
        
        main {
            margin-top: 0 !important;
        }
        
        .page {
            display: block !important;
        }
        
        .section {
            break-inside: avoid;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe cards when they're created
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
    
    // Arrow key navigation for menu items
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentIndex = Array.from(navLinks).findIndex(link => link === document.activeElement);
        
        if (currentIndex !== -1) {
            e.preventDefault();
            const nextIndex = e.key === 'ArrowLeft' 
                ? (currentIndex - 1 + navLinks.length) % navLinks.length
                : (currentIndex + 1) % navLinks.length;
            navLinks[nextIndex].focus();
        }
    }
});

// Error handling for missing elements
window.addEventListener('error', function(e) {
    console.warn('Non-critical error caught:', e.message);
    // Don't let minor errors break the entire experience
    return true;
});

// Final initialization check
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}