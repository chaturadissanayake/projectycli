document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DYNAMIC GRID GENERATION
    const grid = document.getElementById('masonryGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    const captions = [
        "Terrain Mapping", "Infrastructure Gap", "Water Resource", "Asupini Ella View", 
        "Logistics Route", "Community Hub", "Agricultural Survey", "Canopy Analysis", 
        "Transit Path", "Local Architecture", "Field Monitor", "Asset Verification", 
        "Road Access", "Topography Scan", "Harvest Data", "Village Boundary", "Final Inspection"
    ];
    
    if (grid) {
        captions.forEach((cap, index) => {
            let num = (index + 1).toString().padStart(2, '0');
            let itemDiv = document.createElement('div');
            let filePath = `Assets/field-${num}.jpg`;
            
            // Mobile visibility class logic
            let mobileClass = index > 5 ? 'mobile-hidden' : '';
            
            itemDiv.className = `masonry-item lightbox-trigger ${mobileClass}`;
            itemDiv.setAttribute('role', 'button');
            itemDiv.setAttribute('tabindex', '0');
            itemDiv.setAttribute('aria-label', `View full image of ${cap}`);
            itemDiv.setAttribute('data-lb-src', filePath);
            itemDiv.setAttribute('data-lb-cap', `Field Observation: ${cap}`);
            
            itemDiv.innerHTML = `
                <img src="${filePath}" loading="lazy" alt="Field observation: ${cap}">
                <div class="caption-visible">
                    <span>${num}</span>
                    <span style="font-weight:400; color: #888;">${cap}</span>
                </div>
            `;
            grid.appendChild(itemDiv);
        });
    }

    // Initialize Icons reliably after DOM and resources load
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        window.addEventListener('load', () => lucide.createIcons());
    }

    // 2. LOAD MORE BUTTON LOGIC
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const hiddenItems = document.querySelectorAll('.mobile-hidden');
            hiddenItems.forEach(item => {
                // Remove the class safely before animating to avoid layout snap
                item.classList.remove('mobile-hidden'); 
                gsap.fromTo(item, 
                    { autoAlpha: 0, y: 20 }, 
                    { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.5 }
                );
            });
            this.style.display = 'none'; // Hide button after clicking
        });
    }

    // 3. LIGHTBOX CONTROLLER (Event Delegation)
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbCap = document.getElementById('lb-caption');
    const lbCloseBtn = document.getElementById('lb-close-btn');

    const openLightbox = (src, text) => {
        if (!lb || !lbImg || !lbCap) return;
        lbImg.src = src; 
        lbCap.innerText = text; 
        lb.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    };

    const closeLightbox = () => {
        if (!lb) return;
        lb.classList.remove('active'); 
        document.body.style.overflow = 'auto'; 
        // Clear image source after animation to prevent flashing old image on next open
        setTimeout(() => { if(!lb.classList.contains('active')) lbImg.src = ''; }, 300);
    };

    // Listen for clicks on anything with the 'lightbox-trigger' class
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.lightbox-trigger');
        if (trigger) {
            const src = trigger.getAttribute('data-lb-src');
            const cap = trigger.getAttribute('data-lb-cap');
            openLightbox(src, cap);
        }
    });

    // Keyboard Accessibility (Enter / Spacebar) to open Lightbox
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const trigger = document.activeElement.closest('.lightbox-trigger');
            if (trigger) {
                e.preventDefault(); // Prevent page scroll on spacebar
                const src = trigger.getAttribute('data-lb-src');
                const cap = trigger.getAttribute('data-lb-cap');
                openLightbox(src, cap);
            }
        }
    });

    // Close Lightbox Triggers
    if (lbCloseBtn) {
        lbCloseBtn.addEventListener('click', closeLightbox);
    }

    if (lb) {
        lb.addEventListener('click', (e) => {
            // Only close if clicking the background, not the image itself
            if (e.target === lb) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && lb && lb.classList.contains('active')) {
            closeLightbox();
        }
    });

    // 4. SCROLL PROGRESS & NAVBAR
    window.addEventListener('scroll', function() {
        let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let scrolled = (winScroll / height) * 100;
        
        const progressBar = document.getElementById("progressBar");
        if(progressBar) progressBar.style.width = scrolled + "%";
        
        const navbar = document.getElementById("navbar");
        if (navbar) {
            if (winScroll > 100) { 
                navbar.style.transform = "translateY(0)"; 
            } else { 
                navbar.style.transform = "translateY(-100%)"; 
            }
        }
    });

    // 5. ANIMATIONS (GSAP & ScrollTrigger)
    gsap.registerPlugin(ScrollTrigger);
    
    const heroTL = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 }});
    heroTL.from(".brand-anim", { y: 60, opacity: 0, stagger: 0.2, delay: 0.3 });

    document.querySelectorAll('.section-block, .pdf-section').forEach(sec => {
        gsap.from(sec.querySelectorAll('h2, p, .img-wrapper, .team-card'), {
            y: 50, autoAlpha: 0, duration: 1, stagger: 0.1, ease: "power2.out",
            clearProps: "all", /* FIX: Clears inline styles after animation so hovers work perfectly */
            scrollTrigger: { trigger: sec, start: "top 85%" }
        });
    });

    ScrollTrigger.batch(".masonry-item:not(.mobile-hidden)", {
        onEnter: batch => gsap.to(batch, {autoAlpha: 1, stagger: 0.1}),
        start: "top 90%"
    });
});