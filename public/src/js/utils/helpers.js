// Helper Functions

// Increment score
function incrementScore(inputId) {
    const input = document.getElementById(inputId);
    const currentValue = parseInt(input.value) || 0;
    if (currentValue < 20) {
        input.value = currentValue + 1;
        animateScoreChange(input);
    }
}

// Decrement score
function decrementScore(inputId) {
    const input = document.getElementById(inputId);
    const currentValue = parseInt(input.value) || 0;
    if (currentValue > 0) {
        input.value = currentValue - 1;
        animateScoreChange(input);
    }
}

// Animate score change
function animateScoreChange(input) {
    input.style.transform = 'scale(1.2)';
    input.style.borderColor = '#86BC25';
    setTimeout(() => {
        input.style.transform = 'scale(1)';
        input.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    }, 200);
}

// Create confetti
function createConfetti() {
    const popup = document.querySelector('.allocation-popup');
    const colors = ['#86BC25', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            popup.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }, i * 50);
    }
}

// Open history modal
function openHistory() {
    document.getElementById('historyModal').classList.add('active');
}

// Close history modal
function closeHistory() {
    document.getElementById('historyModal').classList.remove('active');
}

// Submit predictions
function submitPredictions() {
    const predictions = {
        'Brazil vs Morocco': `${document.getElementById('brazil-score').value} - ${document.getElementById('morocco-score').value}`,
        'Spain vs Germany': `${document.getElementById('spain-score').value} - ${document.getElementById('germany-score').value}`,
        'Argentina vs France': `${document.getElementById('argentina-score').value} - ${document.getElementById('france-score').value}`
    };
    
    alert('✅ Predictions Submitted Successfully!\n\n' + 
          Object.entries(predictions).map(([match, score]) => `${match}: ${score}`).join('\n') +
          '\n\nGood luck! 🍀');
    
    showPage('homePage');
}