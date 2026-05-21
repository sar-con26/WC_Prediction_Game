// Navigation Functions

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    setTimeout(() => {
        const page = document.getElementById(pageId);
        if (page) {
            page.classList.add('active');
            
            // Trigger confetti on allocation page
            if (pageId === 'allocationPage') {
                createConfetti();
            }
        }
    }, 300);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const historyModal = document.getElementById('historyModal');
        if (historyModal.classList.contains('active')) {
            closeHistory();
        }
    }
});