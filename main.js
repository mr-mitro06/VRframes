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

    // 2. Preloader Logic — Cinematic Curtain Reveal
    const preloader = document.getElementById('preloader');
    
    // Wait for animations to play, then reveal
    setTimeout(() => {
        preloader.classList.add('reveal');
        setTimeout(() => {
            preloader.style.display = 'none';
            preloader.style.pointerEvents = 'none';
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                delay: 100
            });
        }, 1300);
    }, 2800);

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

    // 7. Hero Slider — Auto-rotate with cinematic crossfade
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }
    // 8. Gallery Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            let visibleCount = 0;
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                    visibleCount++;
                    // Retrigger AOS animation
                    item.classList.remove('aos-animate');
                    setTimeout(() => item.classList.add('aos-animate'), 50);
                } else {
                    item.classList.add('hidden');
                }
            });

            // Fix masonry empty columns: dynamically adjust column count based on visible items
            const grid = document.querySelector('.portfolio-grid');
            if (window.innerWidth > 1200) {
                grid.style.columnCount = Math.min(visibleCount, 3);
            } else if (window.innerWidth > 992) {
                grid.style.columnCount = Math.min(visibleCount, 3);
            } else if (window.innerWidth > 768) {
                grid.style.columnCount = Math.min(visibleCount, 2);
            } else {
                grid.style.columnCount = ""; // Let mobile CSS handle flex swipe
            }

            // Update lightbox images array
            updateLightboxImages();
        });
    });

    // 9. Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const nextBtn = document.querySelector('.lightbox-next');
    const prevBtn = document.querySelector('.lightbox-prev');
    
    let currentLightboxImages = [];
    let currentImageIndex = 0;

    function updateLightboxImages() {
        currentLightboxImages = Array.from(document.querySelectorAll('.portfolio-item:not(.hidden) img'));
    }

    // Initial update
    updateLightboxImages();

    portfolioItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const img = item.querySelector('img');
            currentImageIndex = currentLightboxImages.indexOf(img);
            if(currentImageIndex === -1) currentImageIndex = 0; // fallback
            
            showLightbox(img.src);
        });
    });

    function showLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        lenis.stop();
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lenis.start();
        document.body.style.overflow = '';
    }

    function showNext() {
        if(currentLightboxImages.length === 0) return;
        currentImageIndex = (currentImageIndex + 1) % currentLightboxImages.length;
        lightboxImg.src = currentLightboxImages[currentImageIndex].src;
    }

    function showPrev() {
        if(currentLightboxImages.length === 0) return;
        currentImageIndex = (currentImageIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
        lightboxImg.src = currentLightboxImages[currentImageIndex].src;
    }

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === document.querySelector('.lightbox-content')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    // Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    lightbox.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) showNext();
        if (touchEndX > touchStartX + swipeThreshold) showPrev();
    }

});
