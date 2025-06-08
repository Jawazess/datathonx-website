document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorTrailer = document.querySelector('.cursor-trailer');
    let trailerX = 0, trailerY = 0, dotX = 0, dotY = 0;
    window.addEventListener('mousemove', (e) => {
        dotX = e.clientX;
        dotY = e.clientY;
        document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    });
    const animateCursor = () => {
        trailerX += (dotX - trailerX) * 0.1;
        trailerY += (dotY - trailerY) * 0.1;
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
        cursorTrailer.style.transform = `translate(${trailerX - 20}px, ${trailerY - 20}px)`;
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const interactiveElements = 'a, button, .objective-card, .timeline-event';
    document.querySelectorAll(interactiveElements).forEach(el => {
        el.addEventListener('mouseenter', () => cursorTrailer.classList.add('active'));
        el.addEventListener('mouseleave', () => cursorTrailer.classList.remove('active'));
    });
    
    // --- Aurora Glow Card Effect ---
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x-card', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y-card', `${e.clientY - rect.top}px`);
        });
    });

    // --- Magic Navigation Indicator ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const indicator = document.querySelector('.nav-indicator');
    const nav = document.querySelector('.nav-links');

    function moveIndicator(element) {
        if (!element) return;
        indicator.style.width = `${element.offsetWidth}px`;
        indicator.style.left = `${element.offsetLeft}px`;
        indicator.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-magenta');
        
        navLinks.forEach(link => link.classList.remove('active'));
        element.classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => moveIndicator(e.target));
    });

    nav.addEventListener('mouseleave', () => {
        const activeLink = document.querySelector('.nav-links a.active');
        moveIndicator(activeLink);
    });

    // Initialize indicator on the active link
    moveIndicator(document.querySelector('.nav-links a.active'));

    // --- Mobile Navigation ---
    const burger = document.querySelector('.burger');
    const mobileNav = document.querySelector('.nav-links');
    burger.addEventListener('click', () => {
        mobileNav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });

    // --- Scroll-based Logic (Header, Animations, Active Nav Link) ---
    const header = document.querySelector('.main-header');
    const sections = document.querySelectorAll('section');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Animate elements into view
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }

            // Update active nav link on scroll
            if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                const currentId = entry.target.getAttribute('id');
                const newActiveLink = document.querySelector(`.nav-links a[href="#${currentId}"]`);
                moveIndicator(newActiveLink);
            }
        });
    }, { threshold: [0.1, 0.6] });

    document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));
    sections.forEach(sec => scrollObserver.observe(sec));
    
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
});