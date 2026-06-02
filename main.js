// ==========================================================================
// INTERACTIVE PORTFOLIO ACTIONS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initStaggeredEntrance();
  initMouseGlowAndTilt();
  initRippleEffect();
  initThemeToggle();
  initShareAction();
});

/**
 * 1. Staggered Entrance Animation
 * Adds smooth fade-in and slide-up transition delays to each card.
 */
function initStaggeredEntrance() {
  const cards = document.querySelectorAll('.link-card');
  const avatar = document.querySelector('.avatar-wrapper');
  const info = document.querySelector('.profile-info');
  const footer = document.querySelector('.app-footer');
  const topNav = document.querySelector('.top-nav');

  // Initial opacity configurations
  const elements = [topNav, avatar, info, ...cards, footer];
  
  elements.forEach((el, index) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + (index * 75));
  });
}

/**
 * 2. Mouse Glow & 3D Tilt Effect
 * Tracks mouse position for individual hover glow grids and calculates 
 * dynamic angles for 3D card tilts.
 */
function initMouseGlowAndTilt() {
  const cards = document.querySelectorAll('.link-card');

  cards.forEach(card => {
    // Mouse Move Event: Glow + Tilt
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element

      // Update Glow Mask properties
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Calculate Tilt
      const cardWidth = rect.width;
      const cardHeight = rect.height;
      const centerX = rect.left + cardWidth / 2;
      const centerY = rect.top + cardHeight / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Restrict rotation to max 6 degrees for a premium look
      const maxRotation = 6;
      const rotateX = (-mouseY / (cardHeight / 2)) * maxRotation;
      const rotateY = (mouseX / (cardWidth / 2)) * maxRotation;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.025) translateY(-5px)`;
    });

    // Mouse Leave Event: Reset Card Transform smoothly
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateY(0)';
      // Reset glow to center
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });

    // Touch Support for mobile (brief pulse highlight on touch start)
    card.addEventListener('touchstart', () => {
      card.style.transform = 'scale(0.97)';
    }, { passive: true });

    card.addEventListener('touchend', () => {
      card.style.transform = 'scale(1)';
    }, { passive: true });
  });
}

/**
 * 3. Dynamic Click/Tap Ripple Effect
 * Creates a circular glowing ripple on any click or screen tap coordinates.
 */
function initRippleEffect() {
  const container = document.getElementById('ripple-container');
  if (!container) return;

  window.addEventListener('click', (e) => {
    // Avoid ripples if clicking links or interactive elements directly to avoid double triggers
    const target = e.target;
    if (target.closest('a') || target.closest('button')) {
      return;
    }

    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    // Set positions relative to window
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    
    // Randomize ripple size slightly
    const size = Math.floor(Math.random() * 60) + 120;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;

    container.appendChild(ripple);

    // Clean up DOM after animation completes
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  });
}

/**
 * 4. Style & Theme Switcher
 * Swaps CSS variable profiles between Dark glassmorphism and Light glassmorphism.
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const nextTheme = currentTheme === 'dark-container' ? 'default' : 'dark-container';
    
    document.documentElement.setAttribute('data-theme', nextTheme);
    
    // Rotate toggle icon for micro-animation feedback
    const svg = toggleBtn.querySelector('svg');
    if (svg) {
      const currentRotation = svg.style.transform ? parseInt(svg.style.transform.replace(/[^\d]/g, '')) : 0;
      svg.style.transform = `rotate(${currentRotation + 360}deg)`;
    }
  });
}

/**
 * 5. Share Utilities (Native Share & Clipboard Fallback)
 * Triggers the browser share menu on mobile or copies link + fires Toast notification.
 */
function initShareAction() {
  const shareBtn = document.getElementById('share-btn');
  const toast = document.getElementById('toast-notification');

  const shareData = {
    title: 'Vio Links',
    text: 'Check out Vio\'s portfolio, work links, and professional profiles!',
    url: window.location.origin
  };

  const handleShare = async (e) => {
    e.preventDefault();
    
    // Try native share API first
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return; // Shared successfully
      } catch (err) {
        // User cancelled or share failed, fallback to clipboard
        console.warn('Native share failed, falling back to clipboard copy:', err);
      }
    }

    // Fallback: Copy link to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast();
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Could not copy link. Here is the link: ' + window.location.href);
    }
  };

  if (shareBtn) shareBtn.addEventListener('click', handleShare);

  function showToast() {
    if (!toast) return;
    
    toast.classList.add('show');
    
    // Remove Toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}
