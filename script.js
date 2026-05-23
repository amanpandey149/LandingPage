/* ==========================================================================
   Aether Labs Interactive Engine - JS Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ✨ Advanced UI/UX Feature: Interactive Spotlight Cursor Glow ---
    const mouseGlow = document.getElementById('mouse-glow');
    
    if (mouseGlow) {
        window.addEventListener('mousemove', (e) => {
            // Reveal on first mouse travel
            mouseGlow.style.opacity = '1';
            // Utilizing translate3d utilizes hardware-accelerated rendering for 60fps tracking
            mouseGlow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        });
        
        window.addEventListener('mouseleave', () => {
            // Hide spotlight when mouse exits browser view
            mouseGlow.style.opacity = '0';
        });
    }

    // --- Mobile Hamburger Menu Drawer ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            // Lock scrolling behind active mobile drawer
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close mobile nav drawer when links are tapped
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // Close menu drawer when clicking outside the canvas
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('open') && 
                !navMenu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // --- Dynamic Glassmorphism Navbar on Scroll ---
    const header = document.getElementById('header');
    
    const handleHeaderScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Run immediately in case page is refreshed while scrolled

    // --- Active Link Scroll-Spy (Intersection Observer) ---
    const sections = document.querySelectorAll('section[id]');
    
    const scrollSpyOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Triggers when section occupies viewport center
        threshold: 0
    };

    const scrollSpyCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    const scrollSpyObserver = new IntersectionObserver(scrollSpyCallback, scrollSpyOptions);
    sections.forEach(section => scrollSpyObserver.observe(section));

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Triggers reveal slightly before item comes in view
        threshold: 0.15
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Element reveals once only
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(element => revealObserver.observe(element));

    // --- Statistics Count-Up Animation (Dedicated Stats Section) ---
    const statsSection = document.getElementById('stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let current = 0;
            const duration = 2200; // ~2.2 seconds animation
            const increment = target / (duration / 16); // ~60fps refresh

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.floor(current);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.innerText = target;
                }
            };
            
            updateCount();
        });
    };

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    animateStats();
                    statsAnimated = true;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });
        
        statsObserver.observe(statsSection);
    }

    // --- ✨ Advanced UI/UX Feature: Testimonials Carousel Slider ---
    const track = document.getElementById('testimonials-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (track && slides.length > 0) {
        let currentIndex = 0;
        const slideCount = slides.length;
        let autoCycleInterval;

        const updateCarousel = () => {
            // Sliding translate coordinate transformation
            track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;
            
            // Highlight active slide indicator dot
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, index) => {
                    if (index === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slideCount;
            updateCarousel();
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            updateCarousel();
        };

        // Reset rotation cycle intervals when human interacts
        const startAutoCycle = () => {
            clearInterval(autoCycleInterval);
            autoCycleInterval = setInterval(nextSlide, 5000); // Cycle slides every 5 seconds
        };

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoCycle();
            });
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoCycle();
            });
        }

        // Dot indicators direct navigation click bindings
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                    startAutoCycle();
                });
            });
        }

        // Initialize Carousel Auto cycle
        startAutoCycle();
    }

    // --- ✨ Advanced UI/UX Feature: Back-to-Top Floating Button ---
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            // Button fades in when scrolling down further than 400px
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            // Scroll back up to the very peak smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Secure Contact Form Submission & Glassmorphism Success Modal ---
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (contactForm && successModal) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent standard page reloading
            
            // Trigger Submitting Button Loader
            submitBtn.classList.add('submitting');
            submitBtn.disabled = true;

            // Mock Secure Network Latency
            setTimeout(() => {
                // Remove Loading animation state
                submitBtn.classList.remove('submitting');
                submitBtn.disabled = false;
                
                // Show gorgeous overlay modal dialog
                successModal.classList.add('open');
                document.body.style.overflow = 'hidden'; // Lock background scrolling
                
                // Wipe form inputs clean
                contactForm.reset();
            }, 1800);
        });

        // Close Modal Action
        const closeModal = () => {
            successModal.classList.remove('open');
            document.body.style.overflow = '';
        };

        closeModalBtn.addEventListener('click', closeModal);
        
        // Close modal when clicking dark overlay backdrop area
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeModal();
            }
        });
    }

    // --- Mock Newsletter Signup ---
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input');
            const emailValue = emailInput.value;
            
            if (emailValue) {
                // Instantly visual response with mini placeholder popup
                emailInput.value = '';
                emailInput.placeholder = 'Securely subscribed!';
                
                // Reset placeholder after a few seconds
                setTimeout(() => {
                    emailInput.placeholder = 'Enter email address';
                }, 3500);
            }
        });
    }
});
