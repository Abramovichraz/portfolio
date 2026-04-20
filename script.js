// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to navigation
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.nav');
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.9)';
        }
    });

    // Intersection Observer for section animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Typing effect for code matrix
    const codeLines = document.querySelectorAll('.matrix-line');
    let currentLine = 0;

    function typeWriter() {
        if (currentLine < codeLines.length) {
            codeLines[currentLine].style.opacity = '1';
            currentLine++;
            setTimeout(typeWriter, 500);
        }
    }

    // Start typing effect after a delay
    setTimeout(typeWriter, 1000);
});