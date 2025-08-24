// Hair Affair Website JavaScript
// Handles mobile navigation, smooth scrolling, and accessibility features

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.mobile-menu a');
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        
        // Toggle aria-expanded attribute
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle mobile menu visibility
        mobileMenu.setAttribute('aria-hidden', isExpanded);
        
        // Add/remove body scroll lock when menu is open
        if (!isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking on navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = mobileMenuToggle.contains(event.target) || mobileMenu.contains(event.target);
        const isMenuOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        
        if (!isClickInsideNav && isMenuOpen) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    });
    
    // Keyboard navigation for mobile menu
    mobileMenuToggle.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            mobileMenuToggle.click();
        }
    });
    
    // Escape key to close mobile menu
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const isMenuOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            if (isMenuOpen) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                mobileMenuToggle.focus(); // Return focus to toggle button
            }
        }
    });
    
    // Smooth scrolling for navigation links
    const allNavLinks = document.querySelectorAll('a[href^="#"]');
    
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active navigation state
                updateActiveNavigation(targetId);
                
                // Focus management for accessibility
                setTimeout(() => {
                    targetSection.focus();
                    targetSection.setAttribute('tabindex', '-1');
                }, 500);
            }
        });
    });
    
    // Update active navigation state
    function updateActiveNavigation(activeId) {
        // Remove current active state
        document.querySelectorAll('.nav-menu a[aria-current="page"]').forEach(link => {
            link.removeAttribute('aria-current');
        });
        
        // Add active state to current section
        const activeLink = document.querySelector(`.nav-menu a[href="${activeId}"]`);
        if (activeLink) {
            activeLink.setAttribute('aria-current', 'page');
        }
    }
    
    // Scroll spy functionality
    function handleScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100; // Offset for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = '#' + section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                updateActiveNavigation(sectionId);
            }
        });
    }
    
    // Throttled scroll event listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScrollSpy, 10);
    });
    
    // Header background opacity on scroll
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll (optional enhancement)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Team member photo hover accessibility
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        const photoContainer = member.querySelector('.member-photo-container');
        const quote = member.querySelector('.member-quote');
        
        if (photoContainer && quote) {
            // Add keyboard support for hover effect
            photoContainer.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    photoContainer.classList.toggle('active');
                }
            });
            
            // Make photo container focusable
            photoContainer.setAttribute('tabindex', '0');
            photoContainer.setAttribute('role', 'button');
            photoContainer.setAttribute('aria-label', 'View team member quote');
            
            // Add focus and blur events for accessibility
            photoContainer.addEventListener('focus', function() {
                this.classList.add('focused');
            });
            
            photoContainer.addEventListener('blur', function() {
                this.classList.remove('focused');
                this.classList.remove('active');
            });
        }
    });
    
    // Form validation and enhancement (if forms are added later)
    function enhanceFormAccessibility() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // Add required field indicators
                if (input.hasAttribute('required')) {
                    const label = form.querySelector(`label[for="${input.id}"]`);
                    if (label && !label.querySelector('.required-indicator')) {
                        const indicator = document.createElement('span');
                        indicator.className = 'required-indicator';
                        indicator.textContent = ' *';
                        indicator.setAttribute('aria-label', 'required field');
                        label.appendChild(indicator);
                    }
                }
                
                // Add error message containers
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    const errorContainer = document.createElement('div');
                    errorContainer.className = 'error-message';
                    errorContainer.setAttribute('role', 'alert');
                    errorContainer.setAttribute('aria-live', 'polite');
                    input.parentNode.insertBefore(errorContainer, input.nextSibling);
                }
            });
        });
    }
    
    // Call form enhancement if forms exist
    enhanceFormAccessibility();
    
    // Intersection Observer for animations (performance-friendly)
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.service-card, .team-member, .about-stats');
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Prefers reduced motion support
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Disable smooth scrolling for users who prefer reduced motion
        document.documentElement.style.scrollBehavior = 'auto';
    }
    
    // High contrast mode detection and enhancement
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast');
    }
    
    // Focus trap for mobile menu (accessibility enhancement)
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(event) {
            if (event.key === 'Tab') {
                if (event.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        event.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        event.preventDefault();
                    }
                }
            }
        });
    }
    
    // Apply focus trap to mobile menu when open
    const mobileMenuObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'aria-hidden') {
                const isHidden = mobileMenu.getAttribute('aria-hidden') === 'true';
                if (!isHidden) {
                    trapFocus(mobileMenu);
                    // Focus first link in mobile menu
                    const firstLink = mobileMenu.querySelector('a');
                    if (firstLink) {
                        setTimeout(() => firstLink.focus(), 100);
                    }
                }
            }
        });
    });
    
    mobileMenuObserver.observe(mobileMenu, { attributes: true });
    
    // Initialize scroll spy on page load
    handleScrollSpy();
    
    console.log('Hair Affair website JavaScript loaded successfully');
});

