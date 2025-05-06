document.addEventListener('DOMContentLoaded', function() {
    // Preloader functionality
    const preloader = document.querySelector('.preloader');
    const images = document.querySelectorAll('img');
    let imagesLoaded = 0;
    
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Function to handle image load
    function imageLoaded() {
        imagesLoaded++;
        console.log(`Image loaded: ${imagesLoaded}/${images.length}`);
        if (imagesLoaded >= images.length) {
            // All images loaded
            setTimeout(function() {
                preloader.classList.add('fade-out');
                document.body.classList.remove('loading');
                
                // Remove preloader from DOM after animation
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 500);
            }, 500); // Delay before hiding preloader
        }
    }
    
    // Check if images are cached
    if (images.length === 0) {
        // No images to load
        preloader.classList.add('fade-out');
        document.body.classList.remove('loading');
    } else {
        // Add load event to each image
        images.forEach(image => {
            // Check if image is already loaded
            if (image.complete) {
                imageLoaded();
            } else {
                image.addEventListener('load', imageLoaded);
                // Handle error case
                image.addEventListener('error', function() {
                    console.log('Image failed to load');
                    imageLoaded();
                });
            }
        });
        
        // Fallback if images take too long to load
        setTimeout(function() {
            console.log('Fallback timeout triggered');
            preloader.classList.add('fade-out');
            document.body.classList.remove('loading');
            
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }, 5000); // 5 second fallback
    }
    
    // Enhanced mobile navigation handling
    const mobileToggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('main');
    const body = document.body;

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            
            // Prevent body scrolling when sidebar is open
            if (sidebar.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
    }

    // Close sidebar when clicking on main content
    if (mainContent) {
        mainContent.addEventListener('click', function() {
            if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }

    // Prevent clicks inside sidebar from closing it
    if (sidebar) {
        sidebar.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Close sidebar when clicking on a link (mobile)
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                body.style.overflow = '';
                
                // Smooth scroll to section
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Add small delay to allow sidebar to close first
                    setTimeout(() => {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                }
            }
        });
    });
    
    // Fix for section heights on mobile
    function adjustSectionHeights() {
        if (window.innerWidth <= 768) {
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                section.style.minHeight = 'auto';
            });
        }
    }
    
    // Run on load and resize
    adjustSectionHeights();
    window.addEventListener('resize', adjustSectionHeights);

    // Fix for portfolio details display
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioDetails = document.querySelectorAll('.portfolio-details');

    if (portfolioItems.length > 0 && portfolioDetails.length > 0) {
        portfolioItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                // Hide all details first
                portfolioDetails.forEach(detail => {
                    detail.classList.remove('active');
                });
                
                // Show the corresponding detail
                if (portfolioDetails[index]) {
                    portfolioDetails[index].classList.add('active');
                }
            });
        });
        
        // Close buttons for portfolio details
        const closeButtons = document.querySelectorAll('.close-details');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                portfolioDetails.forEach(detail => {
                    detail.classList.remove('active');
                });
            });
        });
    }

    // Active navigation highlighting based on scroll position
    function highlightNavigation() {
        let scrollPosition = window.scrollY;
        
        // Add some offset to account for navbar height
        const offset = 100;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - offset;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                document.querySelectorAll('nav ul li a').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section link
                const currentLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
                if (currentLink) {
                    currentLink.classList.add('active');
                }
            }
        });
    }
    
    // Initial call to set active link on page load
    highlightNavigation();
    
    // Update active link on scroll
    window.addEventListener('scroll', highlightNavigation);
    
    // Initialize circular progress bars
    function initSkillCircles() {
        const circles = document.querySelectorAll('.progress-circle');
        
        circles.forEach(circle => {
            const percentage = circle.getAttribute('data-percentage');
            const radius = circle.querySelector('.progress-ring-circle').getAttribute('r');
            const circumference = 2 * Math.PI * radius;
            
            // Set the stroke-dasharray and stroke-dashoffset
            const progressCircle = circle.querySelector('.progress-ring-circle');
            progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
            progressCircle.style.strokeDashoffset = circumference;
            
            // Animate when in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            const offset = circumference - (percentage / 100) * circumference;
                            progressCircle.style.strokeDashoffset = offset;
                        }, 300);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(circle);
        });
    }

    // Call the function when DOM is loaded
    initSkillCircles();
});

// Add Formspree form handling with custom success message
document.addEventListener('DOMContentLoaded', function() {
    // Existing code...
    
    // Formspree form handling with custom success message
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Submit form data to Formspree
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                // Show success message with "Send Another Message" link
                contactForm.innerHTML = `
                    <div class="success-message">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>Message Sent Successfully!</h3>
                        <p>Thank you for reaching out. I'll get back to you soon.</p>
                        <a href="#" class="btn-secondary send-another">Send Another Message</a>
                    </div>
                `;
                
                // Add event listener to the "Send Another Message" link
                const sendAnotherBtn = contactForm.querySelector('.send-another');
                if (sendAnotherBtn) {
                    sendAnotherBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        // Restore the original form
                        contactForm.innerHTML = `
                            <div class="form-group">
                                <input type="text" name="name" placeholder="Your Name" required>
                            </div>
                            <div class="form-group">
                                <input type="email" name="email" placeholder="Your Email" required>
                            </div>
                            <div class="form-group">
                                <input type="text" name="subject" placeholder="Subject">
                            </div>
                            <div class="form-group">
                                <textarea name="message" placeholder="Your Message" required></textarea>
                            </div>
                            <button type="submit" class="btn">Send Message</button>
                        `;
                    });
                }
                
                // Scroll to success message
                contactForm.scrollIntoView({ behavior: 'smooth' });
            })
            .catch(error => {
                // Show error message
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                // Create error message if it doesn't exist
                let errorMessage = contactForm.querySelector('.error-message');
                if (!errorMessage) {
                    errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    contactForm.prepend(errorMessage);
                }
                
                errorMessage.textContent = 'There was a problem sending your message. Please try again.';
                errorMessage.style.display = 'block';
            });
        });
    }
});

// Testimonials slider functionality - continuous loop with constant speed
function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    
    if (!slider || slides.length === 0) return;
    
    // Clone slides for seamless infinite loop
    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        slider.appendChild(clone);
    });
    
    let position = 0;
    let speed = .8; // pixels per frame - constant speed
    let animationId;
    
    // Function to animate the slider at constant speed
    function animateSlider() {
        position -= speed;
        
        // Reset position for seamless loop when first set of slides is out of view
        const slideWidth = slides[0].offsetWidth;
        const resetPoint = -slideWidth * slides.length;
        
        if (position <= resetPoint) {
            position = 0;
        }
        
        slider.style.transform = `translateX(${position}px)`;
        animationId = requestAnimationFrame(animateSlider);
    }
    
    // Start animation
    animationId = requestAnimationFrame(animateSlider);
    
    // Handle visibility change (pause when tab is not visible)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animationId = requestAnimationFrame(animateSlider);
        }
    });
}

// Initialize testimonials slider when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Other code...
    
    // Initialize testimonials slider
    initTestimonialsSlider();
});
