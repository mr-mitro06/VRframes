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

    // --- HISTORY STATE MANAGEMENT (MOBILE BACK BUTTON FIX) ---
    function openOverlay() {
        history.pushState({ overlayOpen: true }, '', '');
        lenis.stop();
        document.body.style.overflow = 'hidden';
    }

    function closeAllOverlays() {
        // 1. Close Nav Menu
        if (isMenuOpen) {
            isMenuOpen = false;
            navLinks.classList.remove('active');
            if (navToggle) navToggle.querySelector('i').setAttribute('data-lucide', 'menu');
        }
        
        // 2. Close Lightbox
        lightbox.classList.remove('active');
        
        // 3. Close Info Modals
        infoModals.forEach(m => m.classList.remove('active'));
        
        lucide.createIcons();
        lenis.start();
        document.body.style.overflow = '';
    }

    window.addEventListener('popstate', (e) => {
        // Hardware back button triggered
        closeAllOverlays();
    });

    function closeOverlayFromUI() {
        if (history.state && history.state.overlayOpen) {
            history.back(); // Triggers popstate -> closeAllOverlays
        } else {
            closeAllOverlays();
        }
    }

    // 6. Mobile Navigation
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    let isMenuOpen = false;

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            if (!isMenuOpen) {
                isMenuOpen = true;
                navLinks.classList.add('active');
                navToggle.querySelector('i').setAttribute('data-lucide', 'x');
                openOverlay();
            } else {
                closeOverlayFromUI();
            }
            lucide.createIcons();
        });
    }

    // Close menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (isMenuOpen) {
                closeOverlayFromUI();
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
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            let visibleCount = 0;
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                    visibleCount++;
                    item.classList.remove('aos-animate');
                    setTimeout(() => item.classList.add('aos-animate'), 50);
                } else {
                    item.classList.add('hidden');
                }
            });

            const grid = document.querySelector('.portfolio-grid');
            if (window.innerWidth > 1200) {
                grid.style.columnCount = Math.min(visibleCount, 3);
            } else if (window.innerWidth > 992) {
                grid.style.columnCount = Math.min(visibleCount, 3);
            } else if (window.innerWidth > 768) {
                grid.style.columnCount = Math.min(visibleCount, 2);
            } else {
                grid.style.columnCount = ""; 
            }

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

    updateLightboxImages();

    portfolioItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const img = item.querySelector('img');
            currentImageIndex = currentLightboxImages.indexOf(img);
            if(currentImageIndex === -1) currentImageIndex = 0;
            
            showLightbox(img.src);
        });
    });

    function showLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        openOverlay();
    }

    function closeLightbox() {
        closeOverlayFromUI();
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
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === document.querySelector('.lightbox-content')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    lightbox.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) showNext();
        if (touchEndX > touchStartX + swipeThreshold) showPrev();
    }, {passive: true});

    // 10. Info Modals (Privacy, Terms, Photographer)
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const infoModals = document.querySelectorAll('.info-modal-overlay');
    const infoModalCloses = document.querySelectorAll('.info-modal-close');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                targetModal.classList.add('active');
                openOverlay();
            }
        });
    });

    infoModalCloses.forEach(btn => {
        btn.addEventListener('click', closeOverlayFromUI);
    });

    infoModals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeOverlayFromUI();
            }
        });
    });

});
