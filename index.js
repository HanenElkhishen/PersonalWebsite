
const EMAILJS_PUBLIC_KEY = 'XtsiG0iCwWZQBXl9t';
const EMAILJS_SERVICE_ID = 'service_8ldctpd';
const EMAILJS_TEMPLATE_ID = 'template_exwqdge';


if (window.emailjs) {
    try {
        window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    } catch (e) {
        console.error("EmailJS Init Error:", e);
    }
}


const logos = [
    "bootstrap-48.png",
    "css-logo-64.png",
    "git-48.png",
    "html5-48.png",
    "javascript-48.png",
    "jupyter-48.png",
    "linux-48.png",
    "mongodb-48.png",
    "power-bi-48.png",
    "python-48.png"
];

const skillContainer = document.querySelector('.skill-container');

function getSkillName(filename) {
    return filename
        .replace(/\.[^/.]+$/, '')  
        .replace(/-?\d+$/, '')     
        .replace(/-/g, ' ')            
        .trim()
        .replace(/\b\w/g, c => c.toUpperCase());
}

if (skillContainer) {
    skillContainer.innerHTML = logos.map(logo => `
        <div class="skill-card" data-skill-name="${getSkillName(logo)}">
            <img src="logos/${logo}" alt="${getSkillName(logo)} logo" loading="lazy" width="48" height="48">
        </div>
    `).join('');
}

// ===== Portfolio Interactive Animations =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pageLoader = document.querySelector('.page-loader');
const scrollProgress = document.querySelector('.scroll-progress__bar');
const backBtn = document.getElementById('backToTop');
const siteHeader = document.querySelector('.site-header');
const mouseGlow = document.querySelector('.mouse-glow');

// Loader Management
function setLoaderState(isLoading) {
    if (!pageLoader) return;
    pageLoader.classList.toggle('is-active', isLoading);
    if (!isLoading) {
        setTimeout(() => {
            pageLoader.style.display = 'none';
        }, 600);
    }
}

window.addEventListener('load', () => {
    setTimeout(() => setLoaderState(false), prefersReducedMotion ? 0 : 300);
}, { once: true });

// Typing Effect
function initialiseTyping() {
    const roleElement = document.getElementById('typed-role');
    if (!roleElement) return;

    const roles = ['Data Engineer', 'Analytics Engineer', 'Web Developer'];
    if (prefersReducedMotion) {
        roleElement.textContent = roles[0];
        return;
    }

    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    const type = () => {
        const role = roles[roleIndex];
        roleElement.textContent = role.slice(0, characterIndex);

        if (!deleting && characterIndex < role.length) {
            characterIndex += 1;
            setTimeout(type, 75);
        } else if (!deleting) {
            deleting = true;
            setTimeout(type, 1800);
        } else if (characterIndex > 0) {
            characterIndex -= 1;
            setTimeout(type, 35);
        } else {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, 350);
        }
    };

    type();
}

// Active Navigation Observer
function initialiseActiveNavigation() {
    const links = [...document.querySelectorAll('.navigation_menu a')];
    const sections = links
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
        const visibleSection = entries.find(entry => entry.isIntersecting);
        if (!visibleSection) return;
        links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visibleSection.target.id}`));
    }, { rootMargin: '-30% 0px -50%', threshold: 0 });

    sections.forEach(section => observer.observe(section));
}

// Scroll Effects (Header & BackToTop)
function initialiseScrollEffects() {
    let queued = false;
    const update = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
        
        if (scrollProgress) scrollProgress.style.width = `${progress}%`;
        if (backBtn) {
            backBtn.style.display = scrollTop > 400 ? 'flex' : 'none';
        }
        siteHeader?.classList.toggle('is-scrolled', scrollTop > 20);
        queued = false;
    };

    const queueUpdate = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(update);
    };

    window.addEventListener('scroll', queueUpdate, { passive: true });
    update();

    backBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));
}

// Smooth Links
function initialiseSmoothLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }));
}

// Mouse Glow Effect
function initialiseMouseGlow() {
    if (!mouseGlow || prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) return;
    window.addEventListener('pointermove', event => {
        mouseGlow.style.left = `${event.clientX}px`;
        mouseGlow.style.top = `${event.clientY}px`;
        mouseGlow.classList.add('is-active');
    }, { passive: true });
    document.addEventListener('mouseleave', () => mouseGlow.classList.remove('is-active'));
}

// ===== Contact Form Handling (EmailJS) =====
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const submitBtn = contactForm?.querySelector('[data-submit-button]');
let isSubmitting = false;

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showFormMessage(message, state = '') {
    if (!formMessage) return;
    formMessage.className = state ? `is-${state}` : '';
    formMessage.textContent = message;
}

function setSubmissionState(isLoading) {
    isSubmitting = isLoading;
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle('is-loading', isLoading);
    const label = submitBtn.querySelector('[data-submit-label]');
    if (label) label.textContent = isLoading ? 'Sending...' : 'Send Message';
}

contactForm?.addEventListener('submit', async event => {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const error = !name || !email || !subject || !message 
        ? 'Please complete all fields before sending.' 
        : !isValidEmail(email) 
        ? 'Please enter a valid email address.' 
        : '';

    if (error) {
        showFormMessage(error, 'error');
        return;
    }

    if (!window.emailjs) {
        showFormMessage('Email service is currently unavailable. Please try again later or email directly.', 'error');
        return;
    }

    setSubmissionState(true);
    showFormMessage('Sending your message...', 'loading');

    try {
        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { 
            name: name,
            from_name: name, 
            email: email, 
            reply_to: email, 
            subject: subject, 
            message: message 
        });
        contactForm.reset();
        showFormMessage('Thank you :) your message was sent successfully!', 'success');
    } catch (err) {
        console.error('EmailJS Error:', err);
        showFormMessage('There is an error sending your message.', 'error');
    } finally {
        setSubmissionState(false);
    }
});

// Run Initializations
initialiseTyping();
initialiseActiveNavigation();
initialiseScrollEffects();
initialiseSmoothLinks();
initialiseMouseGlow();