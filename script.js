// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('mobile-menu-open');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('mobile-menu-open');
    }));

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
        }
    });
}

// Navigation active link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Hero Carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let autoSlideInterval;
let isVideoPlaying = false;

function showSlide(n) {
    // Remove active classes
    slides.forEach(slide => {
        slide.classList.remove('active', 'prev');
        const video = slide.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    });
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Handle slide bounds
    if (n >= slides.length) currentSlide = 0;
    if (n < 0) currentSlide = slides.length - 1;
    
    // Set previous slide
    const prevSlideIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    slides[prevSlideIndex].classList.add('prev');
    
    // Activate current slide
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Handle video playback
    const currentSlideElement = slides[currentSlide];
    const video = currentSlideElement.querySelector('video');
    
    if (video && currentSlideElement.dataset.type === 'video') {
        isVideoPlaying = true;
        video.play();
        
        // Clear existing auto-slide interval
        clearInterval(autoSlideInterval);
        
        // Wait for video to end, then resume auto-slide
        video.addEventListener('ended', () => {
            isVideoPlaying = false;
            startAutoSlide();
            setTimeout(nextSlide, 1000); // Wait 1 second after video ends
        }, { once: true });
        
        // Fallback: if video is very long (more than 30 seconds), skip to next slide
        setTimeout(() => {
            if (isVideoPlaying && !video.paused) {
                video.pause();
                isVideoPlaying = false;
                startAutoSlide();
                nextSlide();
            }
        }, 30000);
    } else {
        isVideoPlaying = false;
        startAutoSlide();
    }
}

function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
}

function startAutoSlide() {
    clearInterval(autoSlideInterval);
    if (!isVideoPlaying) {
        autoSlideInterval = setInterval(nextSlide, 4000); // 4 seconds for images
    }
}

// Event listeners for carousel
if (nextBtn) nextBtn.addEventListener('click', () => {
    clearInterval(autoSlideInterval);
    nextSlide();
});

if (prevBtn) prevBtn.addEventListener('click', () => {
    clearInterval(autoSlideInterval);
    prevSlide();
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentSlide);
});

// Handle window resize
window.addEventListener('resize', () => {
    showSlide(currentSlide);
});

// Facilities Gallery
class FacilitiesGallery {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.gallery-slide');
        this.dots = document.querySelectorAll('.gallery-dot');
        this.prevBtn = document.querySelector('.prev-nav');
        this.nextBtn = document.querySelector('.next-nav');
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        if (!this.slides.length) return;
        
        // Add event listeners
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto-play
        this.startAutoPlay();
        
        // Pause on hover
        const gallery = document.querySelector('.facilities-gallery');
        gallery?.addEventListener('mouseenter', () => this.pauseAutoPlay());
        gallery?.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    goToSlide(index) {
        // Remove active classes
        this.slides[this.currentSlide]?.classList.remove('active');
        this.dots[this.currentSlide]?.classList.remove('active');
        
        // Update current slide
        this.currentSlide = index;
        
        // Add active classes
        this.slides[this.currentSlide]?.classList.add('active');
        this.dots[this.currentSlide]?.classList.add('active');
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoPlay() {
        this.pauseAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize Facilities Gallery
document.addEventListener('DOMContentLoaded', function() {
    new FacilitiesGallery();
    
    // Video play button functionality
    const videoPlayBtn = document.querySelector('.video-play-btn');
    const aboutVideo = document.getElementById('aboutVideo');
    
    if (videoPlayBtn && aboutVideo) {
        videoPlayBtn.addEventListener('click', function() {
            if (aboutVideo.paused) {
                aboutVideo.play();
                this.style.display = 'none';
            }
        });
        
        aboutVideo.addEventListener('click', function() {
            if (!this.paused) {
                this.pause();
                videoPlayBtn.style.display = 'flex';
            }
        });
        
        aboutVideo.addEventListener('ended', function() {
            videoPlayBtn.style.display = 'flex';
        });
        
        aboutVideo.addEventListener('play', function() {
            videoPlayBtn.style.display = 'none';
        });
        
        aboutVideo.addEventListener('pause', function() {
            videoPlayBtn.style.display = 'flex';
        });
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Ensure backend service is available (with fallback)
    const ensureBackendService = () => {
        if (!window.backendService) {
            console.log('Backend service not available, using direct WhatsApp approach');
        }
        return true;
    };
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Ensure backend service is ready
        ensureBackendService();
        
        // Show loading state
        const submitBtn = this.querySelector('.contact-submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        console.log('Form data collected:', data); // Debug log
        
        // Basic validation
        if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.service || !data.preferredDate) {
            alert('Please fill in all required fields.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // Phone validation (basic)
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
            alert('Please enter a valid phone number.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        try {
            // Generate reference ID for tracking
            const referenceId = 'GRC' + Date.now().toString().slice(-6) + Math.random().toString(36).substring(2, 5).toUpperCase();
            
            // Create WhatsApp message
            const message = `Hello Gaman Rehabilitation Center,

I would like to schedule an appointment.

*Personal Details:*
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}

*Appointment Details:*
Service: ${data.service}
Preferred Date: ${data.preferredDate}

*Additional Notes:*
${data.additionalNotes || 'None'}

*Reference ID:* ${referenceId}

Thank you!`;
            
            // Open WhatsApp immediately
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/919666424207?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');
            
            // Show success message
            alert('✅ Your inquiry has been submitted successfully! You will be redirected to WhatsApp to complete your appointment request.');
            
            // Reset form
            this.reset();
            
            // Try to save to Firebase in background (optional)
            try {
                if (window.backendService && window.backendService.isInitialized) {
                    await window.backendService.submitContactForm(data);
                    console.log('✅ Contact form also saved to database');
                }
            } catch (bgError) {
                console.log('ℹ️ Form sent to WhatsApp successfully, database save optional:', bgError);
            }
            
        } catch (error) {
            console.error('Error processing form:', error);
            
            // Even if there's an error, still try to send to WhatsApp
            try {
                const referenceId = 'GRC' + Date.now().toString().slice(-6) + Math.random().toString(36).substring(2, 5).toUpperCase();
                const message = `Hello Gaman Rehabilitation Center,

I would like to schedule an appointment.

*Personal Details:*
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}

*Appointment Details:*
Service: ${data.service}
Preferred Date: ${data.preferredDate}

*Additional Notes:*
${data.additionalNotes || 'None'}

*Reference ID:* ${referenceId}

Thank you!`;
                
                const encodedMessage = encodeURIComponent(message);
                const whatsappURL = `https://wa.me/919666424207?text=${encodedMessage}`;
                window.open(whatsappURL, '_blank');
                
                alert('✅ Your inquiry will be sent via WhatsApp!');
                this.reset();
            } catch (whatsappError) {
                alert('❌ Please try again or contact us directly at +91-9666424207');
            }
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Testimonials Navigation
class TestimonialsNavigator {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 6;
        this.init();
    }

    init() {
        // Get DOM elements
        this.testimonialCards = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.testimonial-dots .dot');
        this.prevBtn = document.querySelector('.prev-arrow');
        this.nextBtn = document.querySelector('.next-arrow');

        if (!this.testimonialCards.length) return;

        // Add event listeners
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());

        // Add dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Add click handlers for testimonial cards to open Google reviews
        this.testimonialCards.forEach(card => {
            card.addEventListener('click', () => {
                const reviewLink = card.dataset.link;
                if (reviewLink) {
                    window.open(reviewLink, '_blank', 'noopener,noreferrer');
                }
            });
        });

        // Auto-play functionality
        this.startAutoPlay();

        // Pause auto-play on hover
        document.querySelector('.featured-testimonial')?.addEventListener('mouseenter', () => {
            this.pauseAutoPlay();
        });

        document.querySelector('.featured-testimonial')?.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }

    goToSlide(slideIndex) {
        // Remove active class from current slide and dot
        this.testimonialCards[this.currentSlide]?.classList.remove('active');
        this.dots[this.currentSlide]?.classList.remove('active');

        // Update current slide
        this.currentSlide = slideIndex;

        // Add active class to new slide and dot
        this.testimonialCards[this.currentSlide]?.classList.add('active');
        this.dots[this.currentSlide]?.classList.add('active');

        // Move carousel container
        const carouselContainer = document.querySelector('.testimonial-carousel-container');
        if (carouselContainer) {
            const translateX = -(slideIndex * (100 / 6)); // Each slide is 1/6 of container width
            carouselContainer.style.transform = `translateX(${translateX}%)`;
        }

        // Restart auto-play
        this.restartAutoPlay();
    }



    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 8000); // Change slide every 8 seconds
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    restartAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    }
}

// Testimonial Modal Functions
function closeTestimonialModal() {
    const modal = document.getElementById('testimonialModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Legacy function for compatibility
function openModal() {
    // This will be handled by the testimonials manager
}

// Booking Modal Function (used by CTA buttons)
function openBookingModal() {
    openAppointmentModal('book-appointment');
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('testimonialModal');
    if (event.target === modal) {
        closeTestimonialModal();
    }
});

// Close modal with escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeTestimonialModal();
    }
});

// Initialize testimonials when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new TestimonialsNavigator();
});

// Video Play Functionality
const playBtn = document.querySelector('.play-btn');
const video = document.querySelector('.video-container video');
const videoOverlay = document.querySelector('.video-overlay');

if (playBtn && video) {
    playBtn.addEventListener('click', () => {
        video.play();
        videoOverlay.style.opacity = '0';
        videoOverlay.style.pointerEvents = 'none';
    });
    
    video.addEventListener('pause', () => {
        videoOverlay.style.opacity = '1';
        videoOverlay.style.pointerEvents = 'auto';
    });
    
    video.addEventListener('ended', () => {
        videoOverlay.style.opacity = '1';
        videoOverlay.style.pointerEvents = 'auto';
    });
}

// Animate on Scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .team-card, .metric-card, .value-card, .stat-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    
    // Set minimum date for appointment booking to today
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
});

// Counter Animation for Statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h3, .metric-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number based on original text
            const originalText = counter.textContent;
            if (originalText.includes('%')) {
                counter.textContent = Math.floor(current) + '%';
            } else if (originalText.includes('+')) {
                counter.textContent = Math.floor(current) + '+';
            } else if (originalText.includes('/')) {
                counter.textContent = (current / 10).toFixed(1) + '/5';
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Trigger counter animation when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe all stat sections
document.addEventListener('DOMContentLoaded', () => {
    const statSections = document.querySelectorAll('.hero-stats, .excellence-stats, .metrics-grid');
    statSections.forEach(section => {
        if (section) {
            statsObserver.observe(section);
        }
    });
});

// Appointment Modal Functions
function openAppointmentModal(tab = 'book-appointment') {
    const modal = document.getElementById('bookAppointmentModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        switchTab(tab);
    }
}

function closeAppointmentModal() {
    const modal = document.getElementById('bookAppointmentModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    const tabContent = document.getElementById(tabName);
    if (tabContent) {
        tabContent.classList.add('active');
    }
    
    // Add active class to selected tab button
    const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (tabBtn) {
        tabBtn.classList.add('active');
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('bookAppointmentModal');
    const modalContainer = document.querySelector('.modal-container');
    if (event.target === modal || (modal && modal.contains(event.target) && !modalContainer.contains(event.target))) {
        closeAppointmentModal();
    }
});

// Close modal with escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAppointmentModal();
    }
});

// Book Appointment Button Functionality
const bookAppointmentBtns = document.querySelectorAll('.book-appointment-btn, .btn-primary');

bookAppointmentBtns.forEach(btn => {
    if (btn.textContent.includes('Book') || btn.textContent.includes('Consultation') || btn.textContent.includes('Journey')) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openAppointmentModal('book-appointment');
        });
    }
});

// Service Selection Enhancement
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('click', () => {
        const serviceName = card.querySelector('h3').textContent;
        openAppointmentModal('book-appointment');
        
        // Pre-select the service in the modal form
        setTimeout(() => {
            const serviceSelects = document.querySelectorAll('.appointment-form select');
            serviceSelects.forEach(select => {
                if (select.options[0].textContent === 'SELECT SERVICE') {
                    const options = select.options;
                    for (let i = 0; i < options.length; i++) {
                        if (options[i].text.includes(serviceName.split(' ')[0])) {
                            select.selectedIndex = i;
                            break;
                        }
                    }
                }
            });
        }, 100);
    });
});

// Video Controls
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.getElementById('heroVideo');
    const muteToggle = document.getElementById('muteToggle');
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    if (heroVideo && muteToggle) {
        // Mute/Unmute functionality
        muteToggle.addEventListener('click', function() {
            if (heroVideo.muted) {
                heroVideo.muted = false;
                muteToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            } else {
                heroVideo.muted = true;
                muteToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            }
        });
    }
    
    if (heroVideo && playPauseBtn) {
        // Play/Pause functionality
        playPauseBtn.addEventListener('click', function() {
            // Find the video data in viewport manager
            const videoData = window.videoViewportManager?.videos?.find(v => v.element === heroVideo);
            
            if (heroVideo.paused) {
                heroVideo.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playPauseBtn.title = 'Pause video';
                // Clear manual pause flag when user clicks play
                if (videoData) {
                    videoData.manuallyPaused = false;
                }
            } else {
                heroVideo.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.title = 'Play video';
                // Set manual pause flag when user clicks pause
                if (videoData) {
                    videoData.manuallyPaused = true;
                }
            }
        });
        
        // Update button state when video plays/pauses (including from other sources)
        heroVideo.addEventListener('play', function() {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playPauseBtn.title = 'Pause video';
        });
        
        heroVideo.addEventListener('pause', function() {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playPauseBtn.title = 'Play video';
        });
        
        // Handle video ended event
        heroVideo.addEventListener('ended', function() {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playPauseBtn.title = 'Play video';
        });
    }
});

// Loading Animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Lazy Loading for Images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// WhatsApp Button Enhancement
const whatsappFloat = document.querySelector('.whatsapp-float a');
if (whatsappFloat) {
    whatsappFloat.addEventListener('click', (e) => {
        e.preventDefault();
        
        const message = `Hello Gaman Rehabilitation Center!

I visited your website and would like to know more about your rehabilitation services.

Could you please provide me with more information about:
- Available services
- Appointment booking
- Consultation process

Thank you!`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/919666424207?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
    });
}

// Appointment Modal Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const appointmentForms = document.querySelectorAll('.appointment-form');
    
    appointmentForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            const formData = new FormData(this);
            const data = {};
            
            // Extract data from form using name attributes
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Get active tab to determine form type
            const activeTab = document.querySelector('.tab-btn.active').textContent;
            
            try {
                // Check if backend service is available
                if (!window.backendService) {
                    throw new Error('Backend service not initialized. Please refresh the page and try again.');
                }
                
                console.log('🔄 Submitting form data:', data);
                console.log('📋 Active tab:', activeTab);
                
                let result;
                
                // Submit to appropriate backend endpoint based on form type
                if (activeTab.includes('APPOINTMENT') || activeTab.includes('VISIT')) {
                    if (activeTab.includes('VISIT')) {
                        result = await window.backendService.scheduleCenterVisit({
                            name: data.name,
                            phone: data.phone,
                            email: data.email,
                            visitDate: data.appointmentDate || data.visitDate,
                            message: data.additionalNotes || '',
                            formType: activeTab
                        });
                    } else {
                        result = await window.backendService.bookAppointment({
                            name: data.name,
                            phone: data.phone,
                            email: data.email,
                            service: data.service,
                            appointmentDate: data.appointmentDate || data.visitDate,
                            referredBy: data.referredBy,
                            doctor: data.doctor,
                            additionalNotes: data.additionalNotes || '',
                            formType: activeTab
                        });
                    }
                } else if (activeTab.includes('CALL BACK')) {
                    result = await window.backendService.requestCallback({
                        name: data.name,
                        phone: data.phone,
                        preferredTime: data.preferredTime,
                        urgency: data.urgency,
                        reason: data.reason,
                        formType: activeTab
                    });
                } else if (activeTab.includes('ASSESSMENT')) {
                    result = await window.backendService.requestFreeAssessment({
                        name: data.name,
                        phone: data.phone,
                        email: data.email,
                        preferredDate: data.preferredDate,
                        healthCondition: data.healthCondition,
                        formType: activeTab
                    });
                } else {
                    // Default to appointment booking
                    result = await window.backendService.bookAppointment({
                        ...data,
                        formType: activeTab
                    });
                }
                
                if (result.success) {
                    // Create WhatsApp message
                    let message = `Hello Gaman Rehabilitation Center,\n\nI would like to request: ${activeTab}\n\n`;
                    
                    // Format data for WhatsApp message
                    if (data.name) message += `Name: ${data.name}\n`;
                    if (data.phone) message += `Phone: ${data.phone}\n`;
                    if (data.email) message += `Email: ${data.email}\n`;
                    if (data.service) message += `Service: ${data.service}\n`;
                    if (data.appointmentDate) message += `Appointment Date: ${data.appointmentDate}\n`;
                    if (data.visitDate) message += `Visit Date: ${data.visitDate}\n`;
                    if (data.preferredDate) message += `Preferred Date: ${data.preferredDate}\n`;
                    if (data.preferredTime) message += `Preferred Time: ${data.preferredTime}\n`;
                    if (data.urgency) message += `Urgency: ${data.urgency}\n`;
                    if (data.referredBy) message += `Referred By: ${data.referredBy}\n`;
                    if (data.doctor) message += `Doctor: ${data.doctor}\n`;
                    if (data.reason) message += `Reason: ${data.reason}\n`;
                    if (data.healthCondition) message += `Health Condition: ${data.healthCondition}\n`;
                    if (data.additionalNotes) message += `Additional Notes: ${data.additionalNotes}\n`;
                    
                    message += `\n*Reference ID:* ${result.id}\n\nThank you!`;
                    
                    // Open WhatsApp
                    const encodedMessage = encodeURIComponent(message);
                    const whatsappURL = `https://wa.me/919666424207?text=${encodedMessage}`;
                    window.open(whatsappURL, '_blank');
                    
                    // Close modal and reset form
                    closeAppointmentModal();
                    this.reset();
                    
                    // Show success message
                    alert('✅ Your request has been submitted successfully! You will be redirected to WhatsApp to complete your request.');
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                console.error('Error submitting appointment form:', error);
                alert('❌ There was an error submitting your request. Please try again or contact us directly.');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    });
});

// Form Field Enhancements
const formInputs = document.querySelectorAll('input, select, textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Search functionality for services
function filterServices(searchTerm) {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Error handling for missing elements
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

// Performance optimization - debounce scroll events
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

// Apply debounce to scroll handlers
const debouncedAnimateOnScroll = debounce(animateOnScroll, 100);
window.removeEventListener('scroll', animateOnScroll);
window.addEventListener('scroll', debouncedAnimateOnScroll);

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Enable keyboard navigation for carousel
    if (e.key === 'ArrowLeft') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.closest('.image-carousel')) {
            prevSlide();
        }
    } else if (e.key === 'ArrowRight') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.closest('.image-carousel')) {
            nextSlide();
        }
    }
});

// Add ARIA labels and roles for better accessibility
document.addEventListener('DOMContentLoaded', () => {
    // Add role to carousel
    const carousel = document.querySelector('.image-carousel');
    if (carousel) {
        carousel.setAttribute('role', 'region');
        carousel.setAttribute('aria-label', 'Image carousel');
    }
});

// Video Viewport Observer - Auto pause/play when scrolling
class VideoViewportManager {
    constructor() {
        this.videos = [];
        this.init();
    }

    init() {
        // Find all videos in the page
        const videoElements = document.querySelectorAll('video');
        
        videoElements.forEach(video => {
            this.videos.push({
                element: video,
                wasPlaying: false,
                manuallyPaused: false,
                isAutoPlaying: video.autoplay
            });
        });

        // Create intersection observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                const videoData = this.videos.find(v => v.element === video);
                
                if (entry.isIntersecting) {
                    // Video is visible - only play if it was playing before AND not manually paused
                    if (videoData && videoData.wasPlaying && video.paused && !videoData.manuallyPaused) {
                        video.play().catch(e => console.log('Video play failed:', e));
                    }
                } else {
                    // Video is not visible - pause and remember playing state
                    if (videoData) {
                        videoData.wasPlaying = !video.paused;
                        if (!video.paused) {
                            video.pause();
                        }
                    }
                }
            });
        }, {
            threshold: 0.5, // Video must be at least 50% visible
            rootMargin: '0px'
        });

        // Start observing all videos
        this.videos.forEach(videoData => {
            this.observer.observe(videoData.element);
        });

        // Listen for manual play/pause events
        this.videos.forEach(videoData => {
            const video = videoData.element;
            
            video.addEventListener('play', (e) => {
                videoData.wasPlaying = true;
                // Reset manual pause flag when user plays the video
                videoData.manuallyPaused = false;
            });
            
            video.addEventListener('pause', (e) => {
                videoData.wasPlaying = false;
                // Check if this pause was triggered by user interaction
                // If the video is visible and gets paused, it's likely manual
                const rect = video.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                if (isVisible) {
                    videoData.manuallyPaused = true;
                }
            });
        });
    }

    // Method to add new videos dynamically
    addVideo(videoElement) {
        const videoData = {
            element: videoElement,
            wasPlaying: false
        };
        
        this.videos.push(videoData);
        this.observer.observe(videoElement);
        
        videoElement.addEventListener('play', () => {
            videoData.wasPlaying = true;
        });
        
        videoElement.addEventListener('pause', () => {
            videoData.wasPlaying = false;
        });
    }

    // Clean up observer
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Initialize video viewport manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for all videos to load
    setTimeout(() => {
        window.videoViewportManager = new VideoViewportManager();
        console.log('✅ Video viewport manager initialized - videos will auto-pause when scrolled out of view');
    }, 1000);
});

console.log('Gaman Rehabilitation Center website loaded successfully!');