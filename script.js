
document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('body > header');
    if (!nav) return;

    const ul = nav.querySelector('ul');
    const links = Array.from(ul.querySelectorAll('a'));

    // Accessibility roles
    ul.setAttribute('role', 'menubar');
    links.forEach(a => {
        a.setAttribute('role', 'menuitem');
        a.setAttribute('tabindex', '0');
    });

    // Create mobile toggle
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Toggle navigation');
    toggle.innerHTML = '<span></span>';
    nav.insertBefore(toggle, ul);

    toggle.addEventListener('click', function () {
        const opened = ul.classList.toggle('open');
        toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });

    // Create animated indicator (desktop)
    const indicator = document.createElement('span');
    indicator.className = 'nav-indicator';
    ul.appendChild(indicator);

    function updateIndicator(targetLink, instant) {
        if (!targetLink) return;
        const linkRect = targetLink.getBoundingClientRect();
        const ulRect = ul.getBoundingClientRect();
        const left = linkRect.left - ulRect.left;
        indicator.style.width = linkRect.width + 'px';
        indicator.style.transform = `translateX(${left}px)`;
        if (instant) {
            indicator.style.transition = 'none';
            requestAnimationFrame(() => indicator.style.transition = '');
        }
    }

    // Set initial active link (first if none)
    let active = ul.querySelector('a.active') || links[0];
    if (!active) active = links[0];
    links.forEach(l => l.classList.remove('active'));
    if (active) active.classList.add('active');

    // Click / keyboard behavior
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            // mark active
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            active = link;
            updateIndicator(link);
            // close menu on small screens
            if (window.innerWidth <= 780) {
                ul.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
            // let default anchor behavior occur (if href="#", page won't navigate)
        });

        link.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
            // left/right navigation for large screens
            const idx = links.indexOf(link);
            if (e.key === 'ArrowRight') {
                links[(idx + 1) % links.length].focus();
            } else if (e.key === 'ArrowLeft') {
                links[(idx - 1 + links.length) % links.length].focus();
            }
        });
    });

    // Update indicator on resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 780) {
            if (!document.body.contains(indicator)) ul.appendChild(indicator);
            updateIndicator(active, true);
        } else {
            // hide indicator on small screens
            if (indicator.parentNode) indicator.parentNode.removeChild(indicator);
        }
    });

    // Initial placement
    if (window.innerWidth > 780) updateIndicator(active, true);
});
