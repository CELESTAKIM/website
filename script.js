// Smooth scrolling for navigation links
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

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Close menu when clicking overlay
mobileMenuOverlay.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDark);
});

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
}

// Typing animation for hero title
const heroTitle = document.querySelector('.hero-title');
const originalText = heroTitle.textContent;
let isTyping = false;

function typeWriter(text, i = 0) {
    if (i < text.length) {
        heroTitle.textContent = text.substring(0, i + 1);
        setTimeout(() => typeWriter(text, i + 1), 100);
    } else {
        isTyping = false;
    }
}

// Start typing animation when hero is in view
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !isTyping) {
            isTyping = true;
            heroTitle.textContent = '';
            typeWriter(originalText);
        }
    });
}, { threshold: 0.5 });

heroObserver.observe(document.querySelector('.hero'));

// Interactive Timeline
const timeline = document.querySelector('.timeline');
const timelineItems = document.querySelectorAll('.timeline-item');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const progressBar = document.querySelector('.progress-bar');

let currentIndex = 0;
const totalItems = timelineItems.length;

// Initialize timeline
function initTimeline() {
    updateTimeline();
    addTimelineListeners();
}

function updateTimeline() {
    // Update active item
    timelineItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
    });

    // Update navigation buttons
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalItems - 1;

    // Update progress bar
    const progress = ((currentIndex + 1) / totalItems) * 100;
    progressBar.style.width = `${progress}%`;

    // Scroll timeline horizontally on desktop
    if (window.innerWidth > 768 && timeline) {
        const itemWidth = timelineItems[0].offsetWidth + 40; // 40px gap
        const scrollLeft = currentIndex * itemWidth;
        timeline.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }

    // Scroll to active item on mobile
    if (window.innerWidth <= 768) {
        timelineItems[currentIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
}

function addTimelineListeners() {
    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateTimeline();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalItems - 1) {
            currentIndex++;
            updateTimeline();
        }
    });

    // Timeline item clicks
    timelineItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            updateTimeline();
        });

        // Toggle details
        const toggleBtn = item.querySelector('.timeline-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                item.classList.toggle('expanded');
                toggleBtn.textContent = item.classList.contains('expanded') ? 'Read Less' : 'Read More';
            });
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            updateTimeline();
        } else if (e.key === 'ArrowRight' && currentIndex < totalItems - 1) {
            currentIndex++;
            updateTimeline();
        }
    });

    // Handle manual scrolling on desktop
    if (window.innerWidth > 768 && timeline) {
        timeline.addEventListener('scroll', () => {
            const itemWidth = timelineItems[0].offsetWidth + 40; // 40px gap
            const scrollLeft = timeline.scrollLeft;
            const newIndex = Math.round(scrollLeft / itemWidth);

            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalItems) {
                currentIndex = newIndex;
                updateTimeline();
            }
        });
    }

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;

    timeline.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    timeline.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const diffX = startX - endX;
        const threshold = 50;

        if (Math.abs(diffX) > threshold) {
            if (diffX > 0 && currentIndex < totalItems - 1) {
                // Swipe left - next
                currentIndex++;
            } else if (diffX < 0 && currentIndex > 0) {
                // Swipe right - previous
                currentIndex--;
            }
            updateTimeline();
        }
    }
}

// Initialize timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are rendered
    setTimeout(initTimeline, 100);

    // Blog toggle functionality
    const blogToggle = document.getElementById('blogToggle');
    const blogContent = document.getElementById('blogContent');

    if (blogToggle && blogContent) {
        // Start with content expanded
        blogContent.classList.add('expanded');
        blogToggle.textContent = 'Hide Resources ▲';
        blogToggle.classList.add('active');

        blogToggle.addEventListener('click', function() {
            const isExpanded = blogContent.classList.contains('expanded');
            blogContent.classList.toggle('expanded');
            blogToggle.textContent = isExpanded ? 'Show Resources ▼' : 'Hide Resources ▲';
            blogToggle.classList.toggle('active', !isExpanded);
        });
    }


    // Gallery modal functionality
    const galleryImages = document.querySelectorAll('.gallery-image img');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');

    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            document.body.style.overflow = 'hidden';
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Testimonials modal functionality
    const testimonialsBtn = document.getElementById('testimonialsBtn');
    const testimonialsModal = document.getElementById('testimonialsModal');
    const closeTestimonials = document.querySelector('.close-testimonials');

    if (testimonialsBtn && testimonialsModal) {
        testimonialsBtn.addEventListener('click', function() {
            testimonialsModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeTestimonials) {
        closeTestimonials.addEventListener('click', function() {
            testimonialsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    if (testimonialsModal) {
        testimonialsModal.addEventListener('click', function(e) {
            if (e.target === testimonialsModal) {
                testimonialsModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Scroll Progress Bar and Back to Top functionality
    const scrollProgress = document.querySelector('.scroll-progress-bar');
    const backToTopBtn = document.getElementById('backToTop');
    const scrollProgressContainer = document.querySelector('.scroll-progress');

    // Section Navigation
    const sectionNav = document.querySelector('.section-nav');
    const prevSectionBtn = document.getElementById('prevSection');
    const nextSectionBtn = document.getElementById('nextSection');
    const sections = document.querySelectorAll('section[id]');
    let currentSectionIndex = 0;

    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;

        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }

        // Show/hide back to top button
        if (backToTopBtn) {
            if (scrollTop > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Update current section for navigation
        updateCurrentSection();
    }

    function updateCurrentSection() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - 100; // Offset for header
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                currentSectionIndex = index;
            }
        });

        // Update navigation button states
        if (prevSectionBtn && nextSectionBtn) {
            prevSectionBtn.disabled = currentSectionIndex === 0;
            nextSectionBtn.disabled = currentSectionIndex === sections.length - 1;

            prevSectionBtn.style.opacity = currentSectionIndex === 0 ? '0.5' : '1';
            nextSectionBtn.style.opacity = currentSectionIndex === sections.length - 1 ? '0.5' : '1';
        }
    }

    function scrollToSection(index) {
        if (sections[index]) {
            const sectionTop = sections[index].offsetTop - 80; // Offset for header
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        }
    }

    // Section navigation event listeners
    if (prevSectionBtn) {
        prevSectionBtn.addEventListener('click', function() {
            if (currentSectionIndex > 0) {
                scrollToSection(currentSectionIndex - 1);
            }
        });
    }

    if (nextSectionBtn) {
        nextSectionBtn.addEventListener('click', function() {
            if (currentSectionIndex < sections.length - 1) {
                scrollToSection(currentSectionIndex + 1);
            }
        });
    }

    // Show scroll progress and navigation on desktop only
    function handleResize() {
        if (window.innerWidth >= 769) { // Desktop and up
            if (scrollProgressContainer) scrollProgressContainer.style.display = 'block';
            if (backToTopBtn) backToTopBtn.style.display = 'block';
            if (sectionNav) sectionNav.style.display = 'flex';
        } else { // Mobile
            if (scrollProgressContainer) scrollProgressContainer.style.display = 'none';
            if (backToTopBtn) backToTopBtn.style.display = 'none';
            if (sectionNav) sectionNav.style.display = 'none';
        }
    }

    // Back to top functionality
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Event listeners
    window.addEventListener('scroll', updateScrollProgress);
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();
    updateScrollProgress();
});

// 3D Image Modal Functionality
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close-modal');

// Add click event to all clickable images
document.querySelectorAll('.clickable-image').forEach(img => {
    img.addEventListener('click', function() {
        modal.style.display = 'block';
        modalImg.src = this.src;
        modalImg.alt = this.alt;

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    });
});

// Close modal when clicking the close button
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside the image
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Contact Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    // EmailJS setup
    emailjs.init("piIAOD9_TJP1-S498");
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const form = this;
            const status = document.getElementById("status");
            status.innerHTML = "⏳ Sending...";

            emailjs.sendForm("service_2p9fq39", "template_kv4rjih", form)
                .then(() => {
                    const fd = new FormData(form);
                    emailjs.send("service_2p9fq39", "template_8rl13lh", {
                        user_email: fd.get("user_email"),
                        user_name: fd.get("user_name")
                    });
                    status.innerHTML = "✅ Message sent and auto-reply delivered!";
                    form.reset();
                    document.getElementById("website-type").disabled = true;
                    document.getElementById("website-pricing").disabled = true;
                    document.getElementById("website-type").value = "N/A";
                    document.getElementById("website-pricing").value = "N/A";
                }, (error) => {
                    console.error(error);
                    status.innerHTML = "❌ Failed to send.";
                });
        });
    }

    // Handle "Need a Website?" selection
    const websiteNeed = document.getElementById("website-need");
    const typeSelect = document.getElementById("website-type");
    const pricingSelect = document.getElementById("website-pricing");

    if (websiteNeed) {
        websiteNeed.addEventListener("change", function() {
            if (this.value === "N/A") {
                typeSelect.disabled = true;
                typeSelect.value = "N/A";
                pricingSelect.disabled = true;
                pricingSelect.value = "N/A";
            } else {
                typeSelect.disabled = false;
                typeSelect.value = "Company";
                pricingSelect.disabled = false;
                pricingSelect.value = "Cheapest";
            }
        });
    }

    // Initialize form state
    if (websiteNeed && websiteNeed.value === "N/A") {
        typeSelect.disabled = true;
        pricingSelect.disabled = true;
    }

    // WhatsApp Popup Logic
    const openWhatsappPopup = document.getElementById('openWhatsappPopup');
    if (openWhatsappPopup) {
        openWhatsappPopup.addEventListener('click', () => {
            // Create WhatsApp popup if it doesn't exist
            if (!document.getElementById('whatsapp-popup')) {
                const whatsappPopup = document.createElement('div');
                whatsappPopup.id = 'whatsapp-popup';
                whatsappPopup.className = 'whatsapp-popup';
                whatsappPopup.innerHTML = `
                    <div class="whatsapp-header">
                        <span>Chat with Kimathi</span>
                        <button class="close-btn" onclick="this.closest('#whatsapp-popup').style.display='none'">✕</button>
                    </div>
                    <div class="whatsapp-chat-body" id="whatsapp-chat-body">
                        <div class="whatsapp-message other">
                            Hello there! How can I assist you today regarding GIS or Remote Sensing projects?
                        </div>
                        <div class="whatsapp-message self" id="whatsapp-user-message" style="display: none;">
                        </div>
                    </div>
                    <div class="whatsapp-input-area">
                        <textarea id="whatsapp-message-input" placeholder="Type your message..." rows="1"></textarea>
                        <button id="whatsapp-send-btn" class="whatsapp-send-btn">➤</button>
                    </div>
                `;
                document.body.appendChild(whatsappPopup);

                // Add WhatsApp send functionality
                const sendBtn = document.getElementById('whatsapp-send-btn');
                const messageInput = document.getElementById('whatsapp-message-input');
                const userMessageDiv = document.getElementById('whatsapp-user-message');
                const chatBody = document.getElementById('whatsapp-chat-body');

                sendBtn.addEventListener('click', () => {
                    const message = messageInput.value.trim();
                    const phoneNumber = '254101370035';

                    if (message) {
                        userMessageDiv.textContent = message;
                        userMessageDiv.style.display = 'block';
                        messageInput.value = '';

                        // Open WhatsApp
                        const encodedMessage = encodeURIComponent(message);
                        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
                        window.open(whatsappUrl, '_blank');

                        // Add confirmation message
                        setTimeout(() => {
                            const confirmationMessage = document.createElement('div');
                            confirmationMessage.classList.add('whatsapp-message', 'other');
                            confirmationMessage.textContent = "Great! I've received your message on WhatsApp. Let's continue our chat there.";
                            chatBody.appendChild(confirmationMessage);
                            chatBody.scrollTop = chatBody.scrollHeight;
                        }, 1000);
                    } else {
                        alert("Please type a message to send.");
                    }
                });

                // Auto-resize textarea
                messageInput.addEventListener('input', function () {
                    this.style.height = 'auto';
                    this.style.height = (this.scrollHeight) + 'px';
                });
            }

            document.getElementById('whatsapp-popup').style.display = 'block';
            document.getElementById('whatsapp-message-input').focus();
        });
    }
});

// Voice input functionality
function startVoiceInput() {
    const msgField = document.querySelector("textarea[name='message']");
    if (!msgField) return;

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = (event) => {
        msgField.value = event.results[0][0].transcript;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        alert("Speech recognition failed. Please ensure your microphone is working and permission is granted.");
    };
}

// Add fade-in class to CSS dynamically (or you can add it to styles.css)
const style = document.createElement('style');
style.textContent = `
    section {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    section.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    .nav-menu.active {
        left: 0;
    }
    header.scrolled {
        background-color: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
    }
    body.dark-mode header.scrolled {
        background-color: rgba(30, 30, 30, 0.95);
    }

    /* WhatsApp Popup Styles */
    .whatsapp-popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--color-background);
        padding: 0;
        border-radius: 15px;
        box-shadow: 0 10px 30px var(--color-shadow-dark);
        z-index: 2000;
        display: none;
        max-width: 90%;
        width: 350px;
        border: 2px solid #25D366;
    }

    .whatsapp-header {
        background-color: #075E54;
        color: white;
        padding: 15px;
        border-radius: 15px 15px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
    }

    .whatsapp-chat-body {
        padding: 15px;
        height: 250px;
        overflow-y: auto;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><rect width="50" height="50" fill="%23e5ddd5" opacity="0.4"/><circle cx="25" cy="25" r="5" fill="%23d2d2d2" opacity="0.5"/></svg>');
        background-repeat: repeat;
    }

    body[data-theme='dark'] .whatsapp-chat-body {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><rect width="50" height="50" fill="%23262d31" opacity="0.4"/><circle cx="25" cy="25" r="5" fill="%233a4145" opacity="0.5"/></svg>');
    }

    .whatsapp-message {
        padding: 10px 15px;
        border-radius: 10px;
        margin-bottom: 10px;
        max-width: 80%;
        word-wrap: break-word;
        font-size: 0.95rem;
    }

    .whatsapp-message.other {
        background-color: #ffffff;
        align-self: flex-start;
        border-bottom-left-radius: 0;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
    }

    body[data-theme='dark'] .whatsapp-message.other {
        background-color: #2c3940;
        color: var(--color-text-dark);
    }

    .whatsapp-message.self {
        background-color: #dcf8c6;
        margin-left: auto;
        border-bottom-right-radius: 0;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    }

    body[data-theme='dark'] .whatsapp-message.self {
        background-color: #056162;
        color: var(--color-text-dark);
    }

    .whatsapp-input-area {
        display: flex;
        padding: 10px;
        border-top: 1px solid var(--color-border);
        background-color: var(--color-card-background);
        border-radius: 0 0 15px 15px;
    }

    #whatsapp-message-input {
        flex-grow: 1;
        padding: 10px 15px;
        border-radius: 20px;
        border: 1px solid var(--color-border);
        resize: none;
        font-family: inherit;
        font-size: 0.95rem;
        max-height: 100px;
        overflow-y: auto;
    }

    .whatsapp-send-btn {
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        font-weight: bold;
        margin-left: 10px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .whatsapp-send-btn:hover {
        background-color: var(--color-accent);
    }

    .close-btn {
        position: static;
        color: white;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        line-height: 1;
        transition: color 0.2s;
    }

    .close-btn:hover {
        color: var(--color-accent);
    }
`;
document.head.appendChild(style);

// Hide/show hamburger animation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
});

// Add CSS for hamburger animation
const hamburgerStyle = document.createElement('style');
hamburgerStyle.textContent = `
    .hamburger.open span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    .hamburger.open span:nth-child(2) {
        opacity: 0;
    }
    .hamburger.open span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    .hamburger span {
        transition: 0.3s;
    }
`;
document.head.appendChild(hamburgerStyle);