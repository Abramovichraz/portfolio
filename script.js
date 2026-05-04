// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');

    initBugGame();

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

});

function initBugGame() {
    const bugField = document.querySelector('.bug-field');
    const bugCount = document.getElementById('bug-count');
    const winPopup = document.querySelector('.bug-win-popup');
    const winCloseButton = document.querySelector('.bug-win-close');
    const maxSmashedBugs = 34;
    const moveInterval = 3600;

    if (!bugField || !bugCount) {
        return;
    }

    const bugPositions = [
        { x: 6, y: 22 },
        { x: 94, y: 25 },
        { x: 6, y: 78 },
        { x: 94, y: 64 },
        { x: 20, y: 14 },
        { x: 74, y: 86 },
        { x: 22, y: 86 }
    ];

    let smashed = 0;
    let scrollTimer = null;
    let hasShownWinPopup = false;
    bugCount.textContent = '0';

    if (winPopup && winCloseButton) {
        winCloseButton.addEventListener('click', () => {
            winPopup.hidden = true;
        });

        winPopup.addEventListener('click', event => {
            if (event.target === winPopup) {
                winPopup.hidden = true;
            }
        });
    }

    bugPositions.forEach((position, index) => {
        const bug = document.createElement('button');
        bug.type = 'button';
        bug.className = 'portfolio-bug';
        bug.setAttribute('aria-label', 'Smash bug');
        bug.innerHTML = '<span class="bug-legs"></span><span class="bug-shell"></span><span class="bug-head"></span>';

        placeBug(bug, isSafeBugPosition(position) ? position : findSafeBugPosition(index));

        bug.addEventListener('click', () => {
            if (bug.classList.contains('is-smashed')) {
                return;
            }

            smashed = Math.min(smashed + 1, maxSmashedBugs);
            bugCount.textContent = smashed;
            showBugPop(bugField, bug);
            bug.classList.add('is-smashed');

            window.setTimeout(() => {
                if (smashed >= maxSmashedBugs) {
                    bug.remove();
                    showWinPopup();
                    return;
                }

                const nextPosition = findSafeBugPosition(index);
                placeBug(bug, nextPosition);
                bug.classList.remove('is-smashed');
            }, 420);
        });

        bugField.appendChild(bug);
    });

    window.setInterval(() => {
        if (smashed >= maxSmashedBugs) {
            return;
        }

        moveActiveBugs();
    }, moveInterval);

    window.addEventListener('scroll', () => {
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(moveActiveBugs, 180);
    }, { passive: true });

    function moveActiveBugs() {
        document.querySelectorAll('.portfolio-bug:not(.is-smashed)').forEach((bug, index) => {
            placeBug(bug, findSafeBugPosition(index));
        });
    }

    function showWinPopup() {
        if (!winPopup || hasShownWinPopup) {
            return;
        }

        hasShownWinPopup = true;
        document.querySelectorAll('.portfolio-bug').forEach(bug => bug.remove());
        winPopup.hidden = false;
        winCloseButton?.focus();
    }
}

function placeBug(bug, position) {
    const wiggleX = randomBetween(-24, 24);
    const wiggleY = randomBetween(-24, 24);

    bug.style.left = `${position.x}%`;
    bug.style.top = `${position.y}%`;
    bug.style.setProperty('--bug-angle', `${randomBetween(-35, 35)}deg`);
    bug.style.setProperty('--bug-speed', `${randomBetween(3, 6)}s`);
    bug.style.setProperty('--bug-wiggle-x', `${wiggleX}px`);
    bug.style.setProperty('--bug-wiggle-y', `${wiggleY}px`);
}

function findSafeBugPosition(seed) {
    for (let attempt = 0; attempt < 28; attempt++) {
        const position = randomBugPosition(seed + attempt);

        if (isSafeBugPosition(position)) {
            return position;
        }
    }

    return seed % 2 === 0
        ? { x: randomBetween(4, 7), y: randomBetween(18, 78) }
        : { x: randomBetween(93, 96), y: randomBetween(18, 68) };
}

function randomBugPosition(seed) {
    const edgeBias = [
        { x: randomBetween(4, 7), y: randomBetween(18, 78) },
        { x: randomBetween(93, 96), y: randomBetween(18, 68) },
        { x: randomBetween(12, 26), y: randomBetween(12, 17) },
        { x: randomBetween(74, 88), y: randomBetween(12, 17) },
        { x: randomBetween(12, 28), y: randomBetween(83, 90) },
        { x: randomBetween(56, 72), y: randomBetween(83, 90) }
    ];

    return edgeBias[(seed + Math.floor(Math.random() * edgeBias.length)) % edgeBias.length];
}

function isSafeBugPosition(position) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const x = viewportWidth * (position.x / 100);
    const y = viewportHeight * (position.y / 100);
    const padding = 52;
    const avoidSelectors = [
        '.nav',
        '.bug-counter',
        '.hero-text',
        '.about-content',
        '.skills-grid',
        '.timeline',
        '.cert-grid',
        '.projects-grid',
        '.contact-info'
    ];

    return !avoidSelectors.some(selector => {
        return Array.from(document.querySelectorAll(selector)).some(element => {
            const rect = element.getBoundingClientRect();

            if (rect.bottom < 0 || rect.top > viewportHeight || rect.right < 0 || rect.left > viewportWidth) {
                return false;
            }

            return x >= rect.left - padding &&
                x <= rect.right + padding &&
                y >= rect.top - padding &&
                y <= rect.bottom + padding;
        });
    });
}

function showBugPop(container, bug) {
    const pop = document.createElement('span');

    pop.className = 'bug-pop';
    pop.textContent = '+1';
    pop.style.left = bug.style.left;
    pop.style.top = bug.style.top;

    container.appendChild(pop);
    window.setTimeout(() => pop.remove(), 700);
}

function randomBetween(min, max) {
    return Math.round(min + Math.random() * (max - min));
}
