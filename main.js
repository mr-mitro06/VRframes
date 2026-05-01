/**
 * VR FRAMES - Premium Javascript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Preloader Logic
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
            // Initialize AOS after preloader
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                delay: 100
            });
        }, 1000);
    }, 1800);

    // 3. Initialize Icons
    lucide.createIcons();

    // 4. Theme Toggler (Dark/Light Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check local storage for preference
    const savedTheme = localStorage.getItem('vrframes_theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('vrframes_theme', newTheme);
        
        // Re-create icons to ensure they render correctly (if needed)
        lucide.createIcons();
    });

    // 5. Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 6. Mobile Navigation
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    let isMenuOpen = false;

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            navLinks.classList.toggle('active');
            
            // Toggle icon
            const icon = navToggle.querySelector('i');
            if (isMenuOpen) {
                icon.setAttribute('data-lucide', 'x');
                // Lock scroll
                lenis.stop();
                document.body.style.overflow = 'hidden';
            } else {
                icon.setAttribute('data-lucide', 'menu');
                // Unlock scroll
                lenis.start();
                document.body.style.overflow = '';
            }
            lucide.createIcons();
        });
    }

    // Close menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (isMenuOpen) {
                isMenuOpen = false;
                navLinks.classList.remove('active');
                navToggle.querySelector('i').setAttribute('data-lucide', 'menu');
                lucide.createIcons();
                lenis.start();
                document.body.style.overflow = '';
            }
            
            // Smooth scroll to anchor
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    lenis.scrollTo(targetElement, { offset: -90 }); // offset for fixed header
                }
            }
        });
    });

    // 7. Custom Cursor Logic
    // Only init if device supports hover (desktop)
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Slight delay for follower
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 80);
        });

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .portfolio-item');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.style.width = '60px';
                follower.style.height = '60px';
                follower.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                follower.style.borderColor = 'rgba(255, 215, 0, 0.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                follower.style.width = '40px';
                follower.style.height = '40px';
                follower.style.backgroundColor = 'transparent';
                follower.style.borderColor = 'var(--accent-main)';
            });
        });
    } else {
        // Remove cursors on touch devices
        document.querySelector('.cursor')?.remove();
        document.querySelector('.cursor-follower')?.remove();
    }
});
