// GSAP Animations for AlumniConnect
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Page load animations
    initPageAnimations();
    
    // Scroll-triggered animations
    initScrollAnimations();
    
    // Navigation animations
    initNavigationAnimations();
    
    // Statistics counter animation
    initStatsAnimation();
    
    // Page transition setup
    initPageTransitions();
});

function initPageAnimations() {
    // Hero content animation
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.to('.hero-content', {
        duration: 1.2,
        opacity: 1,
        y: 0,
        ease: "power3.out"
    })
    .to('.scroll-indicator', {
        duration: 0.8,
        opacity: 1,
        ease: "power2.out"
    }, "-=0.5");

    // Stagger animation for navigation items
    gsap.fromTo('nav .nav-link', {
        opacity: 0,
        y: -20
    }, {
        duration: 0.8,
        opacity: 1,
        y: 0,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.3
    });

    // Logo animation
    gsap.fromTo('nav .w-8', {
        scale: 0,
        rotation: -180
    }, {
        duration: 1,
        scale: 1,
        rotation: 0,
        ease: "back.out(1.7)",
        delay: 0.2
    });
}

function initScrollAnimations() {
    // Features section animation
    gsap.to('.feature-header', {
        duration: 1,
        opacity: 1,
        y: 0,
        ease: "power3.out",
        scrollTrigger: {
            trigger: '.feature-header',
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        }
    });

    // Feature cards stagger animation
    gsap.to('.feature-card', {
        duration: 0.8,
        opacity: 1,
        y: 0,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: '.feature-card',
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        }
    });

    // Statistics section animation
    gsap.to('.stat-item', {
        duration: 0.8,
        opacity: 1,
        y: 0,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: '.stat-item',
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        }
    });

    // CTA section animation
    gsap.to('.cta-section', {
        duration: 1,
        opacity: 1,
        y: 0,
        ease: "power3.out",
        scrollTrigger: {
            trigger: '.cta-section',
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        }
    });

    // Parallax effect for hero background
    gsap.to('#constellation-canvas', {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: "#home",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Navigation background on scroll
    ScrollTrigger.create({
        start: "100",
        end: 99999,
        toggleClass: {
            className: "nav-scrolled",
            targets: "nav"
        }
    });
}

function initNavigationAnimations() {
    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            
            if (target) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: target,
                    ease: "power3.inOut"
                });
            }
        });
    });

    // Hover animations for buttons
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                duration: 0.3,
                scale: 1.05,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                duration: 0.3,
                scale: 1,
                ease: "power2.out"
            });
        });
    });

    // Feature card hover animations
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.4,
                y: -10,
                boxShadow: "0 20px 60px rgba(65, 105, 225, 0.3)",
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.4,
                y: 0,
                boxShadow: "0 10px 30px rgba(65, 105, 225, 0.1)",
                ease: "power2.out"
            });
        });
    });
}

function initStatsAnimation() {
    // Counter animation for statistics
    document.querySelectorAll('[data-count]').forEach(counter => {
        ScrollTrigger.create({
            trigger: counter,
            start: "top 80%",
            onEnter: () => {
                const target = parseInt(counter.dataset.count);
                const obj = { value: 0 };
                
                gsap.to(obj, {
                    duration: 2,
                    value: target,
                    ease: "power2.out",
                    onUpdate: () => {
                        counter.textContent = Math.floor(obj.value).toLocaleString();
                    },
                    onComplete: () => {
                        counter.textContent = target.toLocaleString();
                    }
                });
            }
        });
    });
}

function initPageTransitions() {
    // Page transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, hsl(240, 100%, 70%), hsl(280, 100%, 70%));
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Loading spinner
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    overlay.appendChild(spinner);
    document.body.appendChild(overlay);

    // Intercept navigation clicks
    document.querySelectorAll('a[href*=".html"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // Animate overlay in
            gsap.to(overlay, {
                duration: 0.6,
                opacity: 1,
                ease: "power3.inOut",
                onComplete: () => {
                    window.location.href = href;
                }
            });
        });
    });

    // Page entrance animation
    window.addEventListener('load', () => {
        gsap.to(overlay, {
            duration: 0.8,
            opacity: 0,
            ease: "power3.inOut",
            delay: 0.5
        });
    });
}

// Utility functions for animations
function fadeInUp(element, delay = 0) {
    gsap.fromTo(element, {
        opacity: 0,
        y: 30
    }, {
        duration: 0.8,
        opacity: 1,
        y: 0,
        ease: "power3.out",
        delay: delay
    });
}

function scaleIn(element, delay = 0) {
    gsap.fromTo(element, {
        scale: 0,
        opacity: 0
    }, {
        duration: 0.6,
        scale: 1,
        opacity: 1,
        ease: "back.out(1.7)",
        delay: delay
    });
}

function slideInFromLeft(element, delay = 0) {
    gsap.fromTo(element, {
        x: -100,
        opacity: 0
    }, {
        duration: 0.8,
        x: 0,
        opacity: 1,
        ease: "power3.out",
        delay: delay
    });
}

function slideInFromRight(element, delay = 0) {
    gsap.fromTo(element, {
        x: 100,
        opacity: 0
    }, {
        duration: 0.8,
        x: 0,
        opacity: 1,
        ease: "power3.out",
        delay: delay
    });
}

// Export functions for use in other scripts
window.AlumniAnimations = {
    fadeInUp,
    scaleIn,
    slideInFromLeft,
    slideInFromRight
};