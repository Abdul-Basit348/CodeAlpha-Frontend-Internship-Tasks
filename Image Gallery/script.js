document.addEventListener('DOMContentLoaded', () => {
    
    // --- Elements ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-controls .btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // --- State Variables ---
    let currentIndex = 0;
    let filteredItems = []; // Array to hold currently visible items

    // Initialize with all items visible
    filteredItems = Array.from(galleryItems);

    // --- Filter Functionality ---
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Reset filtered items array
            filteredItems = [];

            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.classList.remove('hide');
                    filteredItems.push(item); // Add to visible list
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });

    // --- Lightbox Functionality ---
    
    // Open Lightbox
    const openLightbox = (index) => {
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    // Update Lightbox Image & Caption
    const updateLightboxImage = () => {
        const item = filteredItems[currentIndex];
        const img = item.querySelector('img');
        
        // Add fade animation reset
        lightboxImg.style.opacity = 0;
        
        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt;
            lightboxImg.style.opacity = 1;
        }, 100);
    };

    // Close Lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    // Navigation (Next/Prev)
    const navigateLightbox = (direction) => {
        if (direction === 'next') {
            currentIndex++;
            if (currentIndex >= filteredItems.length) currentIndex = 0;
        } else {
            currentIndex--;
            if (currentIndex < 0) currentIndex = filteredItems.length - 1;
        }
        updateLightboxImage();
    };

    // --- Event Listeners ---

    // Click on Gallery Items
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Find the index of this item within the *currently filtered* list
            const index = filteredItems.indexOf(item);
            if (index !== -1) {
                openLightbox(index);
            }
        });
    });

    // Lightbox Controls
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox('next');
    });
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox('prev');
    });

    // Close when clicking outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateLightbox('next');
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
    });
});